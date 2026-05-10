import React from 'react';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Star, Play, Users } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating?: number;
  students?: string;
  progress?: number;
  category?: string;
  variant?: 'large' | 'compact';
  onPress?: () => void;
}

export function CourseCard({ 
  id,
  title, 
  instructor, 
  thumbnail, 
  rating, 
  students, 
  progress, 
  category,
  variant = 'large',
  onPress
}: CourseCardProps) {
  const cardWidth = variant === 'large' ? SCREEN_WIDTH * 0.65 : SCREEN_WIDTH * 0.45;

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      className="mr-4"
      onPress={onPress || (() => router.push({ pathname: "/course/[id]", params: { id } } as any))}
    >
      <BlurView
        intensity={10}
        tint="light"
        className="rounded-[28px] overflow-hidden border-[1px] border-white/10"
        style={{ width: cardWidth }}
      >
        {/* Thumbnail Area */}
        <View className="relative h-32 w-full">
          <Image source={{ uri: thumbnail }} className="w-full h-full object-cover" />
          <View className="absolute inset-0 bg-black/20" />
          
          {category && (
            <View className="absolute top-3 left-3 bg-white/20 px-2 py-1 rounded-lg backdrop-blur-md">
              <Text className="text-white text-[10px] font-bold uppercase">{category}</Text>
            </View>
          )}

          {progress !== undefined && (
            <View className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <View 
                className="h-full bg-indigo-500" 
                style={{ width: `${progress}%` }} 
              />
            </View>
          )}

          {variant === 'large' && (
            <View className="absolute inset-0 items-center justify-center">
              <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center backdrop-blur-md">
                <Play color="white" size={20} fill="white" />
              </View>
            </View>
          )}
        </View>

        {/* Info Area */}
        <View className="p-4">
          <Text 
            className={`text-white font-bold mb-1 ${variant === 'large' ? 'text-sm' : 'text-xs'}`} 
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text className="text-white/50 text-[10px] mb-3" numberOfLines={1}>
            {instructor}
          </Text>

          <View className="flex-row items-center justify-between">
            {rating !== undefined && (
              <View className="flex-row items-center bg-amber-400/10 px-2 py-0.5 rounded-md">
                <Star color="#FBBF24" size={10} fill="#FBBF24" />
                <Text className="text-amber-400 text-[10px] font-bold ml-1">{rating}</Text>
              </View>
            )}
            {students && (
              <View className="flex-row items-center">
                <Users color="rgba(255,255,255,0.4)" size={10} />
                <Text className="text-white/40 text-[10px] ml-1">{students}</Text>
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}
