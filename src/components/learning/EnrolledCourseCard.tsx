import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Play, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface EnrolledCourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  lastLesson?: string;
}

export function EnrolledCourseCard({
  id,
  title,
  instructor,
  thumbnail,
  progress,
  lastLesson
}: EnrolledCourseCardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={styles.container}
      onPress={() => router.push({ pathname: '/player', params: { courseId: id } })}
    >
      <BlurView intensity={15} tint="light" style={styles.blur}>
        <View style={styles.content}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
          
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.instructor}>{instructor}</Text>
            
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>{progress}% Complete</Text>
                <View style={styles.dot} />
                <Text style={styles.timeText}>2h left</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => router.push({ pathname: '/player', params: { courseId: id } })}
            >
              <LinearGradient
                colors={['#6366F1', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                <Play size={14} color="white" fill="white" />
                <Text style={styles.continueText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  blur: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    gap: 16,
  },
  thumbnail: {
    width: 100,
    height: 140,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructor: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressText: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  timeText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  continueButton: {
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
