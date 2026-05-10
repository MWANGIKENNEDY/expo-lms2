import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useSupabase } from '@/lib/supabase';
import { StatusBar } from 'expo-status-bar';
import { useQueryClient } from '@tanstack/react-query';
import { profileKeys } from '@/lib/api/profiles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    DeviceEventEmitter,
} from 'react-native';
import {
    Sparkles,
    Lightbulb,
    Star,
    Video,
    CheckCircle,
    Download,
    Info,
    Code,
    Palette,
    TrendingUp,
    Camera,
    Music,
    Languages,
    CheckCircle2,
    Calendar,
    Award,
    Users,
    X,
    Apple,
    CreditCard,
    CircleDollarSign
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Interest options for path selection
const INTERESTS = [
  { id: 'programming', label: 'Programming', icon: Code, color: '#10B981' },
  { id: 'design', label: 'Design', icon: Palette, color: '#3B82F6' },
  { id: 'business', label: 'Business', icon: TrendingUp, color: '#A855F7' },
  { id: 'photography', label: 'Photography', icon: Camera, color: '#EC4899' },
  { id: 'music', label: 'Music', icon: Music, color: '#EAB308' },
  { id: 'languages', label: 'Languages', icon: Languages, color: '#F97316' },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterest, setSelectedInterest] = useState('programming');
  
  const { userId } = useAuth();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const totalSteps = 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (userId) {
      await supabase.from('profiles').insert({
        user_id: userId,
        interest: selectedInterest,
      });
      // Invalidate profile query so index.tsx and other screens see the new profile
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    }
    DeviceEventEmitter.emit('onboardingComplete');
    // Navigate to main app
    router.replace('/featured');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <SocialProofStep onNext={handleNext} />;
      case 1:
        return <FeaturesStep onNext={handleNext} />;
      case 2:
        return (
          <PathSelectionStep
            selectedInterest={selectedInterest}
            onSelectInterest={setSelectedInterest}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <PathConfirmationStep
            selectedInterest={selectedInterest}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <SubscriptionStep onComplete={handleComplete} onBack={handleBack} />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      
      {/* Progress Bar */}
      <View 
        className="absolute top-0 left-0 right-0 z-50 px-6"
        style={{ paddingTop: Math.max(insets.top + 16, 48) }}
      >
        <View className="h-1 bg-white/20 rounded-full overflow-hidden">
          <View
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
        <Text className="text-white/60 text-xs text-center mt-2">
          Step {currentStep + 1} of {totalSteps}
        </Text>
      </View>

      {/* Step Content */}
      {renderStep()}
    </View>
  );
}


// Step 2: Social Proof Screen
function SocialProofStep({ onNext }: { onNext: () => void }) {
  return (
    <View className="flex-1 bg-[#0F172A]">
      <LinearGradient
        colors={['#1E3A8A', '#5B21B6', '#10B981']}
        start={{ x: 0.2, y: 0.3 }}
        end={{ x: 0.8, y: 0.7 }}
        className="absolute inset-0 opacity-60"
        style={{ transform: [{ scale: 1.5 }] }}
      />

      <ScrollView className="flex-1 px-6 pt-32" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8">
          <Text className="text-white text-3xl font-bold text-center mb-3 tracking-tight">
            Join a Community of Achievers
          </Text>
          <Text className="text-blue-100/70 text-base text-center">
            Trusted by over 1.2M learners worldwide to reach their career goals.
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-4 mb-6">
          <BlurView intensity={20} tint="dark" className="flex-1 rounded-3xl p-5 items-center border-[1px] border-[rgba(255,255,255,0.15)]">
            <Text className="text-emerald-400 text-2xl font-bold">4.9/5</Text>
            <Text className="text-white/60 text-[10px] uppercase tracking-widest mt-1">
              App Store Rating
            </Text>
          </BlurView>
          <BlurView intensity={20} tint="dark" className="flex-1 rounded-3xl p-5 items-center border-[1px] border-[rgba(255,255,255,0.15)]">
            <Text className="text-purple-400 text-2xl font-bold">98%</Text>
            <Text className="text-white/60 text-[10px] uppercase tracking-widest mt-1">
              Success Rate
            </Text>
          </BlurView>
        </View>

        {/* Testimonial 1 */}
        <BlurView intensity={20} tint="dark" className="rounded-3xl p-6 mb-4 border-[1px] border-[rgba(255,255,255,0.15)]">
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: 'https://media.screensdesign.com/afprjsia/c4b1ad9c-3e44-4391-b4e9-9ea508f16835.png' }}
              className="w-12 h-12 rounded-full border-2 border-white/20 mr-4"
            />
            <View>
              <Text className="text-white font-semibold">Sarah Jenkins</Text>
              <View className="flex-row mt-0.5 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} color="#FBBF24" fill="#FBBF24" size={14} />
                ))}
              </View>
            </View>
          </View>
          <Text className="text-blue-50/80 text-sm italic leading-relaxed">
            "The glass UI is beautiful, but the content is even better. I finished my UI/UX certificate in 3 months and landed my dream job!"
          </Text>
        </BlurView>

        {/* Testimonial 2 */}
        <BlurView intensity={20} tint="dark" className="rounded-3xl p-6 mb-8 opacity-80 border-[1px] border-[rgba(255,255,255,0.15)]">
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: 'https://media.screensdesign.com/afprjsia/67024a3f-4786-4e3a-85d9-e553419c57d0.png' }}
              className="w-12 h-12 rounded-full border-2 border-white/20 mr-4"
            />
            <View>
              <Text className="text-white font-semibold">Marcus Chen</Text>
              <View className="flex-row mt-0.5 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} color="#FBBF24" fill="#FBBF24" size={14} />
                ))}
              </View>
            </View>
          </View>
          <Text className="text-blue-50/80 text-sm italic leading-relaxed">
            "I've tried many LMS apps, but ULearner's interactive quizzes and certificates actually made me stick to my goals."
          </Text>
        </BlurView>
      </ScrollView>

      {/* Footer */}
      <View className="p-6 pb-12">
        <TouchableOpacity
          onPress={onNext}
          className="w-full h-[60px] rounded-2xl items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <LinearGradient
            colors={['#6366F1', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="w-full h-full rounded-2xl items-center justify-center"
          >
            <Text className="text-white font-bold text-lg">Continue to Journey</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 3: Features Showcase Screen
function FeaturesStep({ onNext }: { onNext: () => void }) {
  const features = [
    { icon: Video, title: 'HD Video Lessons', description: 'Crystal clear streaming on any device.' },
    { icon: CheckCircle, title: 'Interactive Quizzes', description: 'Test your knowledge in real-time.' },
    { icon: Download, title: 'Offline Learning', description: 'Download courses and learn anywhere.' },
  ];

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
        style={{ opacity: 0.9 }}
      />

      <ScrollView className="flex-1 px-6 pt-32" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-10">
          <Text className="text-white text-3xl font-bold mb-2 tracking-tight">Learn Your Way</Text>
          <Text className="text-blue-100/80">Powerful features to help you master any subject.</Text>
        </View>

        {/* Features List */}
        <View className="mb-10">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <BlurView key={index} intensity={15} tint="light" className="rounded-3xl p-5 flex-row items-center mb-4 border-[1px] border-[rgba(255,255,255,0.2)]">
                <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center mr-5">
                  <IconComponent color="white" size={30} />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold">{feature.title}</Text>
                  <Text className="text-blue-100/60 text-xs">{feature.description}</Text>
                </View>
              </BlurView>
            );
          })}
        </View>

        {/* Did You Know */}
        <BlurView intensity={15} tint="light" className="p-6 rounded-3xl border border-dashed border-white/30 mb-8">
          <View className="flex-row items-center mb-2">
            <Info color="#F9A8D4" size={20} className="mr-3" />
            <Text className="text-pink-100 text-sm font-bold uppercase tracking-widest ml-3">
              Did you know?
            </Text>
          </View>
          <Text className="text-white/80 text-sm leading-relaxed">
            Offline learning ensures you stay productive even during travel, increasing study consistency by 40%.
          </Text>
        </BlurView>
      </ScrollView>

      {/* Footer */}
      <View className="p-6 pb-12">
        <TouchableOpacity
          onPress={onNext}
          className="w-full h-[60px] bg-white rounded-2xl items-center justify-center shadow-xl active:scale-95 transition-transform"
        >
          <Text className="text-indigo-700 font-bold text-lg">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 4: Path Selection Screen
function PathSelectionStep({
  selectedInterest,
  onSelectInterest,
  onNext,
}: {
  selectedInterest: string;
  onSelectInterest: (interest: string) => void;
  onNext: () => void;
}) {
  return (
    <View className="flex-1 bg-[#0F172A]">
      <LinearGradient
        colors={['#064E3B', '#0F172A', '#1E3A8A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0 opacity-80"
        style={{ transform: [{ scale: 1.3 }] }}
      />

      <ScrollView className="flex-1 px-6 pt-32" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8">
          <Text className="text-white text-3xl font-bold mb-2 tracking-tight">What interests you?</Text>
          <Text className="text-blue-100/60">Choose your path to get a custom learning plan.</Text>
        </View>

        {/* Path Grid */}
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">
          {INTERESTS.map((interest) => {
            const IconComponent = interest.icon;
            const isActive = selectedInterest === interest.id;
            
            return (
              <TouchableOpacity
                key={interest.id}
                onPress={() => onSelectInterest(interest.id)}
                className={`w-[48%] rounded-3xl p-6 items-center border-[1px] transition-all`}
                style={{ 
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  borderColor: isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                  transform: [{ scale: isActive ? 1.02 : 1 }] 
                }}
              >
                <View className="mb-3">
                  <IconComponent color={interest.color} size={36} />
                </View>
                <Text className="text-white font-medium">{interest.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-6 pb-12">
        <TouchableOpacity
          onPress={onNext}
          className="w-full h-[60px] bg-emerald-500 rounded-2xl items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Text className="text-white font-bold text-lg">Personalize My Path</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 5: Path Confirmation Screen
function PathConfirmationStep({
  selectedInterest,
  onNext,
}: {
  selectedInterest: string;
  onNext: () => void;
}) {
  const interest = INTERESTS.find((i) => i.id === selectedInterest);
  const pulseAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 1500,
            useNativeDriver: true,
          })
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: 1500,
            useNativeDriver: true,
          })
        ])
      ])
    ).start();
  }, [pulseAnim, opacityAnim]);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#4F46E5', '#10B981']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute inset-0 opacity-90"
      />

      <View className="flex-1 items-center justify-center px-8">
        {/* Visual Reinforcement */}
        <View className="relative mb-12">
          <Animated.View 
            style={{ 
              transform: [{ scale: pulseAnim }],
              opacity: opacityAnim
            }}
          >
            <BlurView intensity={20} tint="light" className="w-48 h-48 rounded-full items-center justify-center border-[1px] border-[rgba(255,255,255,0.2)] shadow-custom">
              <View className="w-32 h-32 rounded-full bg-emerald-500/20 items-center justify-center">
                <CheckCircle2 color="#10B981" size={60} />
              </View>
            </BlurView>
          </Animated.View>
          <Image
            source={{ uri: 'https://media.screensdesign.com/gasset/750055c0-f9ef-4ff5-bdde-dc8086dbf954.png' }}
            className="absolute -top-10 -right-10 w-24 h-24 opacity-60"
          />
        </View>

        {/* Text Content */}
        <Text className="text-white text-4xl font-bold text-center mb-4 tracking-tight">
          We've Got This!
        </Text>
        <Text className="text-blue-100 text-lg text-center mb-10 opacity-90">
          Your custom{' '}
          <Text className="text-emerald-300 font-bold underline">{interest?.label}</Text> path is
          ready. We've curated the best lessons to help you achieve your goals in record time.
        </Text>

        {/* Goal Summary */}
        <BlurView intensity={20} tint="light" className="w-full rounded-3xl p-6 mb-12 border-[1px] border-[rgba(255,255,255,0.2)]">
          <View className="flex-row items-center mb-4">
            <Calendar color="rgba(255,255,255,0.6)" size={20} className="mr-3" />
            <Text className="text-white text-sm ml-3">12-week intensive curriculum</Text>
          </View>
          <View className="flex-row items-center mb-4">
            <Award color="rgba(255,255,255,0.6)" size={20} className="mr-3" />
            <Text className="text-white text-sm ml-3">Industry-recognized certificate</Text>
          </View>
          <View className="flex-row items-center">
            <Users color="rgba(255,255,255,0.6)" size={20} className="mr-3" />
            <Text className="text-white text-sm ml-3">Access to student community</Text>
          </View>
        </BlurView>

        {/* Footer Action */}
        <TouchableOpacity
          onPress={onNext}
          className="w-full h-[60px] bg-white rounded-2xl items-center justify-center shadow-xl active:scale-95 transition-transform"
        >
          <Text className="text-indigo-700 font-bold text-lg">Reveal My Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 6: Subscription Paywall Screen
function SubscriptionStep({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#7C3AED', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute inset-0 opacity-90"
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-32 flex-row justify-between items-start mb-8">
          <TouchableOpacity
            onPress={onBack}
          >
            <BlurView intensity={20} tint="light" className="w-10 h-10 rounded-full items-center justify-center border-[1px] border-[rgba(255,255,255,0.2)]">
              <X color="rgba(255,255,255,0.5)" size={20} />
            </BlurView>
          </TouchableOpacity>
          <View className="items-end">
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
                Limited Time
              </Text>
            </View>
            <Text className="text-white/80 text-xs mt-1">Offer ends in 2:45</Text>
          </View>
        </View>

        <View className="px-6 pb-4">
          <Text className="text-white text-3xl font-bold text-center mb-2 tracking-tight">
            Start Your Mastery
          </Text>
          <Text className="text-blue-100/70 text-sm text-center">
            Invest in yourself today for a brighter tomorrow.
          </Text>
        </View>

        <View className="px-6">
          {/* Benefits */}
          <BlurView intensity={25} tint="light" className="rounded-3xl p-6 mb-4 border-[1px] border-[rgba(255,255,255,0.2)]">
            <View className="flex-row items-center mb-3">
              <CheckCircle color="#34D399" size={20} className="mr-3" />
              <Text className="text-white text-sm ml-3">Unlimited access to 500+ courses</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <CheckCircle color="#34D399" size={20} className="mr-3" />
              <Text className="text-white text-sm ml-3">Exclusive workshop downloads</Text>
            </View>
            <View className="flex-row items-center">
              <CheckCircle color="#34D399" size={20} className="mr-3" />
              <Text className="text-white text-sm ml-3">Personalized AI tutor support</Text>
            </View>
          </BlurView>

          {/* Yearly Plan */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('yearly')}
          >
            <BlurView 
              intensity={25} 
              tint="light" 
              className={`rounded-3xl p-5 flex-row items-center justify-between mb-4 border-[1px] ${
                selectedPlan === 'yearly' ? 'border-[rgba(255,255,255,1)] bg-white/20' : 'border-[rgba(255,255,255,0.2)]'
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 ${
                    selectedPlan === 'yearly' ? 'border-white' : 'border-white/20'
                  }`}
                >
                  {selectedPlan === 'yearly' && (
                    <View className="w-3 h-3 bg-white rounded-full" />
                  )}
                </View>
                <View>
                  <Text className="text-white font-bold">Yearly Plan</Text>
                  <Text className="text-white/60 text-xs">Best Value • $9.99/mo</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-white font-bold">$119.99</Text>
                <Text className="text-emerald-400 text-[10px] font-bold uppercase">Save 50%</Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          {/* Monthly Plan */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('monthly')}
          >
            <BlurView 
              intensity={25} 
              tint="light" 
              className={`rounded-3xl p-5 flex-row items-center justify-between mb-4 border-[1px] ${
                selectedPlan === 'monthly' ? 'border-[rgba(255,255,255,1)] bg-white/20' : 'border-[rgba(255,255,255,0.2)]'
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 ${
                    selectedPlan === 'monthly' ? 'border-white' : 'border-white/20'
                  }`}
                >
                  {selectedPlan === 'monthly' && (
                    <View className="w-3 h-3 bg-white rounded-full" />
                  )}
                </View>
                <View>
                  <Text className="text-white font-medium">Monthly Plan</Text>
                  <Text className="text-white/60 text-xs">Flexible • Cancel anytime</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-white font-bold">$19.99</Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          {/* Trust Badges */}
          <View className="flex-row justify-center gap-8 pt-4 opacity-50 mb-6">
            <Apple color="white" size={32} />
            <CreditCard color="white" size={32} />
            <CircleDollarSign color="white" size={32} />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-6 pb-12">
        <TouchableOpacity
          onPress={onComplete}
          className="w-full h-[60px] bg-white rounded-2xl items-center justify-center shadow-xl active:scale-95 transition-transform mb-4"
        >
          <Text className="text-purple-700 font-extrabold text-lg">
            Start Free Trial & Subscribe
          </Text>
        </TouchableOpacity>
        <Text className="text-white/40 text-[10px] text-center px-4">
          Terms apply. Recurring billing. Cancel 24h before trial ends to avoid charges.
        </Text>
      </View>
    </View>
  );
}
