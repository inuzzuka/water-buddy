import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import IconButton from './IconButton';

type Props = TextInputProps & {
  label: string;
  icon: React.FC<SvgProps>;
};

export default function FormInput({ label, icon: Icon, ...props }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.background}>
        <View>
          <IconButton icon={Icon} background />
        </View>
        <TextInput style={styles.input} placeholderTextColor={colors.tabInactive} {...props} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
    alignSelf: 'stretch',
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  background: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 58,
    backgroundColor: colors.lightGray,
    borderRadius: 9999,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.jakarta,
    fontSize: 16,
    color: colors.tabInactive,
    includeFontPadding: false,
  },
});
