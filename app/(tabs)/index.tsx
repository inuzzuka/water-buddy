import AddWaterModal from '@/components/features/AddWaterModal';
import QuickAddButtons from '@/components/features/QuickAddButtons';
import WaterIntakeDisplay from '@/components/features/WaterIntakeDisplay';
import ScreenContent from '@/components/layout/ScreenContent';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';
import { useState } from 'react';

export default function Ritual() {
  const { goal, logDrink } = useWaterBuddyContext();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScreenContent>
      <WaterIntakeDisplay consumedMl={goal?.consumed_ml ?? 0} goalMl={goal?.goal_ml ?? 2500} />
      <QuickAddButtons onQuickAdd={() => logDrink(400, 'Quick Add')} onOther={() => setModalVisible(true)} />
      <AddWaterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(amount, label, isDefault) => logDrink(amount, label)}
      />
    </ScreenContent>
  );
}
