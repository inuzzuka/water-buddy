import { colors } from '@/constants/colors';
import { Pressable, StyleSheet, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

type Props = {
  icon: React.FC<SvgProps>;
  size?: number;
  color?: string;
  background?: boolean;
  onPress?: () => void;
};

export default function IconButton({
  icon: Icon,
  size = 16,
  color = colors.primary,
  background = true,
  onPress,
}: Props) {
  const content = (
    <View style={[styles.circle, background && styles.circleBackground]}>
      <Icon width={size} height={size} color={color} />
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBackground: {
    backgroundColor: 'rgba(71, 169, 255, 0.1)',
  },
  pressed: {
    opacity: 0.7,
  },
});
