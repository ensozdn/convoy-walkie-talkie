const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function isValidCoordinate(coord) {
  return (
    Boolean(coord) &&
    typeof coord.latitude === 'number' &&
    typeof coord.longitude === 'number' &&
    Number.isFinite(coord.latitude) &&
    Number.isFinite(coord.longitude)
  );
}

export function calculateDistanceMeters(coordA, coordB) {
  if (!isValidCoordinate(coordA) || !isValidCoordinate(coordB)) {
    return null;
  }

  const dLat = toRadians(coordB.latitude - coordA.latitude);
  const dLon = toRadians(coordB.longitude - coordA.longitude);
  const lat1 = toRadians(coordA.latitude);
  const lat2 = toRadians(coordB.latitude);

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return EARTH_RADIUS_METERS * centralAngle;
}

export function formatDriverDistance(localCoords, remoteCoords, isLocal) {
  if (isLocal) return null;
  const meters = calculateDistanceMeters(localCoords, remoteCoords);
  if (meters === null) return null;

  if (meters < 10) {
    return '< 10 m';
  }
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const kilometers = meters / 1000;
  if (kilometers >= 100) {
    return `${Math.round(kilometers)} km`;
  }
  return `${kilometers.toFixed(1)} km`;
}

export function formatDriverSpeed(coords) {
  const speed = coords?.speedKmh;
  if (typeof speed !== 'number' || !Number.isFinite(speed) || speed < 0) {
    return '0 km/h';
  }
  return `${Math.round(speed)} km/h`;
}
