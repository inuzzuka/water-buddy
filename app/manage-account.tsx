import ProfileIcon from '@/assets/icons/profile.svg';
import AppHeader from '@/components/layout/AppHeader';
import BuddyMascot from '@/components/ritual/BuddyMascot';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/typography';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ManageAccount() {
  const { user, db, refreshSettings } = useWaterBuddyContext();
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const handleSave = async () => {
    if (!user?.id) return;
    await db.users.update(user.id, {
      first_name: firstName,
      last_name: lastName,
      email,
    });
    refreshSettings();
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Water Buddy" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}>
        <BuddyMascot size={120} />

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Hi, buddy!</Text>
          <Text style={styles.subtitle}>Here you can change your name and password.</Text>
        </View>

        <View style={styles.form}>
          <FormInput
            label="First name"
            icon={ProfileIcon}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={colors.gray}
          />
          <FormInput
            label="Last name"
            icon={ProfileIcon}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor={colors.gray}
          />
          {/* <FormInput
            label="Email"
            icon={EmailIcon}
            value={email}
            onChangeText={setEmail}
            placeholder="andjela@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          /> */}

          {/* Change Password row */}
          {/* <TouchableOpacity style={styles.changePassword} onPress={() => {}}>
            <View style={styles.changePasswordLeft}>
              <View style={styles.iconCircle}>
                <LockIcon width={16} height={16} color={colors.primary} />
              </View>
              <Text style={styles.changePasswordText}>Change Password</Text>
            </View>
            <Arrow width={16} height={16} color={colors.tabInactive} />
          </TouchableOpacity> */}

          <Button label="Save Changes" onPress={handleSave} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
    padding: 24,
    gap: 24,
  },
  titleBlock: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.primaryDark,
  },
  subtitle: {
    fontFamily: fonts.jakarta,
    fontSize: 14,
    color: colors.tabInactive,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 24,
    gap: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  changePassword: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 54,
    backgroundColor: '#EFF4F6',
    borderRadius: 9999,
    paddingHorizontal: 10,
  },
  changePasswordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: 'rgba(71, 169, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePasswordText: {
    fontFamily: fonts.jakarta,
    fontSize: 16,
    color: colors.tabInactive,
  },
});
