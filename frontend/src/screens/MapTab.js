import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_DEFAULT, Marker, Polyline } from 'react-native-maps';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';
import { formatDriverDistance, formatDriverSpeed, useDrivingRoute } from '../utils/geo';
import { QuickPttDock } from '../components/QuickPttDock';

export function MapTab({
  t, roomCode, connectionState, isSpeakingLocally, handleTalkStart, handleTalkEnd,
  mapType, setMapType, mapRef, userLocation, setIsFollowing, visibleParticipants,
  activeSpeaker, setSelectedUserForAction, setUserActionStep, handleFitAll,
  isFollowing, handleRecenter, leaderName, username, waypoint, setConvoyWaypoint, triggerToast,
}) {
  const [isPickingWaypoint, setIsPickingWaypoint] = useState(false);
  const [selectedDriverName, setSelectedDriverName] = useState(null);
  const mapCenterRef = useRef(userLocation);

  useEffect(() => {
    if (!isPickingWaypoint && userLocation) {
      mapCenterRef.current = { latitude: userLocation.latitude, longitude: userLocation.longitude };
    }
  }, [isPickingWaypoint, userLocation]);

  const isLocalLeader = Boolean(leaderName && leaderName === username);
  const selectedDriver = visibleParticipants.find((p) => p.name === selectedDriverName && !p.isLocal && p.coords);
  const vectorTarget = waypoint || selectedDriver?.coords || null;
  const { routeCoords, isRoadGeometry, roadDistanceText } = useDrivingRoute(userLocation, vectorTarget);
  const waypointDistance = waypoint ? (roadDistanceText || formatDriverDistance(userLocation, waypoint, false)) : null;
  const vectorColor = waypoint
    ? (mapType === 'hybrid' ? COLORS.rxAmberBright : COLORS.rxAmber)
    : (mapType === 'hybrid' ? COLORS.accentCyan : COLORS.accentCyanDark);

  const handleOpenWaypointDirections = () => {
    if (!waypoint) return;
    const { latitude, longitude } = waypoint;
    const url = Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`
      : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) => console.warn('[MapTab] Harita yonlendirme hatasi:', err));
  };

  const handleFocusDriverChip = (participant) => {
    const target = participant.coords || userLocation;
    if (!target) return;
    setIsFollowing(false);
    setSelectedDriverName((prev) => (prev === participant.name ? null : participant.name));
    mapRef.current?.animateToRegion({ latitude: target.latitude, longitude: target.longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 }, 450);
  };

  const handleMapLongPress = (event) => {
    if (!isLocalLeader) return;
    const coord = event?.nativeEvent?.coordinate;
    if (!coord) return;
    setConvoyWaypoint(coord);
    setIsPickingWaypoint(false);
    if (triggerToast) triggerToast(t('toastWaypointSet'));
  };

  const handleMapPress = (event) => {
    if (!isLocalLeader || !isPickingWaypoint) return;
    const coord = event?.nativeEvent?.coordinate;
    if (!coord) return;
    mapCenterRef.current = coord;
    mapRef.current?.animateToRegion({ latitude: coord.latitude, longitude: coord.longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 }, 280);
  };

  const handleStartOrClearPicker = () => {
    if (!isLocalLeader) return;
    if (waypoint) {
      setConvoyWaypoint(null);
      setIsPickingWaypoint(false);
      if (triggerToast) triggerToast(t('toastWaypointCleared'));
    } else {
      setIsFollowing(false);
      setIsPickingWaypoint(true);
    }
  };

  const handleConfirmPickedWaypoint = () => {
    const target = mapCenterRef.current || userLocation;
    if (!target) return;
    setConvoyWaypoint({ latitude: Number(target.latitude), longitude: Number(target.longitude) });
    setIsPickingWaypoint(false);
    if (triggerToast) triggerToast(t('toastWaypointSet'));
  };

  const syncCenter = (r) => {
    if (r?.latitude && r?.longitude) mapCenterRef.current = { latitude: r.latitude, longitude: r.longitude };
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.fullScreenTabContainer}>
        <View style={styles.tabHeaderRow}>
          <View style={styles.tabTitleWrapper}>
            <Ionicons name="map" size={20} color={COLORS.accentCyan} />
            <Text style={styles.tabTitleText}>{t('tabMap')}</Text>
          </View>
          <TouchableOpacity
            style={[styles.mapLayerBtnHeader, mapType === 'hybrid' && styles.mapLayerBtnActive]}
            onPress={() => setMapType((prev) => (prev === 'standard' ? 'hybrid' : 'standard'))}
            activeOpacity={0.8}
          >
            <Ionicons name="layers-outline" size={14} color={mapType === 'hybrid' ? COLORS.white : COLORS.accentCyan} />
            <Text style={[styles.btnLabelText, mapType === 'hybrid' && styles.btnLabelTextActive]}>
              {mapType === 'hybrid' ? t('satellite') : t('standardMap')}
            </Text>
          </TouchableOpacity>
        </View>

        {visibleParticipants.length > 0 && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mapDriverStripScroll}>
              {visibleParticipants.map((p) => {
                const dist = formatDriverDistance(userLocation, p.coords, p.isLocal);
                const isSelected = selectedDriverName === p.name;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.mapDriverChip, p.isLeader && styles.mapDriverChipLeader, isSelected && styles.mapDriverChipActive]}
                    onPress={() => handleFocusDriverChip(p)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={p.isLeader ? 'star' : p.isLocal ? 'navigate-circle' : 'car-sport'} size={12} color={p.isLeader ? COLORS.rxAmberBright : COLORS.accentCyan} />
                    <Text style={styles.mapDriverChipText}>{p.name}</Text>
                    {dist ? <Text style={styles.mapDriverChipDist}>{dist}</Text> : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.fullScreenMapCard}>
          <MapView
            ref={mapRef}
            style={styles.fullScreenMap}
            provider={PROVIDER_DEFAULT}
            mapType={mapType}
            initialRegion={userLocation}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onPanDrag={() => setIsFollowing(false)}
            onRegionChange={syncCenter}
            onRegionChangeComplete={syncCenter}
            onPress={handleMapPress}
            onLongPress={handleMapLongPress}
          >
            {routeCoords && (
              <Polyline
                coordinates={routeCoords}
                strokeColor={vectorColor}
                strokeWidth={isRoadGeometry ? 4.5 : 3.5}
                lineDashPattern={isRoadGeometry ? undefined : [8, 6]}
              />
            )}

            {visibleParticipants.map((p) => {
              const isSpeaking = Boolean(activeSpeaker && activeSpeaker.name === p.name);
              const dist = formatDriverDistance(userLocation, p.coords, p.isLocal);
              const speed = formatDriverSpeed(p.coords);
              const telemetry = [dist, speed].filter(Boolean).join(' • ');
              const markerBg = isSpeaking ? COLORS.txGreenBright : p.isLeader ? COLORS.rxAmber : p.isLocal ? COLORS.accentCyanDark : COLORS.bgElevated;
              return (
                <Marker
                  key={p.id}
                  coordinate={p.coords || userLocation}
                  title={p.isLeader ? `${p.name} (${t('leader')})` : p.name}
                  description={p.isLocal ? t('yourLocation') : `${telemetry ? `${telemetry} • ` : ''}${t('tapForOptions')}`}
                  onCalloutPress={() => {
                    if (!p.isLocal) {
                      setSelectedUserForAction(p);
                      setUserActionStep('menu');
                    }
                  }}
                >
                  <View style={styles.markerContainer}>
                    <View style={[styles.markerNameBadge, { backgroundColor: markerBg }]}>
                      <Text style={styles.markerNameText}>{p.name}{telemetry ? ` • ${telemetry}` : ''}</Text>
                    </View>
                    <View style={[styles.customMarkerPin, { backgroundColor: markerBg }, p.isLeader && styles.customMarkerPinLeader]}>
                      {p.isLeader ? <Ionicons name="star" size={13} color={COLORS.white} /> : <Text style={styles.markerText}>{p.name.charAt(0).toUpperCase()}</Text>}
                    </View>
                  </View>
                </Marker>
              );
            })}

            {waypoint && (
              <Marker
                key={`wp-${waypoint.latitude.toFixed(5)}-${waypoint.longitude.toFixed(5)}`}
                coordinate={{ latitude: waypoint.latitude, longitude: waypoint.longitude }}
                title={t('waypointTitle')}
                description={waypointDistance || ''}
              >
                <View style={styles.markerContainer}>
                  <View style={[styles.markerNameBadge, { backgroundColor: COLORS.rxAmber }]}>
                    <Text style={styles.markerNameText}>{t('waypointTitle')}{waypointDistance ? ` • ${waypointDistance}` : ''}</Text>
                  </View>
                  <View style={styles.waypointMarkerPin}>
                    <Ionicons name="flag" size={15} color={COLORS.white} />
                  </View>
                </View>
              </Marker>
            )}
          </MapView>

          {isPickingWaypoint && (
            <View style={styles.waypointCrosshairOverlay} pointerEvents="none">
              <View style={styles.waypointCrosshairRing}>
                <Ionicons name="flag" size={20} color={COLORS.rxAmberBright} />
              </View>
            </View>
          )}

          {isPickingWaypoint ? (
            <View style={styles.waypointBanner}>
              <View style={styles.waypointBannerLeft}>
                <Ionicons name="locate-outline" size={15} color={COLORS.rxAmberBright} />
                <Text style={styles.waypointBannerText} numberOfLines={1}>{t('waypointPickerHint')}</Text>
              </View>
            </View>
          ) : waypoint ? (
            <View style={styles.waypointBanner}>
              <TouchableOpacity
                style={styles.waypointBannerLeft}
                onPress={() => {
                  setIsFollowing(false);
                  mapRef.current?.animateToRegion({ latitude: waypoint.latitude, longitude: waypoint.longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 }, 600);
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="flag" size={14} color={COLORS.rxAmberBright} />
                <View style={styles.waypointBannerTextCol}>
                  <Text style={styles.waypointBannerText} numberOfLines={1}>{t('waypointTitle')}</Text>
                  {waypointDistance ? <Text style={styles.waypointDistanceSubText} numberOfLines={1}>{waypointDistance}</Text> : null}
                </View>
              </TouchableOpacity>
              <View style={styles.waypointActionsRight}>
                <TouchableOpacity style={styles.waypointNavBtn} onPress={handleOpenWaypointDirections} activeOpacity={0.85}>
                  <Ionicons name="navigate" size={11} color={COLORS.bgPrimary} />
                  <Text style={styles.waypointNavBtnText}>{t('directionsBtn')}</Text>
                </TouchableOpacity>
                {isLocalLeader && (
                  <TouchableOpacity style={styles.waypointClearBtn} onPress={handleStartOrClearPicker}>
                    <Ionicons name="close" size={14} color={COLORS.rxAmberBright} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : null}

          {isPickingWaypoint ? (
            <View style={styles.waypointPickerActionBar}>
              <TouchableOpacity style={styles.waypointCancelBtn} onPress={() => setIsPickingWaypoint(false)} activeOpacity={0.85}>
                <Ionicons name="close" size={15} color={COLORS.textSecondary} />
                <Text style={styles.waypointCancelText}>{t('cancelWaypointBtn')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.waypointConfirmBtn} onPress={handleConfirmPickedWaypoint} activeOpacity={0.85}>
                <Ionicons name="flag" size={15} color={COLORS.bgPrimary} />
                <Text style={styles.waypointConfirmText}>{t('confirmWaypointBtn')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mapBottomControlsRow}>
              <TouchableOpacity style={styles.mapFitBtnOverlay} onPress={handleFitAll} activeOpacity={0.85}>
                <Ionicons name="expand" size={14} color={COLORS.accentCyan} />
                <Text style={styles.btnLabelText}>{t('all')}</Text>
              </TouchableOpacity>
              {isLocalLeader && (
                <TouchableOpacity style={styles.mapLeaderWaypointBtn} onPress={handleStartOrClearPicker} activeOpacity={0.85}>
                  <Ionicons name={waypoint ? 'close-circle-outline' : 'flag-outline'} size={14} color={COLORS.rxAmberBright} />
                  <Text style={styles.mapLeaderWaypointText} numberOfLines={1}>{waypoint ? t('clearWaypointBtn') : t('setWaypointBtn')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.mapFollowBtnOverlay, isFollowing && styles.mapFollowBtnActive]}
                onPress={() => { setSelectedDriverName(null); handleRecenter(); }}
                activeOpacity={0.85}
              >
                <Ionicons name="locate" size={14} color={isFollowing ? COLORS.white : COLORS.accentCyan} />
                <Text style={[styles.btnLabelText, isFollowing && styles.btnLabelTextActive]}>{t('focus')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <QuickPttDock
        roomCode={roomCode} connectionState={connectionState} activeSpeaker={activeSpeaker}
        isSpeakingLocally={isSpeakingLocally} handleTalkStart={handleTalkStart} handleTalkEnd={handleTalkEnd} t={t}
      />
    </View>
  );
}

