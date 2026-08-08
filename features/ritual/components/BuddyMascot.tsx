import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { Polygon, Svg } from "react-native-svg";

type Props = {
  size?: number;
  bubble?: string;
  mascotPosition?: "left" | "right" | "up" | "down";
};

export default function BuddyMascot({
  size = 160,
  bubble,
  mascotPosition = "down",
}: Props) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const mascot = (
    <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
      <Image
        source={require("@/assets/images/water-buddy.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Animated.View>
  );

  const bubbleContent = bubble && (
    <View style={styles.bubbleWrapper}>
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{bubble}</Text>
      </View>

      <Svg
        width={20}
        height={10}
        style={[
          styles.arrow,
          mascotPosition === "up" && styles.arrowUp,
          mascotPosition === "left" && styles.arrowLeft,
          mascotPosition === "right" && styles.arrowRight,
        ]}
      >
        <Polygon points="0,0 20,0 10,10" fill={colors.white} />
      </Svg>
    </View>
  );

  if (!bubble) {
    return <View style={styles.container}>{mascot}</View>;
  }

  return (
    <View
      style={[
        styles.container,
        (mascotPosition === "left" || mascotPosition === "right") &&
          styles.horizontal,
      ]}
    >
      {mascotPosition === "left" && mascot}
      {mascotPosition === "up" && mascot}

      {bubbleContent}

      {mascotPosition === "right" && mascot}
      {mascotPosition === "down" && mascot}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  horizontal: {
    flexDirection: "row",
  },

  bubbleWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  bubble: {
    width: 275,
    maxWidth: 297.5,
    paddingHorizontal: 40,
    paddingVertical: 24,
    backgroundColor: colors.white,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: "rgba(71, 169, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },

  bubbleText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary,
    textAlign: "center",
    width: 193,
  },

  arrow: {
    marginTop: -2,
  },

  // Mascot is ABOVE the bubble
  arrowUp: {
    position: "absolute",
    top: -7,
    transform: [{ rotate: "180deg" }],
  },

  // Mascot is LEFT of the bubble
  arrowLeft: {
    position: "absolute",
    left: -7,
    top: "50%",
    transform: [{ rotate: "90deg" }],
  },

  // Mascot is RIGHT of the bubble
  arrowRight: {
    position: "absolute",
    right: -7,
    top: "50%",
    transform: [{ rotate: "-90deg" }],
  },
});
