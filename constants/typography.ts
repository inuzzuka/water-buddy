import { TextStyle } from 'react-native';

export const fonts = {
  regular: 'NunitoSans_400Regular',
  bold: 'NunitoSans_700Bold',
  jakarta: 'PlusJakartaSans_400Regular',
};

export const typography = {
  h2: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
  } as TextStyle,
};
