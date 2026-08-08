import ScreenContent from "@/components/layout/ScreenContent";
import AddWaterModal from "@/features/ritual/components/AddWaterModal";
import BuddyMascot from "@/features/ritual/components/BuddyMascot";
import {
  LastSipCard,
  StreakCard,
} from "@/features/ritual/components/LastSipCard";
import { useRitual } from "@/features/ritual/hooks/useRitual";
import QuickAddButtons from "@/features/water/components/QuickAddButtons";
import WaterIntakeDisplay from "@/features/water/components/WaterIntakeDisplay";
import { useState } from "react";
import { View } from "react-native";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Ritual() {
  const { user, goal, logs, consumedMl, defaultQuickAddMl, addWater } =
    useRitual();

  const [modalVisible, setModalVisible] = useState(false);

  const greeting = getGreeting();
  const firstName = user?.first_name ?? "Buddy";

  return (
    <ScreenContent>
      <BuddyMascot
        size={100}
        mascotPosition="down"
        bubble={`${greeting}, ${firstName}! Time for a refreshing sip?`}
      />

      <WaterIntakeDisplay
        consumedMl={consumedMl ?? 0}
        goalMl={goal?.goal_ml ?? 2500}
      />

      <QuickAddButtons
        onQuickAdd={() => addWater(defaultQuickAddMl, "Water", false)}
        onOther={() => setModalVisible(true)}
        quickAddLabel={defaultQuickAddMl}
      />

      <View
        style={{
          flexDirection: "row",
          gap: 12,
          paddingHorizontal: 24,
          marginVertical: 16,
        }}
      >
        <StreakCard
          streakDays={goal?.streak_days ?? 0}
          goalMl={goal?.goal_ml ?? 2500}
          consumedMl={consumedMl ?? 0}
        />

        <LastSipCard lastSipAt={logs[0]?.logged_at ?? null} />
      </View>

      {/* {tip && <BuddyTipCard content={tip.content} />} */}

      <AddWaterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(amount, label, isDefault) => {
          addWater(amount, label, isDefault);
        }}
      />
    </ScreenContent>
  );
}
