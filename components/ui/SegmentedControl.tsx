import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
};

export default function SegmentedControl({ options, selected, onChange }: Props) {
  return (
    <View style={styles.wrapper}>
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => onChange(option)}>
            <Text style={styles.label}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 9999,
    padding: 4,
    alignSelf: 'flex-start',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 40,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#E4E9EB',
  },
  label: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    color: colors.tabInactive,
    textAlign: 'center',
  },
});
