import SoundIcon from '@/assets/icons/sound.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import IconButton from '../ui/IconButton';

type Props = {
  onSave: (sound: boolean) => void;
  initialSound?: boolean;
};

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
      <Animated.View style={[styles.toggleThumb, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}

export default function FeedbackSection({ onSave, initialSound = true }: Props) {
  const [sound, setSound] = useState(initialSound);

  useEffect(() => {
    setSound(initialSound);
  }, [initialSound]);

  const handleSound = (value: boolean) => {
    setSound(value);
    onSave(value);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Feedback</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.titleContainer}>
            <IconButton icon={SoundIcon} background />

            <View>
              <Text style={styles.title}>Sound</Text>
            </View>
          </View>

          <CustomToggle value={sound} onValueChange={handleSound} />
        </View>
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

  sectionLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.tabInactive,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 32,
    paddingHorizontal: 25,
    shadowColor: '#0062A1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 98, 161, 0.05)',
    elevation: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 25,
  },

  divider: {
    height: 1,
    backgroundColor: colors.headerBorder,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  title: {
    fontFamily: fonts.jakarta,
    fontSize: 18,
    color: '#171C1E',
  },

  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 9999,
    backgroundColor: '#E4E9EB',
    padding: 2,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },

  toggleTrackOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
});
