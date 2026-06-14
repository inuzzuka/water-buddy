import ScreenContent from '@/components/layout/ScreenContent';
import { Text, View } from 'react-native';

export default function Settings() {
  return (
    <ScreenContent>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
        <Text>Settings</Text>
      </View>
    </ScreenContent>
  );
}
