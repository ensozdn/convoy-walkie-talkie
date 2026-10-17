import React from 'react';
import { TouchableWithoutFeedback, Keyboard, SafeAreaView, StatusBar, ScrollView, Animated, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { styles } from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';
import { LangSelector } from '../components/LangSelectors';

export function LobbyScreen({ lobbyMode, fadeAnim, slideAnim, logoGlowAnim, setShowGuide, t, username, setUsername, lang, changeLanguage, btnFadeAnim, btn1Anim, handleCreateRoom, btn2Anim, setLobbyMode, handleCopyCode, copied, generatedCode, handleShareCode, handleEnterCreatedRoom, isInputFocused, setIsInputFocused, joinCode, setJoinCode, handleJoinRoom, recentCodes, overlays }) {
  if (lobbyMode === 'home') {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
          <ScrollView
            contentContainerStyle={styles.lobbyScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              {/* 1. Adım: Stilize KONVOY Logos ve Neon Işıltı (Glow) Efekti */}
              <View style={styles.topCardRow}>
                <View style={styles.brandContainer}>
                  <View style={styles.logoIconWrapper}>
                    <Animated.View style={[styles.logoGlowRing, { opacity: logoGlowAnim }]} />
                    <Ionicons name="radio-outline" size={24} color="#38bdf8" />
                  </View>
                  <View style={styles.brandTextWrapper}>
                    <Text style={styles.brandTitle}>KONVOY TELSİZ</Text>
                    <View style={styles.logoBadge}>
                      <Text style={styles.logoBadgeText}>PROFESSIONAL PTT</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.infoGuideButton} onPress={() => setShowGuide(true)} activeOpacity={0.75}>
                  <Ionicons name="help-circle-outline" size={22} color="#38bdf8" />
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>{t('title')}</Text>
              <Text style={styles.subtitle}>{t('subtitle')}</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('yourName')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('enterName')}
                  placeholderTextColor="#64748b"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="words"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              <LangSelector lang={lang} changeLanguage={changeLanguage} />

              <View style={styles.divider} />

              <Animated.View style={[{ width: '100%' }, { opacity: btnFadeAnim, transform: [{ translateY: btn1Anim }] }]}>
                <TouchableOpacity style={styles.createButton} onPress={handleCreateRoom} activeOpacity={0.85}>
                  <View style={styles.btnTitleRow}>
                    <Ionicons name="add-circle" size={22} color="#0f172a" />
                    <Text style={styles.createButtonText}>{t('createConvoy')}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[{ width: '100%' }, { opacity: btnFadeAnim, transform: [{ translateY: btn2Anim }] }]}>
                <TouchableOpacity style={styles.joinOutlineButton} onPress={() => setLobbyMode('join')} activeOpacity={0.85}>
                  <View style={styles.btnTitleRow}>
                    <Ionicons name="log-in-outline" size={22} color="#38bdf8" />
                    <Text style={styles.joinOutlineButtonText}>{t('joinConvoy')}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </ScrollView>
          {overlays}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }

  if (lobbyMode === 'create') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ScrollView
          contentContainerStyle={styles.lobbyScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.topCardRow}>
              <View style={styles.brandContainer}>
                <View style={styles.logoIconWrapper}>
                  <Animated.View style={[styles.logoGlowRing, { opacity: logoGlowAnim }]} />
                  <Ionicons name="radio-outline" size={24} color="#38bdf8" />
                </View>
                <View style={styles.brandTextWrapper}>
                  <Text style={styles.brandTitle}>KONVOY TELSİZ</Text>
                  <View style={styles.logoBadge}>
                    <Text style={styles.logoBadgeText}>PROFESSIONAL PTT</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.infoGuideButton} onPress={() => setShowGuide(true)} activeOpacity={0.75}>
                <Ionicons name="help-circle-outline" size={22} color="#38bdf8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>{t('createReadySub')}</Text>

            <TouchableOpacity style={styles.codeBoxContainer} onPress={handleCopyCode} activeOpacity={0.85}>
              <View style={styles.codeBoxLabelRow}>
                <Ionicons name={copied ? "checkmark-circle" : "copy-outline"} size={14} color={copied ? "#10b981" : "#38bdf8"} />
                <Text style={[styles.codeBoxLabel, copied && styles.codeBoxLabelCopied]}>
                  {copied ? t('copied') : t('tapToCopy')}
                </Text>
              </View>
              <View style={styles.charBoxesRow}>
                {generatedCode.split('').map((char, index) => {
                  if (char === '-') {
                    return (
                      <View key={index} style={styles.charDashContainer}>
                        <Text style={styles.charDashText}>-</Text>
                      </View>
                    );
                  }
                  return (
                    <View key={index} style={[styles.charBox, copied && styles.charBoxCopied]}>
                      <Text style={[styles.charBoxText, copied && styles.charBoxTextCopied]}>
                        {char}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShareCode} activeOpacity={0.85}>
              <View style={styles.btnCenterRow}>
                <Ionicons name="share-social" size={20} color="#ffffff" />
                <Text style={styles.shareButtonText}>{t('sendInvite')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createButton} onPress={handleEnterCreatedRoom} activeOpacity={0.85}>
              <View style={styles.btnCenterRow}>
                <Ionicons name="arrow-forward-circle" size={22} color="#0f172a" />
                <Text style={styles.createButtonText}>{t('enterMyRoom')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setLobbyMode('home')} activeOpacity={0.8}>
              <Text style={styles.backButtonText}>{t('back')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
        {overlays}
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ScrollView
          contentContainerStyle={styles.lobbyScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.topCardRow}>
              <View style={styles.brandContainer}>
                <View style={styles.logoIconWrapper}>
                  <Animated.View style={[styles.logoGlowRing, { opacity: logoGlowAnim }]} />
                  <Ionicons name="radio-outline" size={24} color="#38bdf8" />
                </View>
                <View style={styles.brandTextWrapper}>
                  <Text style={styles.brandTitle}>KONVOY TELSİZ</Text>
                  <View style={styles.logoBadge}>
                    <Text style={styles.logoBadgeText}>PROFESSIONAL PTT</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.infoGuideButton} onPress={() => setShowGuide(true)} activeOpacity={0.75}>
                <Ionicons name="help-circle-outline" size={22} color="#38bdf8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>{t('enterCodeSub')}</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputLabelRow}>
                <Ionicons name="key-outline" size={14} color="#38bdf8" />
                <Text style={styles.inputLabel}>{t('convoyCode')}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.codeInput, isInputFocused && styles.codeInputFocused]}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="ABC-123"
                placeholderTextColor="#64748b"
                value={joinCode}
                onChangeText={setJoinCode}
                autoCapitalize="characters"
                returnKeyType="done"
                onSubmitEditing={handleJoinRoom}
              />
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleJoinRoom} activeOpacity={0.85}>
              <View style={styles.btnCenterRow}>
                <Ionicons name="log-in" size={22} color="#0f172a" />
                <Text style={styles.createButtonText}>{t('join')}</Text>
              </View>
            </TouchableOpacity>

            {/* Son Kullanılan Kodlar (Madde 4) */}
            {recentCodes.length > 0 && (
              <View style={styles.recentCodesContainer}>
                <Text style={styles.recentCodesLabel}>{t('recentCodes')}</Text>
                <View style={styles.recentCodesRow}>
                  {recentCodes.map((code) => (
                    <TouchableOpacity
                      key={code}
                      style={styles.recentCodeChip}
                      onPress={() => setJoinCode(code)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.recentCodeChipText}>{code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.backButton} onPress={() => setLobbyMode('home')} activeOpacity={0.8}>
              <Text style={styles.backButtonText}>{t('back')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
        {overlays}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
