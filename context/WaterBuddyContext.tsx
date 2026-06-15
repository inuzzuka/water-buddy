import { useToday, useWaterBuddy, WaterBuddyDB } from '@/db/hooks/useWaterBuddy';
import { BuddyTipRepository } from '@/db/repositories/BuddyTipRepository';
import { UserRepository } from '@/db/repositories/UserRepository';
import { BuddyTip, DailyGoal, WaterLog } from '@/db/types';
import { createContext, useContext, useEffect, useState } from 'react';

type WaterBuddyContextType = {
  ready: boolean;
  userId: number | null;
  goal: DailyGoal | null;
  logs: WaterLog[];
  remaining: number | null;
  tip: BuddyTip | null;
  db: WaterBuddyDB;
  logDrink: (amount_ml: number, label?: string) => Promise<void>;
  refresh: () => void;
};

const WaterBuddyContext = createContext<WaterBuddyContextType | null>(null);

export function WaterBuddyProvider({ children }: { children: React.ReactNode }) {
  const { ready, db } = useWaterBuddy();
  const [userId, setUserId] = useState<number | null>(null);
  const [tip, setTip] = useState<BuddyTip | null>(null);

  // Bootstrap: create local user on first launch
  useEffect(() => {
    if (!ready) return;
    (async () => {
      const userRepo = new UserRepository();
      let user = await userRepo.findById(1);
      if (!user) {
        const id = await userRepo.insert({
          first_name: 'Buddy',
          last_name: '',
          email: 'local@waterbuddy.app',
          password: '',
          level: 1,
          xp: 0,
        });
        user = await userRepo.findById(id);
      }
      if (user?.id) {
        setUserId(user.id);
        const buddyTipRepo = new BuddyTipRepository();
        await buddyTipRepo.seedDefaultTips(user.id);
        const nextTip = await buddyTipRepo.getNextTip(user.id);
        setTip(nextTip);
      }
    })();
  }, [ready]);

  const { goal, logs, remaining, refresh } = useToday(userId ?? 0);

  const logDrink = async (amount_ml: number, label = 'Water') => {
    if (!userId) return;
    await db.waterLogs.logDrink(userId, amount_ml, label);
    refresh();
  };

  return (
    <WaterBuddyContext.Provider
      value={{ ready: ready && userId !== null, userId, goal, logs, remaining, tip, db, logDrink, refresh }}>
      {children}
    </WaterBuddyContext.Provider>
  );
}

export function useWaterBuddyContext() {
  const ctx = useContext(WaterBuddyContext);
  if (!ctx) throw new Error('useWaterBuddyContext must be used inside WaterBuddyProvider');
  return ctx;
}
