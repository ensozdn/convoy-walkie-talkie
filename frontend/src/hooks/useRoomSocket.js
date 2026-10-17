import { useState } from 'react';
import { io } from 'socket.io-client';
import { BACKEND_URL, DEFAULT_REGION } from '../constants/config';

/**
 * Oda soket bağlantısı: bağlan/ayrıl, katılımcı listesi, konuşan kişi ve bağlantı durumu.
 */
export function useRoomSocket({
  socketRef,
  roomCodeRef,
  usernameRef,
  blockedUsersRef,
  setActiveSpeaker,
  playIncoming,
}) {
  const [connectionState, setConnectionState] = useState('connected');
  const [participants, setParticipants] = useState([]);

  const connect = (name, code, coords) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(BACKEND_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[WS] Sunucuya bağlandı! Socket ID:', socket.id);
      setConnectionState('connected');
      socket.emit('join_room', {
        roomName: code,
        participantName: name,
        coords,
      });
    });

    socket.on('disconnect', () => {
      console.warn('[WS] Sunucu bağlantısı koptu');
      setConnectionState('disconnected');
    });

    socket.on('connect_error', () => {
      setConnectionState('reconnecting');
    });

    socket.on('room_state_update', (data) => {
      if (!data || !data.participants) return;
      const remoteList = data.participants.map((p) => ({
        id: p.name,
        name: p.name,
        isLocal: p.name === name,
        coords: p.coords || DEFAULT_REGION,
      }));
      setParticipants(remoteList);

      if (data.activeSpeaker) {
        if (blockedUsersRef.current.includes(data.activeSpeaker)) {
          setActiveSpeaker(null);
        } else {
          setActiveSpeaker({
            name: data.activeSpeaker,
            isLocal: data.activeSpeaker === name,
          });
        }
      } else {
        setActiveSpeaker(null);
      }
    });

    socket.on('speaker_changed', (data) => {
      if (data && data.activeSpeaker) {
        if (blockedUsersRef.current.includes(data.activeSpeaker)) {
          setActiveSpeaker(null);
        } else {
          setActiveSpeaker({
            name: data.activeSpeaker,
            isLocal: data.activeSpeaker === name,
          });
        }
      } else {
        setActiveSpeaker(null);
      }
    });

    socket.on('audio_incoming', playIncoming);

    socket.on('location_broadcast', (data) => {
      if (!data || !data.participantName || !data.coords) return;
      setParticipants((prev) =>
        prev.map((p) =>
          p.name === data.participantName ? { ...p, coords: data.coords } : p
        )
      );
    });
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave_room', {
        roomName: roomCodeRef.current,
        participantName: usernameRef.current,
      });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnectionState('connected');
  };

  return { connectionState, participants, connect, leaveRoom };
}
