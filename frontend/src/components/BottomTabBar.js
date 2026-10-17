import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';

export function BottomTabBar({ activeTab, handleTabPress, t }) {
  return (
    <View style={styles.bottomTabBarContainer}>
      <TouchableOpacity
        style={[styles.bottomTabBtn, activeTab === 'radio' && styles.bottomTabBtnActive]}
        onPress={() => handleTabPress('radio')}
        activeOpacity={0.8}
      >
        <Ionicons
          name={activeTab === 'radio' ? "radio" : "radio-outline"}
          size={22}
          color={activeTab === 'radio' ? "#38bdf8" : "#64748b"}
        />
        <Text style={[styles.bottomTabText, activeTab === 'radio' && styles.bottomTabTextActive]}>
          {t('tabRadio')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.bottomTabBtn, activeTab === 'map' && styles.bottomTabBtnActive]}
        onPress={() => handleTabPress('map')}
        activeOpacity={0.8}
      >
        <Ionicons
          name={activeTab === 'map' ? "map" : "map-outline"}
          size={22}
          color={activeTab === 'map' ? "#38bdf8" : "#64748b"}
        />
        <Text style={[styles.bottomTabText, activeTab === 'map' && styles.bottomTabTextActive]}>
          {t('tabMap')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.bottomTabBtn, activeTab === 'drivers' && styles.bottomTabBtnActive]}
        onPress={() => handleTabPress('drivers')}
        activeOpacity={0.8}
      >
        <Ionicons
          name={activeTab === 'drivers' ? "people" : "people-outline"}
          size={22}
          color={activeTab === 'drivers' ? "#38bdf8" : "#64748b"}
        />
        <Text style={[styles.bottomTabText, activeTab === 'drivers' && styles.bottomTabTextActive]}>
          {t('tabDrivers')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.bottomTabBtn, activeTab === 'settings' && styles.bottomTabBtnActive]}
        onPress={() => handleTabPress('settings')}
        activeOpacity={0.8}
      >
        <Ionicons
          name={activeTab === 'settings' ? "settings" : "settings-outline"}
          size={22}
          color={activeTab === 'settings' ? "#38bdf8" : "#64748b"}
        />
        <Text style={[styles.bottomTabText, activeTab === 'settings' && styles.bottomTabTextActive]}>
          {t('tabSettings')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
