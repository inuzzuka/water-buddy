import JournalIcon from '@/assets/icons/journal.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import RitualIcon from '@/assets/icons/water-glass.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import type { Href } from 'expo-router';
import { usePathname, useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

const tabs: { name: string; href: Href; icon: React.FC<SvgProps> }[] = [
  { name: 'Ritual', href: '/', icon: RitualIcon },
  { name: 'Journal', href: '/journal', icon: JournalIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

function TabButton({
  name,
  icon: Icon,
  isActive,
  onPress,
}: {
  name: string;
  icon: React.FC<SvgProps>;
  isActive: boolean;
  onPress: () => void;
}) {
  const opacity = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.timing(opacity, { toValue: 0.5, duration: 80, useNativeDriver: true }).start();
  const onPressOut = () => Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();

  return (
    <View style={styles.tabContainer}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.tab, isActive && styles.tabActive]}>
        <Animated.View style={{ opacity, alignItems: 'center', gap: 2 }}>
          <Icon width={20} height={20} color={isActive ? colors.primaryDark : colors.tabInactive} />
          <Text style={[styles.label, isActive && styles.labelActive]}>{name}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

export default function AppFooter() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.footer}>
      {tabs.map(({ name, href, icon }) => (
        <TabButton key={name} name={name} icon={icon} isActive={pathname === href} onPress={() => router.push(href)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 95,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 60,
    gap: 2,
    borderRadius: 9999,
  },
  tabActive: {
    backgroundColor: colors.tabActiveBg,
    width: 100,
  },
  label: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    lineHeight: 24,
    color: colors.tabInactive,
  },
  labelActive: {
    color: colors.tabActive,
  },
});
