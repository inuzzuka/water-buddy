import Icon from '@/assets/icons/water-glass.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { WaterLog } from '@/db/types';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import IconButton from '../ui/IconButton';

type Props = {
  logs: WaterLog[];
};

function formatTime(logged_at: string): string {
  const d = new Date(logged_at);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function LogEntry({ log }: { log: WaterLog }) {
  return (
    <View style={styles.entry}>
      <View style={styles.left}>
        <IconButton icon={Icon} background />
        <View style={styles.textBlock}>
          <Text style={styles.logLabel}>{log.label}</Text>
          <Text style={styles.logTime}>{formatTime(log.logged_at ?? '')}</Text>
        </View>
      </View>
      <Text style={styles.logAmount}>{log.amount_ml} ml</Text>
    </View>
  );
}

export default function TodayLogs({ logs }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  if (logs.length === 0) return null;

  const preview = logs.slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's logs</Text>
        {logs.length > 2 && (
          <Text style={styles.viewAll} onPress={() => setModalVisible(true)}>
            View All
          </Text>
        )}
      </View>

      {preview.map((log) => (
        <LogEntry key={log.id} log={log} />
      ))}

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Today's logs</Text>
          <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            {logs.map((log) => (
              <LogEntry key={log.id} log={log} />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginVertical: 25,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    color: colors.primaryDark,
  },
  viewAll: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    color: colors.primary,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
    backgroundColor: colors.white,
    borderRadius: 32,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
    gap: 1,
  },
  logLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    color: colors.black,
  },
  logTime: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.tabInactive,
  },
  logAmount: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    color: colors.primary,
    textAlign: 'right',
    width: 70,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: colors.lightGray,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.headerBorder,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
    marginBottom: 16,
  },
  sheetContent: {
    gap: 10,
    paddingBottom: 20,
  },
});
