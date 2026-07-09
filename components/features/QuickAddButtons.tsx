import WaterGlass from '@/assets/icons/water-glass.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDefaultWaterLabel } from './AddWaterModal';

type Props = {
  onQuickAdd: (label: string) => void;
  onOther: () => void;
  quickAddLabel?: number;
};

export default function QuickAddButtons({ onQuickAdd, onOther, quickAddLabel = 400 }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.otherButton} onPress={onOther}>
        <WaterGlass width={28} height={28} color={colors.tabInactive} />
        <Text style={styles.otherLabel}>Other</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickAddButton} onPress={() => onQuickAdd(getDefaultWaterLabel())}>
        <WaterGlass width={28} height={28} color={colors.primaryDark} />
        <Text style={styles.quickAddLabel}>+{quickAddLabel} ml</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 25,
    marginVertical: 16,
    justifyContent: 'center',
  },
  otherButton: {
    width: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 25,
    borderRadius: 50,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  otherLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 15,
    color: colors.tabInactive,
  },
  quickAddButton: {
    width: 165,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 20,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  quickAddLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 15,
    color: colors.primaryDark,
  },
});
