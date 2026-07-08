import Icon from '@/assets/icons/moon.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconButton from '../ui/IconButton';

type Props = {
  initialEnabled?: boolean;
  initialStart?: string;
  initialEnd?: string;
  onSave: (enabled: boolean, start: string, end: string) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? 'AM' : 'PM';
  return { label: `${h}:00 ${ampm}`, value: `${String(i).padStart(2, '0')}:00` };
});

function CustomToggle({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onValueChange(!value)} style={[styles.toggleTrack, value && styles.toggleTrackOn]}>
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </Pressable>
  );
}

function TimePicker({
  visible,
  selected,
  onSelect,
  onClose,
  title,
}: {
  visible: boolean;
  selected: string;
  onSelect: (time: string) => void;
  onClose: () => void;
  title: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.timeList}>
          {HOURS.map((h) => (
            <TouchableOpacity
              key={h.value}
              style={[styles.timeOption, selected === h.value && styles.timeOptionActive]}
              onPress={() => {
                onSelect(h.value);
                onClose();
              }}>
              <Text style={[styles.timeOptionText, selected === h.value && styles.timeOptionTextActive]}>
                {h.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

function formatTime(time: string): string {
  const [h] = time.split(':').map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${hour}:00 ${ampm}`;
}

export default function QuietHoursSection({
  initialEnabled = false,
  initialStart = '22:00',
  initialEnd = '07:00',
  onSave,
}: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);

  useEffect(() => {
    setEnabled(initialEnabled);
    setStart(initialStart);
    setEnd(initialEnd);
  }, [initialEnabled, initialStart, initialEnd]);

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    onSave(value, start, end);
  };

  const handleStartSelect = (time: string) => {
    setStart(time);
    onSave(enabled, time, end);
  };

  const handleEndSelect = (time: string) => {
    setEnd(time);
    onSave(enabled, start, time);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Quiet hours</Text>
      <View style={styles.card}>
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.titleContainer}>
            <IconButton icon={Icon} background />
            <View>
              <Text style={styles.title}>Do not disturb</Text>
              <Text style={styles.hint}>Pause reminders</Text>
            </View>
          </View>
          <CustomToggle value={enabled} onValueChange={handleToggle} />
        </View>

        {/* Time pickers */}
        {enabled && (
          <View style={styles.timeSection}>
            <View style={styles.timeRow}>
              {/* Start time */}
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Start Time</Text>
                <TouchableOpacity style={styles.timeButton} onPress={() => setStartPickerVisible(true)}>
                  <Text style={styles.timeValue}>{formatTime(start)}</Text>
                </TouchableOpacity>
              </View>

              {/* Arrow between times */}
              <View style={styles.arrowContainer}>
                <Text style={styles.timeArrow}>→</Text>
              </View>

              {/* End time */}
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>End Time</Text>
                <TouchableOpacity style={styles.timeButton} onPress={() => setEndPickerVisible(true)}>
                  <Text style={styles.timeValue}>{formatTime(end)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <TimePicker
          visible={startPickerVisible}
          selected={start}
          onSelect={handleStartSelect}
          onClose={() => setStartPickerVisible(false)}
          title="Start Time"
        />
        <TimePicker
          visible={endPickerVisible}
          selected={end}
          onSelect={handleEndSelect}
          onClose={() => setEndPickerVisible(false)}
          title="End Time"
        />
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
    color: colors.tabInactive,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontFamily: fonts.jakarta,
    fontSize: 18,
    lineHeight: 28,
    color: colors.redDark,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.tabInactive,
    marginTop: 2,
  },
  timeSection: {
    borderTopWidth: 1,
    borderTopColor: '#DEE3E5',
    paddingTop: 15,
  },
  arrowContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 14,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeBlock: {
    flex: 1,
    gap: 6,
  },
  timeLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 12,
    color: colors.tabInactive,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF4F6',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeValue: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primaryDark,
  },
  timeArrow: {
    fontFamily: fonts.jakarta,
    fontSize: 14,
    color: colors.tabInactive,
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
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
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
    maxHeight: '60%',
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
  timeList: {
    flexGrow: 0,
  },
  timeOption: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerBorder,
  },
  timeOptionActive: {
    backgroundColor: 'rgba(71, 169, 255, 0.1)',
    borderRadius: 12,
  },
  timeOptionText: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    color: colors.tabInactive,
  },
  timeOptionTextActive: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});
