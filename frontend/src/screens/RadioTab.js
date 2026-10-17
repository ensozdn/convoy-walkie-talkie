import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Animated } from 'react-native';
import { styles } from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import { MiniLangSelector } from '../components/LangSelectors';

export function RadioTab({ connectionState, activeSpeaker, t, isSpeakingLocally, roomCode, visibleParticipants, confirmLeaveRoom, username, lang, changeLanguage, setSelectedUserForAction, setUserActionStep, mapRef, mapType, userLocation, setIsFollowing, handleFitAll, isFollowing, handleRecenter, setMapType, pulseAnim, handleTalkStart, handleTalkEnd }) {
  const isReconnecting = connectionState === 'reconnecting';
  const isDisconnected = connectionState === 'disconnected';
  const isConnected = connectionState === 'connected';
  const someoneElseSpeaking = activeSpeaker && !activeSpeaker.isLocal;

  let pttBgColor = '#dc2626';
  let pttBorderColor = '#ffffff';
  let pttRingColor = '#ef4444';
  let pttText = t('pttDefault');
  let pttDisabled = !isConnected || someoneElseSpeaking;

  if (isReconnecting) {
    pttBgColor = '#f59e0b';
    pttBorderColor = '#fde68a';
    pttRingColor = '#f59e0b';
    pttText = t('pttConnecting');
  } else if (isDisconnected) {
    pttBgColor = '#64748b';
    pttBorderColor = '#94a3b8';
    pttRingColor = '#64748b';
    pttText = t('pttDisconnected');
  } else if (someoneElseSpeaking) {
    pttBgColor = '#475569';
    pttBorderColor = '#94a3b8';
    pttRingColor = '#475569';
    pttText = `${activeSpeaker.name.toUpperCase()} ${t('isSpeaking')}`;
  } else if (isSpeakingLocally) {
    pttBgColor = '#16a34a';
    pttBorderColor = '#bbf7d0';
    pttRingColor = '#22c55e';
    pttText = t('pttSpeaking');
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={styles.card}>
      {/* Üst Bilgi Barı ve Dil Değiştirici */}
      <View style={styles.headerBar}>
        {/* Üst Satır: Oda Kodu + Kişi Rozeti (Sol) & Ayrıl Butonu (Sağ) */}
        <View style={styles.headerTopRow}>
          <View style={styles.roomCodeRow}>
            <Text style={styles.roomCodeText}>#{roomCode}</Text>
            <View style={styles.participantBadge}>
              <Ionicons name="people-outline" size={13} color="#7dd3fc" />
              <Text style={styles.participantBadgeText}>{t('people', visibleParticipants.length)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.leaveButton} onPress={confirmLeaveRoom} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={13} color="#ffffff" />
            <Text style={styles.leaveButtonText}>{t('leave')}</Text>
          </TouchableOpacity>
        </View>

        {/* Alt Satır: Sürücü İsmi & Telsiz Sinyali (Sol) & Dil Seçici (Sağ) */}
        <View style={styles.headerBottomRow}>
          <View style={styles.userInfoRow}>
            <Text style={styles.userText}>
              {t('driver')}: <Text style={styles.userTextHighlight}>{username}</Text>
            </Text>
            <View style={styles.signalBadge}>
              <Ionicons
                name={isReconnecting ? "alert-circle-outline" : "cellular-outline"}
                size={12}
                color={isReconnecting ? "#f59e0b" : "#22c55e"}
              />
              <Text style={[styles.signalBadgeText, { color: isReconnecting ? "#f59e0b" : "#4ade80" }]}>
                {isReconnecting ? t('connecting') : (isDisconnected ? t('disconnected') : 'HD 4G')}
              </Text>
            </View>
          </View>

          <MiniLangSelector lang={lang} changeLanguage={changeLanguage} />
        </View>
      </View>

      {/* Katılımcı Listesi Paneli (UGC: Tıklanabilir ve engellenebilir/şikayet edilebilir) */}
      <View style={styles.participantsPanel}>
        {visibleParticipants.map((p) => {
          const isSpeaking = activeSpeaker && activeSpeaker.name === p.name;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.participantChip, isSpeaking && styles.participantChipSpeaking]}
              onPress={() => {
                if (!p.isLocal) {
                  setSelectedUserForAction(p);
                  setUserActionStep('menu');
                }
              }}
              activeOpacity={p.isLocal ? 1 : 0.75}
            >
              <View style={[styles.avatarBadge, isSpeaking && styles.avatarBadgeSpeaking]}>
                {isSpeaking ? (
                  <Ionicons name="volume-high" size={14} color="#ffffff" />
                ) : (
                  <Text style={[styles.avatarBadgeText, isSpeaking && styles.avatarBadgeTextSpeaking]}>
                    {p.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <Text style={[styles.chipText, isSpeaking && styles.chipTextSpeaking]}>
                {p.name} {p.isLocal ? `(${t('you')})` : ''}
              </Text>
              {!p.isLocal && (
                <Ionicons name="ellipsis-vertical" size={11} color="#64748b" style={{ marginLeft: -2 }} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Native Harita Container (Madde 3: Uydu/Trafik Katmanı Toggle) */}
      <View style={styles.mapCard}>
        <MapView
          ref={mapRef}
          style={styles.map}
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

        <TouchableOpacity style={styles.mapFitBtn} onPress={handleFitAll} activeOpacity={0.8}>
          <Text style={styles.btnLabelText}>{t('all')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mapFollowBtn, isFollowing && styles.mapFollowBtnActive]}
          onPress={handleRecenter}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnLabelText, isFollowing && styles.btnLabelTextActive]}>{t('focus')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mapLayerBtn, mapType === 'hybrid' && styles.mapLayerBtnActive]}
          onPress={() => setMapType(prev => prev === 'standard' ? 'hybrid' : 'standard')}
          activeOpacity={0.8}
        >
          <Ionicons name="layers-outline" size={14} color={mapType === 'hybrid' ? '#ffffff' : '#38bdf8'} />
        </TouchableOpacity>
      </View>

      {/* Push-to-Talk Buton Alanı */}
      <View style={styles.pttContainer}>
        {activeSpeaker && (
          <Animated.View
            style={[
              styles.pulseRing,
              {
                borderColor: pttRingColor,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}

        <TouchableOpacity
          style={[
            styles.pttButton,
            { backgroundColor: pttBgColor, borderColor: pttBorderColor },
            pttDisabled && styles.pttButtonDisabled,
          ]}
          onPressIn={handleTalkStart}
          onPressOut={handleTalkEnd}
          disabled={pttDisabled}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isSpeakingLocally ? "mic" : (someoneElseSpeaking ? "volume-medium" : "mic-outline")}
            size={32}
            color="#ffffff"
            style={{ marginBottom: 4 }}
          />
          <Text style={styles.pttText}>{pttText}</Text>
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
  );
}
