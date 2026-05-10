import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Trophy, Clock } from 'lucide-react-native';
import { EnrolledCourseCard } from '@/components/learning/EnrolledCourseCard';
import { useUserEnrollments } from '@/lib/api/enrollments';
import { BlurView } from 'expo-blur';
import { ActivityIndicator } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MyLearningScreen() {
  const { data: enrolledCourses = [], isLoading } = useUserEnrollments();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#312E81', 'transparent']}
          style={[styles.aurora, { top: -150, left: -100, width: 400, height: 400, opacity: 0.5 }]}
        />
        <LinearGradient
          colors={['#4C1D95', 'transparent']}
          style={[styles.aurora, { bottom: -100, right: -100, width: 400, height: 400, opacity: 0.4 }]}
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>My Learning</Text>
        {isLoading ? (
          <ActivityIndicator color="#6366F1" size="small" style={{ alignSelf: 'flex-start', marginTop: 8 }} />
        ) : (
          <Text style={styles.subtitle}>You have {enrolledCourses.length} courses in progress</Text>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <BlurView intensity={10} tint="light" style={styles.statCard}>
            <Trophy size={20} color="#FBBF24" />
            <View>
              <Text style={styles.statVal}>12</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </BlurView>
          <BlurView intensity={10} tint="light" style={styles.statCard}>
            <Clock size={20} color="#818CF8" />
            <View>
              <Text style={styles.statVal}>48h</Text>
              <Text style={styles.statLabel}>Learning Time</Text>
            </View>
          </BlurView>
        </View>

        {/* Course List */}
        <View style={styles.listSection}>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map(enrollment => {
              const course = enrollment.courses;
              if (!course) return null;
              return (
                <EnrolledCourseCard 
                  key={enrollment.id}
                  id={course.id}
                  title={course.title}
                  instructor="Expert Instructor"
                  thumbnail={course.thumbnail_url || 'https://media.screensdesign.com/gasset/39b0390b-0bda-47cc-bf53-e50f1940d3ab.png'}
                  progress={enrollment.progress || 0}
                />
              );
            })
          ) : !isLoading ? (
            <View className="py-20 items-center">
              <Text className="text-white/40">You haven't enrolled in any courses yet.</Text>
            </View>
          ) : null}
        </View>

        {/* Empty State / Explore Prompt */}
        <TouchableOpacity style={styles.explorePrompt}>
          <View style={styles.exploreIcon}>
            <BookOpen size={24} color="#6366F1" />
          </View>
          <View>
            <Text style={styles.exploreTitle}>Want to learn more?</Text>
            <Text style={styles.exploreSub}>Explore our full catalog of courses</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
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
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statVal: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  listSection: {
    marginBottom: 32,
  },
  explorePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 24,
    borderRadius: 32,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  exploreIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  exploreSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
});
