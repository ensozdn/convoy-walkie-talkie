import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Animated,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';
import { MiniLangSelector } from '../components/LangSelectors';
import { LobbyCreateCard, LobbyJoinCard } from '../components/LobbySubScreens';
import { ConvoyBanner, RewardedAdButton } from '../components/AdBanners';

const APP_LOGO = require('../../assets/logo-badge.png');

export function LobbyScreen({
  lobbyMode,
  fadeAnim,
  slideAnim,
  logoGlowAnim,
  logoScaleAnim,
  setShowGuide,
  t,
  username,
  setUsername,
  lang,
  changeLanguage,
  handleCreateRoom,
  setLobbyMode,
  handleCopyCode,
  copied,
  generatedCode,
  handleShareCode,
  handleEnterCreatedRoom,
  isInputFocused,
  setIsInputFocused,
  joinCode,
  setJoinCode,
  handleJoinRoom,
  recentCodes,
  overlays,
  ads,
}) {
  const topBar = (
    <View style={styles.lobbyTopBar}>
      <View style={styles.lobbyTopBarRight}>
        <MiniLangSelector lang={lang} changeLanguage={changeLanguage} />
        <TouchableOpacity style={styles.infoGuideButton} onPress={() => setShowGuide(true)} activeOpacity={0.75}>
          <Ionicons name="help-outline" size={18} color={COLORS.accentCyan} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgPrimary} />
        <View style={styles.lobbyOuter}>
          {topBar}

          {lobbyMode === 'create' ? (
            <LobbyCreateCard
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
              setLobbyMode={setLobbyMode}
              t={t}
              handleCopyCode={handleCopyCode}
              copied={copied}
              generatedCode={generatedCode}
              handleEnterCreatedRoom={handleEnterCreatedRoom}
              handleShareCode={handleShareCode}
              isAdFree={ads?.isAdFree}
            />
          ) : lobbyMode === 'join' ? (
            <LobbyJoinCard
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
              setLobbyMode={setLobbyMode}
              t={t}
              isInputFocused={isInputFocused}
              setIsInputFocused={setIsInputFocused}
              joinCode={joinCode}
              setJoinCode={setJoinCode}
              handleJoinRoom={handleJoinRoom}
              recentCodes={recentCodes}
            />
          ) : (
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <View style={styles.lobbyHeroSection}>
                <View style={styles.lobbyLogoWrapper}>
                  <Animated.View
                    style={[
                      styles.lobbyNeonBorder,
                      {
                        opacity: logoGlowAnim,
                        transform: [{ scale: logoScaleAnim || 1 }],
                      },
                    ]}
                  />
                  <Image source={APP_LOGO} style={styles.lobbyLogoImage} resizeMode="cover" fadeDuration={0} />
                </View>
                <Text style={styles.title}>{t('title')}</Text>
                <Text style={styles.subtitle}>{t('subtitle')}</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelRow}>
                    <Ionicons name="person-outline" size={13} color={COLORS.accentCyan} />
                    <Text style={styles.inputLabel}>{t('yourName')}</Text>
                  </View>
                  <View style={[styles.inputWrapper, isInputFocused && styles.inputWrapperFocused]}>
                    <TextInput
                      style={styles.input}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder={t('enterName')}
                      placeholderTextColor={COLORS.textDim}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="words"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                </View>

                <View style={styles.lobbyActionsStack}>
                  <TouchableOpacity style={styles.actionCardPrimary} onPress={handleCreateRoom} activeOpacity={0.85}>
                    <View style={styles.actionCardLeft}>
                      <View style={styles.actionIconCirclePrimary}>
                        <Ionicons name="add-circle" size={24} color={COLORS.bgPrimary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.actionTitlePrimary}>{t('createConvoy')}</Text>
                        <Text style={styles.actionSubPrimary}>{t('createSub')}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.bgPrimary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionCardSecondary}
                    onPress={() => setLobbyMode('join')}
                    activeOpacity={0.85}
                  >
                    <View style={styles.actionCardLeft}>
                      <View style={styles.actionIconCircleSecondary}>
                        <Ionicons name="key-outline" size={22} color={COLORS.accentCyan} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.actionTitleSecondary}>{t('joinConvoy')}</Text>
                        <Text style={styles.actionSubSecondary}>{t('joinSub')}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>

                <RewardedAdButton
                  isAdFree={ads?.isAdFree}
                  remainingHours={ads?.adFreeRemainingHours}
                  onPress={ads?.showRewardedAd}
                  isLoading={ads?.isRewardedLoading}
                  t={t}
                  style={{ marginTop: 10 }}
                />
              </View>
            </Animated.View>
          )}

          <ConvoyBanner isAdFree={ads?.isAdFree} />
        </View>
        {overlays}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
