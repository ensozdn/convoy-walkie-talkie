import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';

export function MapTab({ t, mapType, setMapType, mapRef, userLocation, setIsFollowing, visibleParticipants, activeSpeaker, lang, setSelectedUserForAction, setUserActionStep, handleFitAll, isFollowing, handleRecenter }) {
  return (
    <View style={styles.fullScreenTabContainer}>
      <View style={styles.tabHeaderRow}>
        <View style={styles.tabTitleWrapper}>
          <Ionicons name="map" size={20} color="#38bdf8" />
          <Text style={styles.tabTitleText}>{t('tabMap')}</Text>
        </View>
        <TouchableOpacity
          style={[styles.mapLayerBtnHeader, mapType === 'hybrid' && styles.mapLayerBtnActive]}
          onPress={() => setMapType(prev => prev === 'standard' ? 'hybrid' : 'standard')}
          activeOpacity={0.8}
        >
          <Ionicons name="layers-outline" size={14} color={mapType === 'hybrid' ? '#ffffff' : '#38bdf8'} />
          <Text style={[styles.btnLabelText, mapType === 'hybrid' && styles.btnLabelTextActive]}>
            {mapType === 'hybrid' ? 'UYDU' : 'STANDART'}
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
        >
          {visibleParticipants.map(p => {
            const isSpeaking = activeSpeaker && activeSpeaker.name === p.name;
            return (
              <Marker
                key={p.id}
                coordinate={p.coords || userLocation}
                title={p.name}
                description={p.isLocal ? t('yourLocation') : `${t('convoyMember')} • (${lang === 'tr' ? 'İşlemler için dokunun' : 'Tap for options'})`}
                onCalloutPress={() => {
                  if (!p.isLocal) {
                    setSelectedUserForAction(p);
                    setUserActionStep('menu');
                  }
                }}
              >
                <View style={styles.markerContainer}>
                  <View style={[styles.markerNameBadge, isSpeaking && styles.markerNameBadgeSpeaking, { backgroundColor: isSpeaking ? '#16a34a' : (p.isLocal ? '#0284c7' : '#0d9488') }]}>
                    <Text style={styles.markerNameText}>{p.name}</Text>
                  </View>
                  <View style={[styles.customMarkerPin, isSpeaking && styles.customMarkerPinSpeaking, { backgroundColor: isSpeaking ? '#22c55e' : (p.isLocal ? '#0284c7' : '#0d9488') }]}>
                    <Text style={styles.markerText}>{p.name.charAt(0).toUpperCase()}</Text>
                  </View>
                </View>
              </Marker>
            );
          })}
        </MapView>

        <TouchableOpacity style={styles.mapFitBtnOverlay} onPress={handleFitAll} activeOpacity={0.85}>
          <Ionicons name="expand" size={14} color="#38bdf8" />
          <Text style={styles.btnLabelText}>{t('all')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mapFollowBtnOverlay, isFollowing && styles.mapFollowBtnActive]}
          onPress={handleRecenter}
          activeOpacity={0.85}
        >
          <Ionicons name="locate" size={14} color={isFollowing ? "#ffffff" : "#38bdf8"} />
          <Text style={[styles.btnLabelText, isFollowing && styles.btnLabelTextActive]}>{t('focus')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
