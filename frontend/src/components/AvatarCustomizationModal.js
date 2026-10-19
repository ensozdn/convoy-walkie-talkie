import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../styles/theme';
import {
  AVATAR_PALETTES,
  VEHICLE_TYPES,
  getVehicleIcon,
  resolveAvatarColors,
} from '../utils/avatar';

export function AvatarCustomizationModal({
  visible,
  onClose,
  onSave,
  currentColor,
  currentVehicle,
  username,
  t,
}) {
  const [selectedColor, setSelectedColor] = useState(currentColor || '#38bdf8');
  const [selectedVehicle, setSelectedVehicle] = useState(currentVehicle || 'car');

  useEffect(() => {
    if (visible) {
      setSelectedColor(currentColor || '#38bdf8');
      setSelectedVehicle(currentVehicle || 'car');
    }
  }, [currentColor, currentVehicle, visible]);

  if (!visible) return null;

  const previewPalette = resolveAvatarColors(selectedColor);
  const previewIcon = getVehicleIcon(selectedVehicle) || 'car-sport';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.card}>
          <View style={modalStyles.headerRow}>
            <View style={modalStyles.headerTitleCol}>
              <Text style={modalStyles.titleText}>{t('avatarModalTitle')}</Text>
              <Text style={modalStyles.subText}>{t('avatarModalSub')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.previewBox}>
            <View
              style={[
                modalStyles.previewCircle,
                {
                  backgroundColor: previewPalette.bg,
                  borderColor: selectedColor,
                },
              ]}
            >
              <Ionicons name={previewIcon} size={28} color={selectedColor} />
            </View>
            <Text style={modalStyles.previewUsername} numberOfLines={1}>
              {username || t('you')}
            </Text>
          </View>

          <Text style={modalStyles.sectionTitle}>{t('vehicleSection')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={modalStyles.vehicleScroll}
          >
            {VEHICLE_TYPES.map((v) => {
              const isSelected = selectedVehicle === v.id;
              return (
                <TouchableOpacity
                  key={v.id}
                  style={[
                    modalStyles.vehicleBtn,
                    isSelected && modalStyles.vehicleBtnActive,
                    isSelected && { borderColor: selectedColor },
                  ]}
                  onPress={() => setSelectedVehicle(v.id)}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={v.icon}
                    size={20}
                    color={isSelected ? selectedColor : COLORS.textMuted}
                  />
                  <Text
                    style={[
                      modalStyles.vehicleBtnText,
                      isSelected && { color: COLORS.white, fontWeight: '900' },
                    ]}
                  >
                    {t(v.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={modalStyles.sectionTitle}>{t('colorSection')}</Text>
          <View style={modalStyles.colorRow}>
            {AVATAR_PALETTES.map((p) => {
              const isSelected = selectedColor === p.border;
              return (
                <TouchableOpacity
                  key={p.border}
                  style={[
                    modalStyles.colorCircle,
                    { backgroundColor: p.border },
                    isSelected && modalStyles.colorCircleSelected,
                  ]}
                  onPress={() => setSelectedColor(p.border)}
                  activeOpacity={0.8}
                >
                  {isSelected && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={modalStyles.actionRow}>
            <TouchableOpacity
              style={modalStyles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.75}
            >
              <Text style={modalStyles.cancelBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.saveBtn, { backgroundColor: selectedColor }]}
              onPress={() => onSave({ color: selectedColor, vehicle: selectedVehicle })}
              activeOpacity={0.85}
            >
              <Text style={modalStyles.saveBtnText}>{t('saveProfile')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(6, 11, 20, 0.88)', justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  card: {
    width: '100%', maxWidth: 380, backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.xl, padding: 20, borderWidth: 1.5, borderColor: COLORS.borderHighlight,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerTitleCol: { flex: 1, marginRight: 10 },
  titleText: { color: COLORS.white, fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  subText: { color: COLORS.textMuted, fontSize: 12, marginTop: 4, lineHeight: 16 },
  closeBtn: { padding: 4 },
  previewBox: {
    backgroundColor: COLORS.bgInput, borderRadius: RADIUS.lg, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.borderDefault, marginBottom: 16,
  },
  previewCircle: {
    width: 58, height: 58, borderRadius: 29, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  previewUsername: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  sectionTitle: { color: COLORS.textDim, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  vehicleScroll: { flexDirection: 'row', gap: 8, paddingBottom: 16 },
  vehicleBtn: {
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgInput,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.borderDefault, minWidth: 72, gap: 6,
  },
  vehicleBtnActive: { backgroundColor: COLORS.bgElevated },
  vehicleBtnText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700' },
  colorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, paddingVertical: 4 },
  colorCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  colorCircleSelected: { borderWidth: 2, borderColor: COLORS.white },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cancelBtn: {
    flex: 1, backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, paddingVertical: 12,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.borderDefault,
  },
  cancelBtnText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '800' },
  saveBtn: { flex: 2, borderRadius: RADIUS.md, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: COLORS.bgPrimary, fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
});
