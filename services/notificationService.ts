import * as Notifications from 'expo-notifications';

type QuietHours = {
  enabled: boolean;
  start: string;
  end: string;
};

function isQuietTime(date: Date, start: string, end: string) {
  const current = date.getHours() * 60 + date.getMinutes();

  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (startMinutes > endMinutes) {
    return current >= startMinutes || current < endMinutes;
  }

  return current >= startMinutes && current < endMinutes;
}

export async function updateReminderNotifications({
  enabled,
  frequencyMinutes,
  quietHours,
}: {
  enabled: boolean;
  frequencyMinutes: number;
  quietHours: QuietHours;
}) {
  const MAX_SCHEDULED = 50;
  const remindersPerDay = Math.min(Math.floor((24 * 60) / frequencyMinutes), MAX_SCHEDULED);

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!enabled) return;

  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    console.log('Notification permission denied');
    return;
  }

  const now = new Date();

  const first = new Date(now);
  first.setSeconds(0);
  first.setMilliseconds(0);

  if (first <= now) {
    first.setMinutes(first.getMinutes() + 1);
  }

  for (let i = 1; i <= remindersPerDay; i++) {
    const date = new Date(first.getTime() + i * frequencyMinutes * 60 * 1000);

    if (quietHours.enabled && isQuietTime(date, quietHours.start, quietHours.end)) {
      continue;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'WaterBuddy',
        body: 'Time for a refreshing sip! Your buddy is thirsty.',
        sound: 'waterbuddy_sound.wav',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: 'water-reminders-v2',
      },
    });
  }

  console.log(`Scheduled reminders every ${frequencyMinutes} minutes`);
}

export async function restoreReminderNotifications(settings: {
  enabled: boolean;
  frequencyMinutes: number;
  quietHours: QuietHours;
}) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  if (scheduled.length > 0) {
    console.log('Notifications already scheduled');
    return;
  }

  await updateReminderNotifications(settings);
}
