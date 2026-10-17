import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';

export function LangSelector({ lang, changeLanguage }) {
  return (
    <View style={styles.langContainer}>
      <Text style={styles.inputLabel}>Language / Dil</Text>
      <View style={styles.langPillsRow}>
        <TouchableOpacity
          style={[styles.langPillBtn, lang === 'tr' && styles.langPillBtnActive]}
          onPress={() => changeLanguage('tr')}
          activeOpacity={0.8}
        >
          <Ionicons name="globe-outline" size={16} color={lang === 'tr' ? '#0f172a' : '#64748b'} />
          <Text style={[styles.langPillText, lang === 'tr' && styles.langPillTextActive]}>TR (TÜRKÇE)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langPillBtn, lang === 'en' && styles.langPillBtnActive]}
          onPress={() => changeLanguage('en')}
          activeOpacity={0.8}
        >
          <Ionicons name="globe-outline" size={16} color={lang === 'en' ? '#0f172a' : '#64748b'} />
          <Text style={[styles.langPillText, lang === 'en' && styles.langPillTextActive]}>EN (ENGLISH)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function MiniLangSelector({ lang, changeLanguage }) {
  return (
    <View style={styles.miniLangRow}>
      <TouchableOpacity
        style={[styles.miniLangBtn, lang === 'tr' && styles.miniLangBtnActive]}
        onPress={() => changeLanguage('tr')}
        activeOpacity={0.8}
      >
        <Text style={[styles.miniLangText, lang === 'tr' && styles.miniLangTextActive]}>TR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.miniLangBtn, lang === 'en' && styles.miniLangBtnActive]}
        onPress={() => changeLanguage('en')}
        activeOpacity={0.8}
      >
        <Text style={[styles.miniLangText, lang === 'en' && styles.miniLangTextActive]}>EN</Text>
      </TouchableOpacity>
    </View>
  );
}
