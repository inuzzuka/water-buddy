import LightbulbIcon from '@/assets/icons/lightbulb.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  content: string;
};

export default function BuddyTipCard({ content }: Props) {
  return (
    <View style={styles.outer}>
      <View style={styles.card}>
        <View style={styles.inner}>
          {/* Left: icon pinned to top */}
          <View style={styles.iconCircle}>
            <LightbulbIcon width={18.75} height={25} color={colors.primary} />
          </View>

          {/* Right: title + quote flowing naturally */}
          <View style={styles.textColumn}>
            <Text style={styles.title}>Water Buddy Tip</Text>
            <Text style={styles.quote}>"{content}"</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    alignSelf: 'stretch',
  },
  card: {
    backgroundColor: 'rgba(71, 169, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(71, 169, 255, 0.2)',
    borderRadius: 48,
    padding: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    // remove elevation: 4
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(71, 169, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textColumn: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    color: colors.primary,
  },
  quote: {
    fontFamily: fonts.regular,
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 26,
    color: colors.tabInactive,
  },
});
