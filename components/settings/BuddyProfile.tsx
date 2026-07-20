import EditIcon from '@/assets/icons/edit.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { User } from '@/db/types';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  user: User;
  onManageAccount: () => void;
};

const LEVEL_TITLES: Record<number, string> = {
  1: 'Hydration Rookie',
  2: 'Water Wanderer',
  3: 'Sip Starter',
  5: 'Flow Explorer',
  8: 'Hydration Hero',
  12: 'Aqua Champion',
  20: 'Water Wizard',
};

function getLevelTitle(level: number): string {
  const keys = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  const match = keys.find((k) => level >= k);
  return match ? LEVEL_TITLES[match] : 'Hydration Rookie';
}

export default function BuddyProfile({ user, onManageAccount }: Props) {
  return (
    <View style={styles.card}>
      {/* Watermark mascot */}
      <Image source={require('@/assets/images/water-buddy.png')} style={styles.mascot} resizeMode="contain" />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.textBlock}>
          <Text style={styles.label}>Buddy Profile</Text>
          <Text style={styles.name}>
            {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.level}>
            Level {user.level} {getLevelTitle(user.level)}
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onManageAccount}>
          <EditIcon width={15} height={15} color={colors.primary} />
          <Text style={styles.buttonText}>Manage Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 25,
    marginVertical: 15,
    backgroundColor: colors.white,
    borderRadius: 32,
    borderWidth: 0,
    shadowColor: colors.primaryDark,
    elevation: 5,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  mascot: {
    position: 'absolute',
    width: 175,
    height: 175,
    right: -45,
    bottom: -35,
    opacity: 0.1,
    transform: [{ rotate: '12deg' }],
  },
  content: {
    padding: 25,
    gap: 12,
    zIndex: 1,
  },
  textBlock: {
    gap: 5,
  },
  label: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.redDark,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    color: colors.black,
  },
  level: {
    fontFamily: fonts.regular,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
    color: colors.tabInactive,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonText: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary,
  },
});
