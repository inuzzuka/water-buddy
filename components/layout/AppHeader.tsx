import Arrow from '@/assets/icons/arrow.svg';
import WaterDrop from '@/assets/icons/water-drop.svg';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  onBack?: () => void;
};

export default function AppHeader({ title, onBack }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {onBack ? (
          <TouchableOpacity onPress={onBack}>
            <View style={{ transform: [{ scaleX: -1 }] }}>
              <Arrow width={16} height={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        ) : (
          <WaterDrop width={18.67} height={23.34} color={colors.primary} />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {/* <TouchableOpacity style={styles.iconCircle}>
        <BellIcon width={18.67} height={23.33} color={colors.primary} />
      </TouchableOpacity> */}
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 57,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerBorder,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 40,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.primary,
  },
});
