import AddWaterModal from '@/components/features/AddWaterModal';
import BuddyMascot from '@/components/features/BuddyMascot';
import BuddyTipCard from '@/components/features/BuddyTipCard';
import QuickAddButtons from '@/components/features/QuickAddButtons';
import { LastSipCard, StreakCard } from '@/components/features/StatCards';
import WaterIntakeDisplay from '@/components/features/WaterIntakeDisplay';
import ScreenContent from '@/components/layout/ScreenContent';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';
import { useState } from 'react';
import { View } from 'react-native';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Ritual() {
  const { user, goal, logDrink, defaultQuickAddMl, setDefaultQuickAddMl, tip, logs } = useWaterBuddyContext();

  const [modalVisible, setModalVisible] = useState(false);

  const greeting = getGreeting();
  const firstName = user?.first_name ?? 'Buddy';

  return (
    <ScreenContent>
      <BuddyMascot size={100} bubble={`${greeting}, ${firstName}! Time for a refreshing sip?`} />
      <WaterIntakeDisplay consumedMl={goal?.consumed_ml ?? 0} goalMl={goal?.goal_ml ?? 2500} />
      <QuickAddButtons
        onQuickAdd={(label) => logDrink(defaultQuickAddMl, label)}
        onOther={() => setModalVisible(true)}
        quickAddLabel={defaultQuickAddMl}
      />
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginVertical: 16 }}>
        <StreakCard
          streakDays={goal?.streak_days ?? 0}
          goalMl={goal?.goal_ml ?? 2500}
          consumedMl={goal?.consumed_ml ?? 0}
        />
        <LastSipCard lastSipAt={logs[0]?.logged_at ?? null} />
      </View>
      {tip && <BuddyTipCard content={tip.content} />}
      <AddWaterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(amount, label, isDefault) => {
          logDrink(amount, label);
          if (isDefault) setDefaultQuickAddMl(amount);
        }}
      />
    </ScreenContent>
  );
}
