import LabelIcon from '@/assets/icons/journal.svg';
import AmountIcon from '@/assets/icons/water-glass.svg';
import { colors } from '@/constants/colors';
import { fonts, typography } from '@/constants/typography';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number, label: string, isDefault: boolean) => void;
};

export default function AddWaterModal({ visible, onClose, onConfirm }: Props) {
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleConfirm = () => {
    const ml = parseInt(amount);
    if (!ml || ml <= 0) return;
    onConfirm(ml, label.trim() || 'Water', isDefault);
    setAmount('');
    setLabel('');
    setIsDefault(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Add Water</Text>

        <FormInput
          label="Amount (ml)"
          icon={AmountIcon}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="e.g. 250"
          returnKeyType="next"
        />

        <FormInput
          label="Label (optional)"
          icon={LabelIcon}
          value={label}
          onChangeText={setLabel}
          placeholder="e.g. Morning freshness"
          returnKeyType="done"
          onSubmitEditing={handleConfirm}
        />

        <Pressable style={styles.checkboxRow} onPress={() => setIsDefault((v) => !v)}>
          <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
            {isDefault && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Set as default quick-add amount</Text>
        </Pressable>

        <Button label="Add" onPress={handleConfirm} disabled={!amount} />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.headerBorder,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    ...typography.h2,
    fontSize: 20,
    color: colors.primaryDark,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.headerBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.bold,
  },
  checkboxLabel: {
    fontFamily: fonts.jakarta,
    fontSize: 14,
    color: colors.tabInactive,
  },
});
