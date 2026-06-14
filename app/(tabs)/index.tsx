import AddWaterModal from '@/components/features/AddWaterModal';
import QuickAddButtons from '@/components/features/QuickAddButtons';
import { LastSipCard, StreakCard } from '@/components/features/StatCards';
import WaterIntakeDisplay from '@/components/features/WaterIntakeDisplay';
import ScreenContent from '@/components/layout/ScreenContent';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';
import { useState } from 'react';
import { View } from 'react-native';

export default function Ritual() {
  const { goal, logs, logDrink } = useWaterBuddyContext();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScreenContent>
      <WaterIntakeDisplay consumedMl={goal?.consumed_ml ?? 0} goalMl={goal?.goal_ml ?? 2500} />
      <QuickAddButtons onQuickAdd={() => logDrink(400, 'Quick Add')} onOther={() => setModalVisible(true)} />
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginVertical: 16 }}>
        <StreakCard
          streakDays={goal?.streak_days ?? 0}
          goalMl={goal?.goal_ml ?? 2500}
          consumedMl={goal?.consumed_ml ?? 0}
        />
        <LastSipCard lastSipAt={logs[0]?.logged_at ?? null} />
      </View>
      <AddWaterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(amount, label, isDefault) => logDrink(amount, label)}
      />
    </ScreenContent>
  );
}
