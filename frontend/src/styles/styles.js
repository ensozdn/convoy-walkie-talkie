import { StyleSheet } from 'react-native';
import { lobbyStyles } from './lobbyStyles';
import { radioStyles } from './radioStyles';
import { pttAndStripStyles } from './pttAndStripStyles';
import { tabsStyles } from './tabsStyles';
import { settingsAndModalStyles } from './settingsAndModalStyles';
import { ugcModalStyles } from './ugcModalStyles';

export const styles = StyleSheet.create({
  ...lobbyStyles,
  ...radioStyles,
  ...pttAndStripStyles,
  ...tabsStyles,
  ...settingsAndModalStyles,
  ...ugcModalStyles,
});
