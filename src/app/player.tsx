import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
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
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  CheckCircle,
  Lock,
  MessageCircle,
  Download
} from 'lucide-react-native';
import { useCourse } from '@/lib/api/courses';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { data: course, isLoading } = useCourse(courseId || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const lessons = React.useMemo(() => {
    if (!course?.chapters) return [];
    return course.chapters.flatMap((chapter: any) => 
      (chapter.lessons || []).map((lesson: any) => ({
        ...lesson,
        chapterTitle: chapter.title
      }))
    );
  }, [course]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#6366F1" size="large" />
      </View>
    );
  }

  if (!course || lessons.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ color: 'white' }}>Course or lessons not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text style={{ color: '#6366F1' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentLesson = lessons[currentLessonIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#4F46E5', 'transparent']}
          style={[styles.aurora, { top: -100, right: -50, width: 400, height: 400, opacity: 0.3 }]}
        />
        <LinearGradient
          colors={['#7C3AED', 'transparent']}
          style={[styles.aurora, { bottom: 200, left: -100, width: 350, height: 350, opacity: 0.2 }]}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="white" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>Now Playing</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{course?.title}</Text>
        </View>
      </View>

      {/* Video Area */}
      <View style={styles.videoSection}>
        <View style={styles.videoPlaceholder}>
          <BlurView intensity={20} tint="dark" style={styles.videoBlur}>
            <TouchableOpacity 
              onPress={() => setIsPlaying(!isPlaying)}
              style={styles.playButton}
            >
              {isPlaying ? (
                <Pause color="white" size={40} fill="white" />
              ) : (
                <Play color="white" size={40} fill="white" />
              )}
            </TouchableOpacity>
          </BlurView>
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            style={styles.videoTopGradient}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Lesson Info */}
        <View style={styles.infoSection}>
          <View style={styles.lessonHeader}>
            <Text style={styles.lessonNumber}>LESSON {currentLessonIndex + 1}</Text>
            <Text style={styles.lessonTitle}>{currentLesson?.title}</Text>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionItem}>
              <MessageCircle size={20} color="rgba(255,255,255,0.6)" />
              <Text style={styles.actionText}>Community</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Download size={20} color="rgba(255,255,255,0.6)" />
              <Text style={styles.actionText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsSection}>
          <TouchableOpacity 
            onPress={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
            disabled={currentLessonIndex === 0}
          >
            <SkipBack color={currentLessonIndex === 0 ? 'rgba(255,255,255,0.2)' : 'white'} size={28} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.mainPlayToggle}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <LinearGradient
              colors={['#6366F1', '#A855F7']}
              style={styles.playGradient}
            >
              {isPlaying ? <Pause color="white" size={24} /> : <Play color="white" size={24} fill="white" />}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              const nextIndex = Math.min(lessons.length - 1, currentLessonIndex + 1);
              setCurrentLessonIndex(nextIndex);
            }}
            disabled={currentLessonIndex === lessons.length - 1}
          >
            <SkipForward color={currentLessonIndex === lessons.length - 1 ? 'rgba(255,255,255,0.2)' : 'white'} size={28} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '45%' }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>08:45</Text>
            <Text style={styles.timeText}>15:00</Text>
          </View>
        </View>

        {/* Syllabus List */}
        <View style={styles.syllabusSection}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          {lessons.map((lesson: any, index: number) => (
            <TouchableOpacity 
              key={lesson.id} 
              style={[
                styles.lessonItem,
                index === currentLessonIndex && styles.activeLessonItem
              ]}
              onPress={() => setCurrentLessonIndex(index)}
            >
              <View style={styles.lessonMeta}>
                {index < currentLessonIndex ? (
                  <CheckCircle size={18} color="#10B981" />
                ) : index === currentLessonIndex ? (
                  <Play size={18} color="#6366F1" fill="#6366F1" />
                ) : (
                  <View style={styles.dot} />
                )}
                <Text style={[
                  styles.lessonItemTitle,
                  index === currentLessonIndex && styles.activeLessonText
                ]}>
                  {lesson.title}
                </Text>
              </View>
              <Text style={styles.lessonItemDuration}>{lesson.duration_minutes}m</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoSection: {
    width: SCREEN_WIDTH,
    height: 220,
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  videoBlur: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  playButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  infoSection: {
    padding: 24,
  },
  lessonHeader: {
    marginBottom: 20,
  },
  lessonNumber: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  lessonTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 20,
  },
  mainPlayToggle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  playGradient: {
    flex: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  syllabusSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeLessonItem: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginLeft: 6,
    marginRight: 6,
  },
  lessonItemTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    flex: 1,
  },
  activeLessonText: {
    color: 'white',
    fontWeight: '600',
  },
  lessonItemDuration: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
});
