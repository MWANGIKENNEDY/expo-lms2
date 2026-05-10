import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ChevronRight, LucideIcon } from 'lucide-react-native';

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  onPress,
  destructive 
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <BlurView intensity={10} tint="light" style={styles.inner}>
        <View style={styles.left}>
          <View style={[styles.iconContainer, destructive && styles.destructiveIcon]}>
            <Icon size={18} color={destructive ? '#EF4444' : '#818CF8'} />
          </View>
          <Text style={[styles.label, destructive && styles.destructiveText]}>{label}</Text>
        </View>
        <View style={styles.right}>
          {value && <Text style={styles.value}>{value}</Text>}
          <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(129, 140, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  destructiveText: {
    color: '#EF4444',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
});
