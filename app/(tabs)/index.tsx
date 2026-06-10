import ScreenContent from '@/components/ScreenContent';
import { Text, View } from 'react-native';

export default function Ritual() {
  return (
    <ScreenContent>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Ritual</Text>
      </View>
    </ScreenContent>
  );
}
