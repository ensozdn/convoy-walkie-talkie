export const AVATAR_PALETTES = [
  { bg: 'rgba(56, 189, 248, 0.22)', border: '#38bdf8', text: '#7dd3fc' },
  { bg: 'rgba(34, 197, 94, 0.22)', border: '#22c55e', text: '#86efac' },
  { bg: 'rgba(245, 158, 11, 0.22)', border: '#f59e0b', text: '#fde047' },
  { bg: 'rgba(168, 85, 247, 0.22)', border: '#a855f7', text: '#d8b4fe' },
  { bg: 'rgba(244, 63, 94, 0.22)', border: '#f43f5e', text: '#fda4af' },
  { bg: 'rgba(20, 184, 166, 0.22)', border: '#14b8a6', text: '#5eead4' },
  { bg: 'rgba(234, 88, 12, 0.22)', border: '#ea580c', text: '#fdba74' },
  { bg: 'rgba(99, 102, 241, 0.22)', border: '#6366f1', text: '#a5b4fc' },
];

export const VEHICLE_TYPES = [
  { id: 'car', icon: 'car-sport', labelKey: 'vehicleCar' },
  { id: 'suv', icon: 'car', labelKey: 'vehicleSuv' },
  { id: 'moto', icon: 'bicycle', labelKey: 'vehicleMoto' },
  { id: 'truck', icon: 'bus', labelKey: 'vehicleTruck' },
];

export function getAvatarPalette(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

export function getVehicleIcon(vehicleType) {
  const match = VEHICLE_TYPES.find((v) => v.id === vehicleType);
  return match ? match.icon : null;
}

export function resolveAvatarColors(avatarColor, name = '') {
  if (avatarColor) {
    const found = AVATAR_PALETTES.find((p) => p.border === avatarColor);
    if (found) return found;
    return {
      bg: `${avatarColor}33`,
      border: avatarColor,
      text: avatarColor,
    };
  }
  return getAvatarPalette(name);
}
