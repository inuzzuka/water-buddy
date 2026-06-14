import { FOOTER_HEIGHT } from '@/constants/layout';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScreenContent({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: 'transparent' }}
      contentContainerStyle={[styles.content, { paddingBottom: FOOTER_HEIGHT + insets.bottom }]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingTop: 16,
  },
});
