import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export function SplashLoader() {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const loaderAnim = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in logo
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Infinite pulsing background (Native)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Loader progress (JS driven for width)
    Animated.loop(
      Animated.sequence([
        Animated.timing(loaderAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(loaderAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [pulseAnim, loaderAnim, logoOpacity]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const auroraOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <View style={styles.container}>
      {/* Dynamic Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={{ opacity: auroraOpacity }}>
          <LinearGradient
            colors={['#4F46E5', 'transparent']}
            style={[styles.aurora, { top: -100, left: -100, width: 400, height: 400 }]}
          />
          <LinearGradient
            colors={['#7C3AED', 'transparent']}
            style={[styles.aurora, { bottom: -100, right: -100, width: 400, height: 400 }]}
          />
        </Animated.View>
      </View>

      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.logoContainer, 
            { 
              opacity: logoOpacity,
              transform: [{ scale }] 
            }
          ]}
        >
          <BlurView intensity={20} tint="light" style={styles.glassCircle}>
            <Image 
              source={{ uri: 'https://media.screensdesign.com/afprjsia/edeb2ed2-0d46-4967-bc02-604a9c00e09d.png' }} 
              style={styles.logo}
              resizeMode="contain"
            />
          </BlurView>
        </Animated.View>
        
        <Animated.View style={{ opacity: logoOpacity }}>
          <Text style={styles.title}>ULEARNER</Text>
          <Text style={styles.subtitle}>Unlock Your Potential</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.loaderBarContainer}>
          <Animated.View 
            style={[
              styles.loaderBar,
              {
                width: loaderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aurora: {
    position: 'absolute',
    borderRadius: 200,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  glassCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    width: '60%',
  },
  loaderBarContainer: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  loaderBar: {
    height: '100%',
    backgroundColor: '#6366F1',
  },
});
