import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TutorsDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor Dashboard</Text>
      <Text style={styles.subtitle}>Manage your courses and student progress here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
