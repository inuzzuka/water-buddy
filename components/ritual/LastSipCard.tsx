import CheckCircleIcon from '@/assets/icons/check-circle.svg';
import ClockIcon from '@/assets/icons/clock.svg';
import FlameIcon from '@/assets/icons/flame.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { StyleSheet, Text, View } from 'react-native';

const STREAK_COLOR = '#934467';

type StreakCardProps = {
  streakDays: number;
  goalMl: number;
  consumedMl: number;
};

type LastSipCardProps = {
  lastSipAt: string | null;
};

function formatLastSip(lastSipAt: string | null): string {
  if (!lastSipAt) return 'No sips yet';
  const diff = Math.floor((Date.now() - new Date(lastSipAt).getTime()) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  const hours = Math.floor(diff / 60);
  return `${hours}h ago`;
}

function getPaceLabel(lastSipAt: string | null): string | null {
  if (!lastSipAt) return null;
  const diff = Math.floor((Date.now() - new Date(lastSipAt).getTime()) / 60000);
  if (diff <= 60) return 'GOOD PACE!';
  if (diff <= 120) return 'KEEP GOING!';
  return 'DRINK UP!';
}

export function StreakCard({ streakDays, goalMl, consumedMl }: StreakCardProps) {
  const progress = Math.min(consumedMl / goalMl, 1);

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.row}>
        <FlameIcon width={16} height={18} color={STREAK_COLOR} />
        <Text style={styles.cardLabel}>Daily Streak</Text>
      </View>

      {/* Value */}
      <Text style={styles.cardValue}>{streakDays} Days</Text>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Faint star watermark */}
      <Text style={styles.watermark}>★</Text>
    </View>
  );
}

export function LastSipCard({ lastSipAt }: LastSipCardProps) {
  const pace = getPaceLabel(lastSipAt);

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.row}>
        <ClockIcon width={20} height={20} color={colors.tabInactive} />
        <Text style={styles.cardLabel}>Last Sip</Text>
      </View>

      {/* Value */}
      <Text style={styles.cardValue}>{formatLastSip(lastSipAt)}</Text>

      {/* Pace badge */}
      {pace && (
        <View style={styles.row}>
          <CheckCircleIcon width={12} height={12} color={STREAK_COLOR} />
          <Text style={styles.paceLabel}>{pace}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 167,
    height: 184,
    backgroundColor: colors.white,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(191, 199, 211, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 50,
    gap: 5,
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 4,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    color: colors.tabInactive,
  },
  cardValue: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    color: colors.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E4E9EB',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: STREAK_COLOR,
    borderRadius: 9999,
    shadowColor: STREAK_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  paceLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: STREAK_COLOR,
  },
  watermark: {
    position: 'absolute',
    bottom: -8,
    right: -4,
    fontSize: 64,
    color: '#171C1E',
    opacity: 0.07,
  },
});
