import BuddyProfile from '@/components/features/BuddyProfile';
import ScreenContent from '@/components/layout/ScreenContent';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';

export default function Settings() {
  const { user } = useWaterBuddyContext();

  return (
    <ScreenContent>
      {user && (
        <BuddyProfile
          user={user}
          onManageAccount={() => {
            /* navigate to manage account later */
          }}
        />
      )}
    </ScreenContent>
  );
}
