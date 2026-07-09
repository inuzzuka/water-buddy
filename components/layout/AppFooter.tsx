import JournalIcon from '@/assets/icons/journal.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import RitualIcon from '@/assets/icons/water-glass.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import type { Href } from 'expo-router';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

type Tab = { name: string; href: Href; icon: React.FC<SvgProps> };

const tabs: Tab[] = [
  { name: 'Journal', href: '/journal', icon: JournalIcon },
  { name: 'Ritual', href: '/', icon: RitualIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export default function AppFooter() {
  const router = useRouter();
  const pathname = usePathname();

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.href === pathname),
  );

  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width / tabs.length;
    if (width !== tabWidth) setTabWidth(width);
  };

  useEffect(() => {
    if (!tabWidth) return;
    Animated.spring(indicatorX, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }, [activeIndex, tabWidth]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.footer} onLayout={onLayout}>
        {tabWidth > 0 && (
          <Animated.View
            style={[
              styles.indicator,
              {
                width: tabWidth - 12,
                transform: [{ translateX: Animated.add(indicatorX, 6) }],
              },
            ]}
          />
        )}

        {tabs.map((tab, index) => (
          <TabButton key={tab.name} tab={tab} isActive={index === activeIndex} onPress={() => router.push(tab.href)} />
        ))}
      </View>
    </View>
  );
}

function TabButton({ tab, isActive, onPress }: { tab: Tab; isActive: boolean; onPress: () => void }) {
  const Icon = tab.icon;
  const scale = useRef(new Animated.Value(isActive ? 1 : 0.92)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isActive ? 1 : 0.92,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
  }, [isActive]);

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, friction: 5, tension: 200 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: isActive ? 1 : 0.92, useNativeDriver: true, friction: 5, tension: 160 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} hitSlop={10} style={styles.tab}>
      <Animated.View style={{ alignItems: 'center', gap: 4, transform: [{ scale }] }}>
        <Icon width={20} height={20} color={isActive ? colors.primaryDark : colors.tabInactive} />
        <Text style={[styles.label, isActive && styles.labelActive]}>{tab.name}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 25,
  },
  footer: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: 0,
    borderRadius: 20,
    backgroundColor: colors.tabActiveBg,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  label: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    color: colors.tabInactive,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.tabActive,
    fontWeight: '600',
  },
});
