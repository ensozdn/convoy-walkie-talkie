import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';
import { formatDriverDistance, formatDriverSpeed } from '../utils/geo';
import { QuickPttDock } from '../components/QuickPttDock';

export function MapTab({
  t,
  roomCode,
  connectionState,
  isSpeakingLocally,
  handleTalkStart,
  handleTalkEnd,
  mapType,
  setMapType,
  mapRef,
  userLocation,
  setIsFollowing,
  visibleParticipants,
  activeSpeaker,
  setSelectedUserForAction,
  setUserActionStep,
  handleFitAll,
  isFollowing,
  handleRecenter,
  leaderName,
  username,
  waypoint,
  setConvoyWaypoint,
  triggerToast,
}) {
  const isLocalLeader = Boolean(leaderName && leaderName === username);
  const waypointDistance = waypoint ? formatDriverDistance(userLocation, waypoint, false) : null;

  const handleMapLongPress = (event) => {
    if (!isLocalLeader) return;
    const coord = event?.nativeEvent?.coordinate;
    if (!coord) return;
    setConvoyWaypoint(coord);
    if (triggerToast) triggerToast(t('toastWaypointSet'));
  };

  const handleToggleLeaderWaypoint = () => {
    if (!isLocalLeader) return;
    if (waypoint) {
      setConvoyWaypoint(null);
      if (triggerToast) triggerToast(t('toastWaypointCleared'));
    } else if (userLocation) {
      setConvoyWaypoint({ latitude: userLocation.latitude, longitude: userLocation.longitude });
      if (triggerToast) triggerToast(t('toastWaypointSet'));
    }
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
            <Ionicons
              name="layers-outline"
              size={14}
              color={mapType === 'hybrid' ? COLORS.white : COLORS.accentCyan}
            />
            <Text style={[styles.btnLabelText, mapType === 'hybrid' && styles.btnLabelTextActive]}>
              {mapType === 'hybrid' ? t('satellite') : t('standardMap')}
            </Text>
          </TouchableOpacity>
        </View>

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
            onLongPress={handleMapLongPress}
          >
            {visibleParticipants.map((p) => {
              const isSpeaking = Boolean(activeSpeaker && activeSpeaker.name === p.name);
              const dist = formatDriverDistance(userLocation, p.coords, p.isLocal);
              const speed = formatDriverSpeed(p.coords);
              const telemetry = [dist, speed].filter(Boolean).join(' • ');
              const markerBg = isSpeaking
                ? COLORS.txGreenBright
                : p.isLeader
                  ? COLORS.rxAmber
                  : p.isLocal
                    ? COLORS.accentCyanDark
                    : COLORS.bgElevated;
              return (
                <Marker
                  key={p.id}
                  coordinate={p.coords || userLocation}
                  title={p.isLeader ? `${p.name} (${t('leader')})` : p.name}
                  description={
                    p.isLocal
                      ? t('yourLocation')
                      : `${telemetry ? `${telemetry} • ` : ''}${t('tapForOptions')}`
                  }
                  onCalloutPress={() => {
                    if (!p.isLocal) {
                      setSelectedUserForAction(p);
                      setUserActionStep('menu');
                    }
                  }}
                >
                  <View style={styles.markerContainer}>
                    <View style={[styles.markerNameBadge, { backgroundColor: markerBg }]}>
                      <Text style={styles.markerNameText}>
                        {p.name}
                        {telemetry ? ` • ${telemetry}` : ''}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.customMarkerPin,
                        { backgroundColor: markerBg },
                        p.isLeader && styles.customMarkerPinLeader,
                      ]}
                    >
                      {p.isLeader ? (
                        <Ionicons name="star" size={13} color={COLORS.white} />
                      ) : (
                        <Text style={styles.markerText}>{p.name.charAt(0).toUpperCase()}</Text>
                      )}
                    </View>
                  </View>
                </Marker>
              );
            })}

            {waypoint && (
              <Marker
                coordinate={{ latitude: waypoint.latitude, longitude: waypoint.longitude }}
                title={t('waypointTitle')}
                description={waypointDistance || ''}
              >
                <View style={styles.markerContainer}>
                  <View style={[styles.markerNameBadge, { backgroundColor: COLORS.rxAmber }]}>
                    <Text style={styles.markerNameText}>
                      {t('waypointTitle')}
                      {waypointDistance ? ` • ${waypointDistance}` : ''}
                    </Text>
                  </View>
                  <View style={styles.waypointMarkerPin}>
                    <Ionicons name="flag" size={15} color={COLORS.white} />
                  </View>
                </View>
              </Marker>
            )}
          </MapView>

          {waypoint && (
            <TouchableOpacity
              style={styles.waypointBanner}
              onPress={() => {
                setIsFollowing(false);
                mapRef.current?.animateToRegion(
                  {
                    latitude: waypoint.latitude,
                    longitude: waypoint.longitude,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                  },
                  600
                );
              }}
              activeOpacity={0.85}
            >
              <View style={styles.waypointBannerLeft}>
                <Ionicons name="flag" size={14} color={COLORS.rxAmberBright} />
                <Text style={styles.waypointBannerText} numberOfLines={1}>
                  {t('waypointTitle')}
                  {waypointDistance ? ` • ${waypointDistance}` : ''}
                </Text>
              </View>
              {isLocalLeader && (
                <TouchableOpacity style={styles.waypointClearBtn} onPress={handleToggleLeaderWaypoint}>
                  <Ionicons name="close" size={14} color={COLORS.rxAmberBright} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.mapFitBtnOverlay} onPress={handleFitAll} activeOpacity={0.85}>
            <Ionicons name="expand" size={14} color={COLORS.accentCyan} />
            <Text style={styles.btnLabelText}>{t('all')}</Text>
          </TouchableOpacity>

          {isLocalLeader && (
            <TouchableOpacity
              style={styles.mapLeaderWaypointBtn}
              onPress={handleToggleLeaderWaypoint}
              activeOpacity={0.85}
            >
              <Ionicons name={waypoint ? 'close-circle-outline' : 'flag-outline'} size={14} color={COLORS.rxAmberBright} />
              <Text style={styles.mapLeaderWaypointText}>
                {waypoint ? t('clearWaypointBtn') : t('setWaypointBtn')}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.mapFollowBtnOverlay, isFollowing && styles.mapFollowBtnActive]}
            onPress={handleRecenter}
            activeOpacity={0.85}
          >
            <Ionicons
              name="locate"
              size={14}
              color={isFollowing ? COLORS.white : COLORS.accentCyan}
            />
            <Text style={[styles.btnLabelText, isFollowing && styles.btnLabelTextActive]}>
              {t('focus')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <QuickPttDock
        roomCode={roomCode}
        connectionState={connectionState}
        activeSpeaker={activeSpeaker}
        isSpeakingLocally={isSpeakingLocally}
        handleTalkStart={handleTalkStart}
        handleTalkEnd={handleTalkEnd}
        t={t}
      />
    </View>
  );
}
