import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface CarouselSectionProps {
  title: string;
  onViewAll?: () => void;
  children: React.ReactNode;
  subtitle?: string;
}

export function CarouselSection({ title, onViewAll, children, subtitle }: CarouselSectionProps) {
  return (
    <View className="mb-10">
      <View className="flex-row justify-between items-end px-6 mb-4">
        <View className="flex-1">
          {subtitle && (
            <Text className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-1">
              {subtitle}
            </Text>
          )}
          <Text className="text-white text-2xl font-bold tracking-tight">
            {title}
          </Text>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
            <Text className="text-indigo-400 text-sm font-medium mb-1">View All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        decelerationRate="fast"
        snapToAlignment="start"
      >
        {children}
      </ScrollView>
    </View>
  );
}
