import { BlurView } from 'expo-blur';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassPanel({ children, style, intensity = 20 }: GlassPanelProps) {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} style={styles.blur} tint="light">
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  blur: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
