import Icon from '@/assets/icons/bell.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';

type FrequencyOption = 60 | 120 | 'custom';

type Props = {
  onSave: (enabled: boolean, frequencyMinutes: number) => void;
  initialEnabled?: boolean;
  initialFrequency?: number;
};

const FREQUENCY_OPTIONS: { label: string; value: FrequencyOption }[] = [
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: 'Custom', value: 'custom' },
];

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

function formatFrequency(minutes: number) {
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes === 60) return '1 hour';
  if (minutes % 60 === 0) return `${minutes / 60} hours`;

  return `${minutes} minutes`;
}

function getFrequencyOption(minutes: number): FrequencyOption {
  if (minutes === 60) return 60;
  if (minutes === 120) return 120;

  return 'custom';
}

export default function RemindersSection({ onSave, initialEnabled = false, initialFrequency = 60 }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [frequency, setFrequency] = useState(initialFrequency);
  const [selectedOption, setSelectedOption] = useState<FrequencyOption>(getFrequencyOption(initialFrequency));

  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    setEnabled(initialEnabled);
    setFrequency(initialFrequency);
    setSelectedOption(getFrequencyOption(initialFrequency));
  }, [initialEnabled, initialFrequency]);

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    onSave(value, frequency);
  };

  const handleFrequency = (option: FrequencyOption) => {
    if (option === 'custom') {
      setCustomModalVisible(true);
      return;
    }

    setSelectedOption(option);
    setFrequency(option);
    onSave(enabled, option);
  };

  const handleCustomConfirm = () => {
    const minutes = parseInt(customInput);

    if (!minutes || minutes <= 0) return;

    setSelectedOption('custom');
    setFrequency(minutes);

    onSave(enabled, minutes);

    setCustomModalVisible(false);
    setCustomInput('');
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Reminders</Text>

      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.titleContainer}>
            <IconButton icon={Icon} background />

            <View>
              <Text style={styles.title}>Reminder</Text>
              <Text style={styles.hint}>Gentle nudges to sip</Text>
            </View>
          </View>

          <CustomToggle value={enabled} onValueChange={handleToggle} />
        </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 25,
    marginVertical: 15,
    gap: 10,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 25,
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
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.tabInactive,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  title: {
    fontFamily: fonts.jakarta,
    fontSize: 18,
    color: colors.redDark,
  },

  hint: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.tabInactive,
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
  },

  frequencyLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
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
    color: colors.tabInactive,
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
    padding: 2,
  },

  toggleTrackOn: {
    backgroundColor: colors.primary,
  },

  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
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
    alignSelf: 'center',
    backgroundColor: colors.headerBorder,
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
  },
});
