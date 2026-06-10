import ScreenContent from '@/components/ScreenContent';
import { Text, View } from 'react-native';

export default function Journal() {
  return (
    <ScreenContent>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Journal</Text>
      </View>
    </ScreenContent>
  );
}
