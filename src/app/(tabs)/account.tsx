import { useUser, useAuth, useClerk, useUserProfileModal } from '@clerk/expo'
import { useRouter } from 'expo-router'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { User, LogOut, Heart, Award, ExternalLink, LayoutDashboard } from 'lucide-react-native'
import React from 'react'
import { Image, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { SettingsItem } from '@/components/profile/SettingsItem'
import { useProfile } from '@/lib/api/profiles'
import { useQueryClient } from '@tanstack/react-query'

const { width } = Dimensions.get('window')

export default function ProfilePage() {
  const { user } = useUser()
  const { signOut } = useAuth()
  const { data: userProfile } = useProfile()
  const { presentUserProfile, isAvailable } = useUserProfileModal()
  const queryClient = useQueryClient()
  const router = useRouter()

  const isTutor = user?.publicMetadata?.role === 'tutor'

  const handleLogout = async () => {
    try {
      await signOut()
      queryClient.clear()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handleManageAccount = async () => {
    if (isAvailable) {
      try {
        await presentUserProfile()
      } catch (err) {
        console.error('Error presenting user profile:', err)
      }
    } else {
      console.warn('Native profile modal is not available.')
    }
  }

  return (
    <View style={styles.container}>
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#4F46E5', 'transparent']}
          style={[styles.aurora, { top: -100, left: -100, width: 400, height: 400 }]}
        />
        <LinearGradient
          colors={['#7C3AED', 'transparent']}
          style={[styles.aurora, { bottom: -100, right: -100, width: 400, height: 400 }]}
        />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user?.imageUrl }} 
              style={styles.avatar} 
            />
            <View style={styles.badgeContainer}>
              <Award size={12} color="#fff" />
            </View>
          </View>
          
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.emailAddresses[0]?.emailAddress}</Text>
          
          {userProfile?.interest && (
            <BlurView intensity={20} tint="light" style={styles.interestBadge}>
              <Heart size={12} color="#F87171" fill="#F87171" />
              <Text style={styles.interestText}>{userProfile.interest}</Text>
            </BlurView>
          )}
        </View>

        {/* Stats Section */}
        <ProfileStats />

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingsItem 
            icon={User} 
            label="Manage Account" 
            onPress={handleManageAccount}
            value="Edit Profile"
          />
          {isTutor && (
            <SettingsItem 
              icon={LayoutDashboard} 
              label="Switch to Tutor" 
              onPress={() => router.push('/tutors')}
              value="Manage Courses"
            />
          )}
          <SettingsItem 
            icon={Heart} 
            label="My Interests" 
            value={userProfile?.interest || 'Not set'} 
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>System</Text>
          <SettingsItem 
            icon={LogOut} 
            label="Sign Out" 
            destructive 
            onPress={handleLogout}
          />
        </View>

        <Text style={styles.versionText}>ULearner v1.0.2</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  aurora: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4F46E5',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
  },
  interestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  interestText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  menuSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  versionText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
    marginTop: 40,
  },
})