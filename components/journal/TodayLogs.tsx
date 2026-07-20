import TrashIcon from '@/assets/icons/trash.svg';
import Icon from '@/assets/icons/water-glass.svg';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { WaterLog } from '@/db/types';
import { useRef, useState } from 'react';
import { Animated, LayoutAnimation, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import IconButton from '../ui/IconButton';

type Props = {
  logs: WaterLog[];
  onDelete: (id: number) => Promise<void>;
};

function formatTime(logged_at: string): string {
  const d = new Date(logged_at);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function LogEntry({
  log,
  showDelete,
  onDelete,
}: {
  log: WaterLog;
  showDelete?: boolean;
  onDelete?: (id: number) => void;
}) {
  // drives the fade + shrink when this entry is removed
  const anim = useRef(new Animated.Value(1)).current;

  const handleDelete = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      // smooths the reflow of the remaining entries once this one is actually removed from the array
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onDelete?.(log.id);
    });
  };

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
      }}>
      <View style={styles.entry}>
        <View style={styles.left}>
          <IconButton icon={Icon} background />
          <View style={styles.textBlock}>
            <Text style={styles.logLabel}>{log.label}</Text>
            <Text style={styles.logTime}>{formatTime(log.logged_at ?? '')}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.logAmount}>{log.amount_ml} ml</Text>

          {showDelete && (
            <IconButton
              icon={TrashIcon}
              size={18}
              color={colors.tabInactive}
              background={false}
              onPress={handleDelete}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
}

export default function TodayLogs({ logs, onDelete }: Props) {
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
              <LogEntry key={log.id} log={log} showDelete onDelete={onDelete} />
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
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
