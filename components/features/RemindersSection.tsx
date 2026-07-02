import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../ui/Button';

type FrequencyOption = 60 | 120 | 'custom';

type Props = {
  userId: number;
  onSave: (enabled: boolean, frequencyMinutes: number) => void;
  initialEnabled?: boolean;
  initialFrequency?: number;
};

const FREQUENCY_OPTIONS: { label: string; value: FrequencyOption }[] = [
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: 'Custom', value: 'custom' },
];

async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function CustomToggle({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <Pressable onPress={() => onValueChange(!value)} style={[styles.toggleTrack, value && styles.toggleTrackOn]}>
      <Animated.View
        style={[
          styles.toggleThumb,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </Pressable>
  );
}

export async function scheduleReminders(frequencyMinutes: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Water Buddy 💧',
      body: 'Time for a refreshing sip! Your buddy is thirsty.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: frequencyMinutes * 60,
      repeats: true,
    },
  });
}

function formatFrequency(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes === 60) return '1 hour';
  if (minutes % 60 === 0) return `${minutes / 60} hours`;
  return `${minutes} minutes`;
}

export default function RemindersSection({ userId, onSave, initialEnabled = false, initialFrequency = 60 }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [frequency, setFrequency] = useState<number>(initialFrequency);
  const [selectedOption, setSelectedOption] = useState<FrequencyOption>(
    initialFrequency === 60 ? 60 : initialFrequency === 120 ? 120 : 'custom',
  );
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    setEnabled(initialEnabled);
    setFrequency(initialFrequency);
    setSelectedOption(initialFrequency === 60 ? 60 : initialFrequency === 120 ? 120 : 'custom');
  }, [initialEnabled, initialFrequency]);

  const handleToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestPermissions();
      if (!granted) return;
      await scheduleReminders(frequency);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    setEnabled(value);
    onSave(value, frequency);
  };

  const handleFrequency = async (option: FrequencyOption) => {
    if (option === 'custom') {
      setCustomModalVisible(true);
      return;
    }
    setSelectedOption(option);
    setFrequency(option);
    if (enabled) await scheduleReminders(option);
    onSave(enabled, option);
  };

  const handleCustomConfirm = async () => {
    const minutes = parseInt(customInput);
    if (!minutes || minutes <= 0) return;
    setSelectedOption('custom');
    setFrequency(minutes);
    if (enabled) await scheduleReminders(minutes);
    onSave(enabled, minutes);
    setCustomModalVisible(false);
    setCustomInput('');
  };

  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.sectionLabel}>Reminders</Text>
          <Text style={styles.hint}>Gentle nudges to sip</Text>
        </View>
        <CustomToggle value={enabled} onValueChange={handleToggle} />
      </View>

      {/* Frequency - only when enabled */}
      {enabled && (
        <View style={styles.frequencySection}>
          <View style={styles.frequencyHeader}>
            <Text style={styles.frequencyLabel}>Frequency</Text>
            <Text style={styles.frequencyValue}>Set to {formatFrequency(frequency)}</Text>
          </View>
          <View style={styles.options}>
            {FREQUENCY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.option, selectedOption === opt.value && styles.optionActive]}
                onPress={() => handleFrequency(opt.value)}>
                <Text style={[styles.optionText, selectedOption === opt.value && styles.optionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Custom modal - always rendered */}
      <Modal
        visible={customModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCustomModalVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setCustomModalVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Custom Frequency</Text>
          <Text style={styles.sheetHint}>How often should we remind you? (in minutes)</Text>
          <TextInput
            style={styles.input}
            value={customInput}
            onChangeText={setCustomInput}
            keyboardType="numeric"
            placeholder="e.g. 45"
            placeholderTextColor={colors.tabInactive}
            autoFocus
          />
          <Button label="Set Reminder" onPress={handleCustomConfirm} disabled={!customInput} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 25,
    marginHorizontal: 25,
    marginVertical: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 4,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.redDark,
  },
  hint: {
    fontFamily: fonts.jakarta,
    fontSize: 13,
    color: colors.tabInactive,
    marginTop: 2,
  },
  frequencySection: {
    borderTopWidth: 1,
    borderTopColor: '#DEE3E5',
    paddingTop: 15,
    gap: 12,
  },
  frequencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequencyLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    color: colors.tabInactive,
  },
  frequencyValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
  },
  options: {
    flexDirection: 'row',
    gap: 15,
  },
  option: {
    width: 90,
    height: 60,
    borderRadius: 9999,
    backgroundColor: '#EFF4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  optionText: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    color: colors.tabInactive,
    textAlign: 'center',
  },
  optionTextActive: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 9999,
    backgroundColor: '#DEE3E5',
    justifyContent: 'center',
    padding: 2,
  },
  toggleTrackOn: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.white,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.headerBorder,
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
  },
  sheetHint: {
    fontFamily: fonts.jakarta,
    fontSize: 14,
    color: colors.tabInactive,
  },
  input: {
    height: 54,
    borderRadius: 9999,
    backgroundColor: '#EFF4F6',
    paddingHorizontal: 20,
    fontFamily: fonts.jakarta,
    fontSize: 16,
    color: colors.primaryDark,
  },
});
