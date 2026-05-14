import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';

import { useUser } from '@clerk/expo';
import { Plus, BookOpen, Clock, Users, ChevronRight, LayoutGrid, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTutorCourses, useDeleteCourse } from '@/lib/api/courses';
import { Alert } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TutorsDashboard() {
  const { user } = useUser();
  const { data: courses = [], isLoading } = useTutorCourses();
  const { mutate: deleteCourse } = useDeleteCourse();

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Delete Course',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteCourse(id, {
              onSuccess: () => {
                Alert.alert('Deleted', 'Course deleted successfully.');
              },
              onError: (error) => {
                Alert.alert('Error', error.message || 'Failed to delete course.');
              }
            });
          }
        }
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <BookOpen size={48} color="#6366f1" strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>No courses yet</Text>
      <Text style={styles.emptySubtitle}>
        Share your knowledge with the world. Start by creating your first course today!
      </Text>
      <TouchableOpacity 
        style={styles.createButtonLarge}
        onPress={() => router.push('/tutors/create')}
        activeOpacity={0.8}
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create Your First Course</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCourseItem = (course: any) => (
    <TouchableOpacity 
      key={course.id}
      style={styles.courseCard}
      onPress={() => router.push(`/tutors/edit/${course.id}`)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60' }} 
        style={styles.courseThumbnail} 
      />
      <View style={styles.courseInfo}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseCategory}>{course.category || 'Professional'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: course.is_published ? '#dcfce7' : '#fee2e2' }]}>
            <Text style={[styles.statusText, { color: course.is_published ? '#166534' : '#991b1b' }]}>
              {course.is_published ? 'Published' : 'Draft'}
            </Text>
          </View>
        </View>
        <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
        
        <View style={styles.courseMeta}>
          <View style={styles.metaItem}>
            <Clock size={12} color="#64748b" />
            <Text style={styles.metaText}>{course.duration_hours || 0}h</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={12} color="#64748b" />
            <Text style={styles.metaText}>0 students</Text>
          </View>
        </View>
      </View>
      <View style={styles.courseAction}>
        <TouchableOpacity 
          onPress={() => handleDelete(course.id, course.title)}
          style={styles.deleteIcon}
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
        <ChevronRight size={20} color="#94a3b8" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'Instructor'}</Text>
            <Text style={styles.title}>Your Courses</Text>
          </View>
          {courses.length > 0 && (
            <TouchableOpacity 
              style={styles.createButtonSmall}
              onPress={() => router.push('/tutors/create')}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Overview (Optional but looks premium) */}
        {courses.length > 0 && (
          <View style={styles.statsRow}>
            <BlurView intensity={80} tint="light" style={styles.statCard}>
              <Text style={styles.statValue}>{courses.length}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </BlurView>
            <BlurView intensity={80} tint="light" style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Students</Text>
            </BlurView>
            <BlurView intensity={80} tint="light" style={styles.statCard}>
              <Text style={styles.statValue}>$0</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </BlurView>
          </View>
        )}

        {/* Content Section */}
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : courses.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.courseList}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Management</Text>
              <TouchableOpacity style={styles.viewToggle}>
                <LayoutGrid size={18} color="#6366f1" />
              </TouchableOpacity>
            </View>
            {courses.map(renderCourseItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  createButtonSmall: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: (SCREEN_WIDTH - 48 - 24) / 3,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    overflow: 'hidden',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loaderContainer: {
    paddingVertical: 100,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 24,
    marginBottom: 32,
  },
  createButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  courseList: {
    gap: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    alignItems: 'center',
  },
  courseThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
  },
  courseInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  courseCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366f1',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 20,
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  courseAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
  },
  deleteIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
});
