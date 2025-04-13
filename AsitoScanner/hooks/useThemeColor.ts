/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 * 
 * NOTE: Dark theme has been deprecated. Only light theme is now supported.
 */

import { Colors } from '@/constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // Always use light theme
  const theme = 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
