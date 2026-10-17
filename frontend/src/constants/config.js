import { Dimensions } from 'react-native';

export const BACKEND_URL = 'https://convoy-walkie-talkie-radio.onrender.com';

const { width, height } = Dimensions.get('window');
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_DEVICE = SCREEN_HEIGHT < 812;
export const IS_TINY_DEVICE = SCREEN_HEIGHT < 700;

export const DEFAULT_REGION = {
  latitude: 40.9882,
  longitude: 28.9056,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};
