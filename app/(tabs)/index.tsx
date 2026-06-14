import QuickAddButtons from '@/components/features/QuickAddButtons';
import WaterIntakeDisplay from '@/components/features/WaterIntakeDisplay';
import ScreenContent from '@/components/layout/ScreenContent';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';

export default function Ritual() {
  const { goal, logDrink } = useWaterBuddyContext();

  return (
    <ScreenContent>
      <WaterIntakeDisplay consumedMl={goal?.consumed_ml ?? 0} goalMl={goal?.goal_ml ?? 2500} />
      <QuickAddButtons
        onQuickAdd={() => logDrink(400, 'Quick Add')}
        onOther={() => {
          /* open modal later */
        }}
      />
    </ScreenContent>
  );
}
