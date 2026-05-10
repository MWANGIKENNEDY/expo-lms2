import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  ChevronLeft, 
  Star, 
  Clock, 
  BarChart2, 
  Users, 
  Play, 
  Lock, 
  CheckCircle,
  Share2,
  Bookmark
} from 'lucide-react-native';
import { useCourse } from '@/lib/api/courses';
import { useEnrollInCourse, useCourseEnrollmentStatus } from '@/lib/api/enrollments';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const isValidUUID = (id: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: course, isLoading: isLoadingCourse } = useCourse(id);
  const { data: enrollmentStatus, isLoading: isCheckingStatus } = useCourseEnrollmentStatus(id);
  const { mutate: enroll, isPending: isEnrolling } = useEnrollInCourse();
  
  if (isLoadingCourse) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#6366F1" size="large" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ color: 'white' }}>Course not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text style={{ color: '#6366F1' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const lessons = course.lessons;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#4F46E5', 'transparent']}
          style={[styles.aurora, { top: -100, right: -50, width: 400, height: 400, opacity: 0.4 }]}
        />
        <LinearGradient
          colors={['#7C3AED', 'transparent']}
          style={[styles.aurora, { bottom: 200, left: -100, width: 350, height: 350, opacity: 0.3 }]}
        />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
      >
        {/* Header */}
        <View style={styles.header}>
          <BlurView intensity={20} tint="dark" style={styles.headerBlur}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <ChevronLeft color="white" size={24} />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Bookmark color="white" size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Share2 color="white" size={20} />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.thumbnailContainer}>
            <Image 
              source={{ uri: course.thumbnail_url || 'https://media.screensdesign.com/gasset/39b0390b-0bda-47cc-bf53-e50f1940d3ab.png' }} 
              style={styles.thumbnail} 
            />
            <LinearGradient
              colors={['transparent', '#0F172A']}
              style={styles.thumbnailOverlay}
            />
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{course.category || 'General'}</Text>
            </View>
            <Text style={styles.title}>{course.title}</Text>
            
            <View style={styles.metaRow}>
              <View style={styles.ratingBadge}>
                <Star size={14} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.ratingText}>4.8 (1.2k reviews)</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Users size={14} color="rgba(255,255,255,0.6)" />
                <Text style={styles.metaText}>12,450 students</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Course Highlights */}
        <View style={styles.highlightsRow}>
          <BlurView intensity={10} tint="light" style={styles.highlightCard}>
            <Clock size={20} color="#818CF8" />
            <Text style={styles.highlightVal}>{course.duration_hours || 12}h</Text>
            <Text style={styles.highlightLabel}>Duration</Text>
          </BlurView>
          <BlurView intensity={10} tint="light" style={styles.highlightCard}>
            <BarChart2 size={20} color="#34D399" />
            <Text style={styles.highlightVal}>{course.level || 'Beginner'}</Text>
            <Text style={styles.highlightLabel}>Level</Text>
          </BlurView>
          <BlurView intensity={10} tint="light" style={styles.highlightCard}>
            <Play size={20} color="#F472B6" />
            <Text style={styles.highlightVal}>
              {course.chapters?.reduce((acc: number, ch: any) => acc + (ch.lessons?.length || 0), 0) || 0} Lessons
            </Text>
            <Text style={styles.highlightLabel}>Content</Text>
          </BlurView>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this course</Text>
          <Text style={styles.description}>
            {course.description || "Master the fundamentals and advanced techniques in this comprehensive course. Perfect for anyone looking to level up their skills with hands-on projects and expert guidance."}
          </Text>
        </View>

        {/* Syllabus */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Course Syllabus</Text>
          </View>
          
          <View style={styles.syllabusList}>
            {course.chapters && course.chapters.length > 0 ? (
              course.chapters.map((chapter: any) => (
                <View key={chapter.id} style={styles.chapterSection}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  {chapter.lessons && chapter.lessons.map((lesson: any, index: number) => (
                    <TouchableOpacity key={lesson.id} style={styles.lessonItem}>
                      <View style={styles.lessonNumberContainer}>
                        <Text style={styles.lessonNumber}>{String(index + 1).padStart(2, '0')}</Text>
                      </View>
                      <View style={styles.lessonInfo}>
                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                        <Text style={styles.lessonDuration}>{lesson.duration_minutes || 15} mins</Text>
                      </View>
                      {lesson.is_preview ? (
                        <Play size={20} color="#6366F1" />
                      ) : (
                        <Lock size={18} color="rgba(255,255,255,0.2)" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))
            ) : (
              <View style={styles.emptyLessons}>
                <Text style={styles.emptyText}>No content available yet.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Instructor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Instructor</Text>
          <BlurView intensity={10} tint="light" style={styles.instructorCard}>
            <Image 
              source={{ uri: 'https://media.screensdesign.com/afprjsia/c4b1ad9c-3e44-4391-b4e9-9ea508f16835.png' }} 
              style={styles.instructorAvatar} 
            />
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorName}>Alex Rivera</Text>
              <Text style={styles.instructorRole}>Senior UI/UX Designer at Apple</Text>
              <View style={styles.instructorStats}>
                <Text style={styles.instructorStatText}>24 Courses</Text>
                <View style={styles.dot} />
                <Text style={styles.instructorStatText}>150k Students</Text>
              </View>
            </View>
          </BlurView>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Bottom Enrollment */}
      <BlurView intensity={30} tint="dark" style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>${course.price || 'Free'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.enrollButton}
          disabled={isEnrolling || isCheckingStatus}
          onPress={() => {
            if (!enrollmentStatus) {
              enroll(course.id, {
                onSuccess: () => {
                  router.push({ pathname: '/player', params: { courseId: id } });
                },
                onError: (error) => {
                  console.error('Failed to enroll:', error);
                }
              });
            } else {
              router.push({ pathname: '/player', params: { courseId: id } });
            }
          }}
        >
          <LinearGradient
            colors={['#6366F1', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.enrollGradient}
          >
            {isEnrolling || isCheckingStatus ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.enrollText}>
                {enrollmentStatus ? 'Continue Learning' : 'Enroll Now'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  aurora: {
    position: 'absolute',
    borderRadius: 200,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    zIndex: 100,
  },
  headerBlur: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  heroSection: {
    marginBottom: 24,
  },
  thumbnailContainer: {
    width: SCREEN_WIDTH,
    height: 300,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginTop: -40,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    marginBottom: 12,
  },
  categoryText: {
    color: '#818CF8',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  highlightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  highlightCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  highlightVal: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  highlightLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chapterSection: {
    marginBottom: 24,
  },
  chapterTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    lineHeight: 24,
  },
  lessonCount: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },
  syllabusList: {
    gap: 12,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  lessonNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  lessonNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  lessonDuration: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  emptyLessons: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  instructorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructorRole: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  instructorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  instructorStatText: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '600',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  priceValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  enrollButton: {
    flex: 2,
    height: 56,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  enrollGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enrollText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
