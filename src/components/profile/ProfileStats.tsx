import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Flame, BookOpen, Clock } from 'lucide-react-native';

export const ProfileStats = () => {
  const stats = [
    { label: 'Streak', value: '12 Days', icon: Flame, color: '#FBBF24' },
    { label: 'Courses', value: '8', icon: BookOpen, color: '#818CF8' },
    { label: 'Hours', value: '24h', icon: Clock, color: '#34D399' },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <BlurView key={index} intensity={20} tint="light" style={styles.statCard}>
          <stat.icon size={20} color={stat.color} />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </BlurView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
