import { useAuth, useUser } from '@clerk/expo'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { 
  Flame, 
  Trophy, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Users,
  Search,
  Bell
} from 'lucide-react-native'
import { 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Dimensions,
  StatusBar
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useProfile } from '@/lib/api/profiles'
import { router } from 'expo-router'

// Components
import { CarouselSection } from '@/components/home/CarouselSection'
import { CourseCard } from '@/components/home/CourseCard';
import { useCourses } from '@/lib/api/courses';
import { useUserEnrollments } from '@/lib/api/enrollments';

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// Mentors data can be moved to context later if needed
const TOP_MENTORS = [
  { id: '1', name: 'Elena', avatar: 'https://media.screensdesign.com/afprjsia/c4b1ad9c-3e44-4391-b4e9-9ea508f16835.png', role: 'UI Expert' },
  { id: '2', name: 'Marcus', avatar: 'https://media.screensdesign.com/afprjsia/67024a3f-4786-4e3a-85d9-e553419c57d0.png', role: 'Backend Lead' },
  { id: '3', name: 'Sophie', avatar: 'https://media.screensdesign.com/afprjsia/f4277717-b08e-49b8-b80c-a3c306560943.png', role: 'Product' },
  { id: '4', name: 'David', avatar: 'https://media.screensdesign.com/afprjsia/97e2898b-240a-4171-872d-8e45300d81c3.png', role: 'Fullstack' },
];

export default function HomeScreen() {
  const { user } = useUser()
  const { userId } = useAuth()
  const { data: courses = [] } = useCourses()
  const { data: userEnrollments = [] } = useUserEnrollments()
  const { data: profile } = useProfile()
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    if (profile) {
      // Filter recommendations from context based on interest
      const filtered = courses.filter(c => c.id.includes(profile.interest) || profile.interest === 'programming').slice(0, 4);
      setRecommendations(filtered.length > 0 ? filtered : courses.slice(0, 4));
    } else {
      setRecommendations(courses.slice(0, 4));
    }
  }, [profile, courses]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#4F46E5', 'transparent']}
          style={[styles.aurora, { top: -150, left: -100, width: 400, height: 400, opacity: 0.5 }]}
        />
        <LinearGradient
          colors={['#7C3AED', 'transparent']}
          style={[styles.aurora, { top: 200, right: -150, width: 400, height: 400, opacity: 0.4 }]}
        />
        <LinearGradient
          colors={['#10B981', 'transparent']}
          style={[styles.aurora, { bottom: -100, left: 0, width: 350, height: 350, opacity: 0.3 }]}
        />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: '#334155' }]} />
              )}
            </View>
            <View>
              <Text style={styles.greeting}>Good Morning,</Text>
              <Text style={styles.userName}>{user?.firstName || 'Learner'} 👋</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10">
              <Bell size={20} color="white" />
            </TouchableOpacity>
            <BlurView intensity={20} tint="light" style={styles.streakBadge}>
              <Flame size={16} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.streakText}>12</Text>
            </BlurView>
          </View>
        </View>

        {/* Search Bar Prompt */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/discover')}
        >
          <Search size={20} color="rgba(255,255,255,0.4)" />
          <Text style={styles.searchText}>Search for courses, projects...</Text>
        </TouchableOpacity>


        {/* Courses In Progress */}
        <CarouselSection 
          title="Pick up where you left off" 
          subtitle="Learning Journey"
          onViewAll={() => router.push('/learning')}
        >
          {userEnrollments.map(enrollment => {
            const course = enrollment.courses;
            if (!course) return null;
            return (
              <CourseCard 
                key={enrollment.id} 
                id={course.id}
                title={course.title}
                instructor="Expert Instructor"
                thumbnail={course.thumbnail_url || 'https://media.screensdesign.com/gasset/39b0390b-0bda-47cc-bf53-e50f1940d3ab.png'}
                progress={enrollment.progress || 0}
                category="Design"
                variant="large"
                onPress={() => router.push(`/player?courseId=${course.id}`)}
              />
            );
          })}
        </CarouselSection>

        {/* Recommended Section */}
        <CarouselSection 
          title={`Best for ${profile?.interest || 'You'}`} 
          subtitle="Personalized"
          onViewAll={() => router.push('/learning')}
        >
          {recommendations.length > 0 ? (
            recommendations.map(course => (
              <CourseCard 
                key={course.id} 
                id={course.id}
                title={course.title}
                instructor="Expert Instructor"
                thumbnail={course.thumbnail_url || 'https://media.screensdesign.com/gasset/39b0390b-0bda-47cc-bf53-e50f1940d3ab.png'}
                rating={4.8}
                students="1.2k"
                category={course.category}
                variant="compact"
              />
            ))
          ) : (
            // Skeleton or fallback if no recommendations
            <View className="h-40 w-full items-center justify-center">
              <Text className="text-white/40">Finding the best matches...</Text>
            </View>
          )}
        </CarouselSection>

        {/* Top Mentors */}
        <View className="mb-10 px-6">
          <Text className="text-white text-xl font-bold mb-4">Top Mentors</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-ml-2">
            {TOP_MENTORS.map(mentor => (
              <TouchableOpacity key={mentor.id} className="items-center mr-6">
                <View className="w-16 h-16 rounded-full border-2 border-indigo-500/30 p-1 mb-2">
                  <Image source={{ uri: mentor.avatar }} className="w-full h-full rounded-full" />
                </View>
                <Text className="text-white text-xs font-bold">{mentor.name}</Text>
                <Text className="text-white/40 text-[10px]">{mentor.role}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Daily Challenge Card */}
        <BlurView intensity={10} tint="light" style={styles.challengeCard}>
          <LinearGradient
            colors={['#4F46E533', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.challengeIcon}>
            <Trophy size={28} color="#FBBF24" />
          </View>
          <View className="flex-1">
            <Text style={styles.challengeTitle}>Daily Challenge</Text>
            <Text style={styles.challengeSub}>Finish 3 lessons today to earn 50 XP</Text>
            <View className="flex-row items-center mt-3 gap-4">
              <View className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <View className="h-full bg-amber-400 w-2/3" />
              </View>
              <Text className="text-amber-400 text-[10px] font-bold">2/3 DONE</Text>
            </View>
          </View>
        </BlurView>

        <View style={{ height: 120 }} />
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  greeting: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  streakText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  searchText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  challengeCard: {
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 24,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  challengeIcon: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  challengeSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
})