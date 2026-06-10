import Bell from '@/assets/icons/bell.svg';
import WaterDrop from '@/assets/icons/water-drop.svg';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AppHeader({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <WaterDrop width={18.67} height={23.34} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <TouchableOpacity style={styles.iconCircle}>
        <Bell width={18.67} height={23.33} color={colors.primary} />
      </TouchableOpacity>
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
