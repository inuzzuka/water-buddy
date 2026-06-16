import { useToday, useWaterBuddy, WaterBuddyDB } from '@/db/hooks/useWaterBuddy';
import { BuddyTipRepository } from '@/db/repositories/BuddyTipRepository';
import { UserRepository } from '@/db/repositories/UserRepository';
import { BuddyTip, DailyGoal, User, WaterLog } from '@/db/types';
import { createContext, useContext, useEffect, useState } from 'react';

type WaterBuddyContextType = {
  ready: boolean;
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [tip, setTip] = useState<BuddyTip | null>(null);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      const userRepo = new UserRepository();
      let foundUser = await userRepo.findById(1);
      if (!foundUser) {
        const id = await userRepo.insert({
          first_name: 'Buddy',
          last_name: '',
          email: 'local@waterbuddy.app',
          password: '',
          level: 1,
          xp: 0,
        });
        foundUser = await userRepo.findById(id);
      }
      if (foundUser?.id) {
        setUser(foundUser);
        const buddyTipRepo = new BuddyTipRepository();
        await buddyTipRepo.seedDefaultTips(foundUser.id);
        const nextTip = await buddyTipRepo.getNextTip(foundUser.id);
        setTip(nextTip);
      }
    })();
  }, [ready]);

  const { goal, logs, remaining, refresh } = useToday(user?.id ?? 0);

  const logDrink = async (amount_ml: number, label = 'Water') => {
    if (!user?.id) return;
    await db.waterLogs.logDrink(user.id, amount_ml, label);
    refresh();
  };

  return (
    <WaterBuddyContext.Provider
      value={{ ready: ready && user !== null, user, goal, logs, remaining, tip, db, logDrink, refresh }}>
      {children}
    </WaterBuddyContext.Provider>
  );
}

export function useWaterBuddyContext() {
  const ctx = useContext(WaterBuddyContext);
  if (!ctx) throw new Error('useWaterBuddyContext must be used inside WaterBuddyProvider');
  return ctx;
}
