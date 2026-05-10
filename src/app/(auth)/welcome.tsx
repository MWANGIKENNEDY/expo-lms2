import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Sparkles, Lightbulb } from 'lucide-react-native';

export default function WelcomeScreen() {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [bounceAnim]);

  const navigateToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
        style={{ opacity: 0.9 }}
      />
      
      <ScrollView className="flex-1 px-6 pt-32" showsVerticalScrollIndicator={false}>
        {/* Hero Visual */}
        <View className="items-center mb-12">
          <BlurView intensity={20} tint="light" className="w-64 h-64 rounded-full items-center justify-center border-[1px] border-[rgba(255,255,255,0.2)] shadow-custom">
            <Image
              source={{ uri: 'https://media.screensdesign.com/afprjsia/edeb2ed2-0d46-4967-bc02-604a9c00e09d.png' }}
              className="w-full h-full rounded-full opacity-90"
              resizeMode="cover"
            />
          </BlurView>
          <View className="absolute -top-4 -right-4">
            <Animated.View 
              style={{ transform: [{ translateY: bounceAnim }] }}
              className="w-20 h-20 bg-white/10 rounded-full items-center justify-center border-[1px] border-[rgba(255,255,255,0.2)] shadow-custom"
            >
              <Sparkles color="white" size={32} />
            </Animated.View>
          </View>
        </View>

        {/* Text Content */}
        <View className="items-center mb-8">
          <Text className="text-white text-4xl font-bold text-center leading-tight mb-4 tracking-tight">
            Master Your Future{'\n'}
            <Text className="text-pink-200">With ULearner</Text>
          </Text>
          <Text className="text-blue-50 text-lg font-light text-center leading-relaxed">
            Access world-class education with an immersive learning experience designed for the modern era.
          </Text>
        </View>

        {/* Educational Fact */}
        <BlurView intensity={15} tint="light" className="rounded-2xl p-4 flex-row items-start mb-8 border-[1px] border-[rgba(255,255,255,0.2)]">
          <View className="bg-white/20 p-2 rounded-xl mr-4">
            <Lightbulb color="white" size={24} />
          </View>
          <View className="flex-1">
            <Text className="text-white font-medium text-sm mb-1">Did you know?</Text>
            <Text className="text-blue-100 text-xs leading-relaxed opacity-80">
              Micro-learning increases knowledge retention by up to 80% compared to traditional methods.
            </Text>
          </View>
        </BlurView>
      </ScrollView>

      {/* Footer Actions */}
      <View className="p-6 pb-12">
        <TouchableOpacity
          onPress={navigateToLogin}
          className="w-full h-[60px] bg-white rounded-2xl items-center justify-center shadow-xl active:scale-95 transition-transform"
        >
          <Text className="text-indigo-700 font-bold text-lg">Start Learning</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={navigateToLogin}
          className="w-full h-10 items-center justify-center mt-4"
        >
          <Text className="text-white/80 text-sm font-medium">
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
