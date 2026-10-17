import React from 'react';
import { Animated, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/styles';
import { COLORS } from '../styles/theme';

export function LobbyCreateCard({
  fadeAnim,
  slideAnim,
  setLobbyMode,
  t,
  handleCopyCode,
  copied,
  generatedCode,
  handleEnterCreatedRoom,
  handleShareCode,
}) {
  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.subScreenHeader}>
        <TouchableOpacity style={styles.iconBackBtn} onPress={() => setLobbyMode('home')} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={18} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.subScreenTitle}>{t('convoyReady')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <Text style={[styles.subtitle, { marginBottom: 16 }]}>{t('createReadySub')}</Text>

      <TouchableOpacity style={styles.codeBoxContainer} onPress={handleCopyCode} activeOpacity={0.85}>
        <View style={styles.codeBoxLabelRow}>
          <Ionicons
            name={copied ? 'checkmark-circle' : 'copy-outline'}
            size={14}
            color={copied ? COLORS.txGreenBright : COLORS.accentCyan}
          />
          <Text style={[styles.codeBoxLabel, copied && styles.codeBoxLabelCopied]}>
            {copied ? t('copied') : t('tapToCopy')}
          </Text>
        </View>
        <View style={styles.charBoxesRow}>
          {generatedCode.split('').map((char, index) =>
            char === '-' ? (
              <View key={index} style={styles.charDashContainer}>
                <Text style={styles.charDashText}>-</Text>
              </View>
            ) : (
              <View key={index} style={[styles.charBox, copied && styles.charBoxCopied]}>
                <Text style={[styles.charBoxText, copied && styles.charBoxTextCopied]}>{char}</Text>
              </View>
            )
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createButton} onPress={handleEnterCreatedRoom} activeOpacity={0.85}>
        <View style={styles.btnCenterRow}>
          <Ionicons name="radio" size={20} color={COLORS.bgPrimary} />
          <Text style={styles.createButtonText}>{t('enterMyRoom')}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButton} onPress={handleShareCode} activeOpacity={0.85}>
        <View style={styles.btnCenterRow}>
          <Ionicons name="share-social-outline" size={18} color={COLORS.white} />
          <Text style={styles.shareButtonText}>{t('sendInvite')}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function LobbyJoinCard({
  fadeAnim,
  slideAnim,
  setLobbyMode,
  t,
  isInputFocused,
  setIsInputFocused,
  joinCode,
  setJoinCode,
  handleJoinRoom,
  recentCodes,
}) {
  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.subScreenHeader}>
        <TouchableOpacity style={styles.iconBackBtn} onPress={() => setLobbyMode('home')} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={18} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.subScreenTitle}>{t('joinConvoy')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <Text style={[styles.subtitle, { marginBottom: 16 }]}>{t('enterCodeSub')}</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputLabelRow}>
          <Ionicons name="key-outline" size={14} color={COLORS.accentCyan} />
          <Text style={styles.inputLabel}>{t('convoyCode')}</Text>
        </View>
        <View style={[styles.inputWrapper, isInputFocused && styles.inputWrapperFocused]}>
          <TextInput
            style={[styles.input, styles.codeInput]}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="ABC-123"
            placeholderTextColor={COLORS.textDim}
            value={joinCode}
            onChangeText={setJoinCode}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={handleJoinRoom}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleJoinRoom} activeOpacity={0.85}>
        <View style={styles.btnCenterRow}>
          <Ionicons name="flash" size={19} color={COLORS.bgPrimary} />
          <Text style={styles.createButtonText}>{t('join')}</Text>
        </View>
      </TouchableOpacity>

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
                <Ionicons name="time-outline" size={13} color={COLORS.accentCyan} />
                <Text style={styles.recentCodeChipText}>{code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );
}
