import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import * as Haptics from 'expo-haptics';
import { io } from 'socket.io-client';
import { BACKEND_URL, DEFAULT_REGION } from '../constants/config';
import { warmUpBackend } from '../utils/serverWarmup';

const HEARTBEAT_INTERVAL_MS = 15000;
const PING_DISPLAY_MS = 5500;

export function useRoomSocket({
  socketRef, roomCodeRef, usernameRef, blockedUsersRef,
  userLocation, setActiveSpeaker, playIncoming, avatarColor, vehicleType,
}) {
  const [connectionState, setConnectionState] = useState('connected');
  const [participants, setParticipants] = useState([]);
  const [leaderName, setLeaderName] = useState(null);
  const [waypoint, setWaypoint] = useState(null);
  const [activePing, setActivePing] = useState(null);
  const latestCoordsRef = useRef(userLocation || DEFAULT_REGION);
  const latestWaypointRef = useRef(null);
  const isSessionActiveRef = useRef(false);
  const heartbeatTimerRef = useRef(null);
  const pingTimerRef = useRef(null);
  const avatarColorRef = useRef(avatarColor);
  const vehicleTypeRef = useRef(vehicleType);

  useEffect(() => {
    if (userLocation) latestCoordsRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {
    avatarColorRef.current = avatarColor;
    vehicleTypeRef.current = vehicleType;
    if (socketRef.current?.connected && roomCodeRef.current && usernameRef.current) {
      socketRef.current.emit('update_profile', {
        roomName: roomCodeRef.current, participantName: usernameRef.current,
        avatarColor, vehicleType,
      });
    }
  }, [avatarColor, roomCodeRef, socketRef, usernameRef, vehicleType]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  const clearPingTimer = useCallback(() => {
    if (pingTimerRef.current) {
      clearTimeout(pingTimerRef.current);
      pingTimerRef.current = null;
    }
  }, []);

  const emitJoinCurrentRoom = useCallback((socketInstance) => {
    const activeSocket = socketInstance || socketRef.current;
    const roomName = roomCodeRef.current;
    const participantName = usernameRef.current;
    if (!activeSocket || !roomName || !participantName) return;

    activeSocket.emit('join_room', {
      roomName, participantName, coords: latestCoordsRef.current,
      avatarColor: avatarColorRef.current, vehicleType: vehicleTypeRef.current,
    });
    if (latestWaypointRef.current && latestWaypointRef.current.setBy === participantName) {
      activeSocket.emit('set_waypoint', {
        roomName, participantName,
        coords: { latitude: latestWaypointRef.current.latitude, longitude: latestWaypointRef.current.longitude },
      });
    }
  }, [roomCodeRef, socketRef, usernameRef]);

  const startHeartbeat = useCallback((socketInstance) => {
    stopHeartbeat();
    heartbeatTimerRef.current = setInterval(() => {
      const activeSocket = socketInstance || socketRef.current;
      const roomName = roomCodeRef.current;
      const participantName = usernameRef.current;
      if (!activeSocket?.connected || !roomName || !participantName) return;
      activeSocket.emit('heartbeat', {
        roomName, participantName, coords: latestCoordsRef.current,
        avatarColor: avatarColorRef.current, vehicleType: vehicleTypeRef.current,
      });
    }, HEARTBEAT_INTERVAL_MS);
  }, [roomCodeRef, socketRef, stopHeartbeat, usernameRef]);

  const applyActiveSpeaker = useCallback((speakerName) => {
    if (!speakerName || blockedUsersRef.current.includes(speakerName)) {
      setActiveSpeaker(null);
      return;
    }
    setActiveSpeaker({
      name: speakerName,
      isLocal: speakerName === usernameRef.current,
    });
  }, [blockedUsersRef, setActiveSpeaker, usernameRef]);

  const connect = useCallback((name, code, coords) => {
    stopHeartbeat();
    clearPingTimer();
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    roomCodeRef.current = code;
    usernameRef.current = name;
    if (coords) latestCoordsRef.current = coords;
    isSessionActiveRef.current = true;

    console.log('[WS] Odaya baglaniliyor:', code, 'Kullanici:', name);
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[WS CONNECTED] Sunucuya baglandi, soket id:', socket.id);
      setConnectionState('connected');
      emitJoinCurrentRoom(socket);
      startHeartbeat(socket);
    });

    socket.on('disconnect', () => {
      setConnectionState(isSessionActiveRef.current ? 'reconnecting' : 'disconnected');
    });

    socket.on('connect_error', (err) => {
      console.warn('[WS CONNECT ERROR]:', err?.message ?? err);
      setConnectionState('reconnecting');
    });

    socket.io.on('reconnect_attempt', () => setConnectionState('reconnecting'));
    socket.io.on('reconnect', () => {
      setConnectionState('connected');
      emitJoinCurrentRoom(socket);
    });

    socket.on('room_state_update', (data) => {
      if (!data || !Array.isArray(data.participants)) return;
      console.log('[WS ODA DURUMU] Katilimcilar:', data.participants.map((p) => p.name));
      const currentName = usernameRef.current;
      const resolvedLeader = data.leaderName ?? data.participants[0]?.name ?? null;
      setLeaderName(resolvedLeader);
      if (data.waypoint) {
        latestWaypointRef.current = data.waypoint;
        setWaypoint(data.waypoint);
      } else if ('waypoint' in data && !latestWaypointRef.current) {
        setWaypoint(null);
      }

      setParticipants(
        data.participants.map((p) => ({
          id: p.name,
          name: p.name,
          isLocal: p.name === currentName,
          isLeader: Boolean(p.isLeader || (resolvedLeader && p.name === resolvedLeader)),
          coords: p.coords || DEFAULT_REGION,
          avatarColor: p.avatarColor,
          vehicleType: p.vehicleType,
        }))
      );
      applyActiveSpeaker(data.activeSpeaker);
    });

    socket.on('waypoint_updated', (data) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const nextWp = data?.waypoint ?? null;
      latestWaypointRef.current = nextWp;
      setWaypoint(nextWp);
    });

    socket.on('speaker_changed', (data) => applyActiveSpeaker(data?.activeSpeaker ?? null));
    socket.on('audio_incoming', playIncoming);

    socket.on('location_broadcast', (data) => {
      if (!data?.participantName || !data?.coords) return;
      setParticipants((prev) =>
        prev.map((p) => (p.name === data.participantName ? { ...p, coords: data.coords } : p))
      );
    });

    socket.on('quick_ping_incoming', (data) => {
      if (!data?.sender || !data?.pingType) return;
      if (blockedUsersRef.current.includes(data.sender)) return;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      clearPingTimer();
      setActivePing({
        id: data.id || Date.now(),
        sender: data.sender,
        pingType: data.pingType,
        isLocal: data.sender === usernameRef.current,
      });
      pingTimerRef.current = setTimeout(() => setActivePing(null), PING_DISPLAY_MS);
    });
  }, [
    applyActiveSpeaker, blockedUsersRef, clearPingTimer, emitJoinCurrentRoom,
    playIncoming, roomCodeRef, socketRef, startHeartbeat, stopHeartbeat, usernameRef,
  ]);

  const sendQuickPing = useCallback((pingType) => {
    const activeSocket = socketRef.current;
    const roomName = roomCodeRef.current;
    const sender = usernameRef.current;
    if (!activeSocket?.connected || !roomName || !sender) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    activeSocket.emit('quick_ping', { roomName, sender, pingType });
  }, [roomCodeRef, socketRef, usernameRef]);

  const setConvoyWaypoint = useCallback((coords) => {
    const roomName = roomCodeRef.current;
    const participantName = usernameRef.current;
    const nextWp = coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number'
      ? { latitude: coords.latitude, longitude: coords.longitude, setBy: participantName || 'Leader', timestamp: Date.now() }
      : null;
    latestWaypointRef.current = nextWp;
    setWaypoint(nextWp);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const activeSocket = socketRef.current;
    if (activeSocket?.connected && roomName && participantName) {
      activeSocket.emit('set_waypoint', {
        roomName, participantName,
        coords: nextWp ? { latitude: nextWp.latitude, longitude: nextWp.longitude } : null,
      });
    }
  }, [roomCodeRef, socketRef, usernameRef]);

  const leaveRoom = useCallback(() => {
    isSessionActiveRef.current = false;
    stopHeartbeat();
    clearPingTimer();
    setActivePing(null);
    setLeaderName(null);
    latestWaypointRef.current = null;
    setWaypoint(null);
    if (socketRef.current) {
      socketRef.current.emit('leave_room', { roomName: roomCodeRef.current, participantName: usernameRef.current });
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setParticipants([]);
    setConnectionState('connected');
  }, [clearPingTimer, roomCodeRef, socketRef, stopHeartbeat, usernameRef]);

  const connectFnRef = useRef(connect);
  connectFnRef.current = connect;
  const emitJoinFnRef = useRef(emitJoinCurrentRoom);
  emitJoinFnRef.current = emitJoinCurrentRoom;

  useEffect(() => {
    const warmupAbort = new AbortController();
    warmUpBackend(warmupAbort.signal);

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') return;
      if (!isSessionActiveRef.current || !roomCodeRef.current) {
        warmUpBackend(warmupAbort.signal);
        return;
      }
      const activeSocket = socketRef.current;
      if (!activeSocket) connectFnRef.current(usernameRef.current, roomCodeRef.current, latestCoordsRef.current);
      else if (activeSocket.connected) emitJoinFnRef.current(activeSocket);
      else { setConnectionState('reconnecting'); activeSocket.connect(); }
    });

    return () => {
      warmupAbort.abort();
      appStateSubscription.remove();
      stopHeartbeat();
      clearPingTimer();
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [clearPingTimer, roomCodeRef, socketRef, stopHeartbeat, usernameRef]);

  return {
    connectionState, participants, leaderName, waypoint, setConvoyWaypoint,
    activePing, sendQuickPing, connect, leaveRoom, syncRoomIdentity: emitJoinCurrentRoom,
  };
}
