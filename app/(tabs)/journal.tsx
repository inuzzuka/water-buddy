import ScreenContent from '@/components/layout/ScreenContent';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { useState } from 'react';

export default function Journal() {
  const [period, setPeriod] = useState('Week');

  return (
    <ScreenContent>
      <SegmentedControl options={['Week', 'Month']} selected={period} onChange={setPeriod} />
    </ScreenContent>
  );
}
