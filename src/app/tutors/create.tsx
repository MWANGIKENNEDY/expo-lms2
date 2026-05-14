import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Camera, Layout, Tag, DollarSign, BarChart, FileText } from 'lucide-react-native';
import { useCreateCourse } from '@/lib/api/courses';

const CATEGORIES = ['Technology', 'Business', 'Design', 'Marketing', 'Health', 'Personal Development'];
const LEVELS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' }
];

export default function CreateCoursePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('beginner');
  const [price, setPrice] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60');

  const { mutate: createCourse, isPending } = useCreateCourse();

  const handleCreate = () => {
    if (!title || !description || !category || !price) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    createCourse({
      title,
      description,
      category,
      level: level as any,
      price: parseFloat(price),
      thumbnail_url: thumbnailUrl,
      is_published: false,
    }, {
      onSuccess: () => {
        Alert.alert('Success', 'Course created successfully!', [
          { text: 'OK', onPress: () => router.replace('/tutors') }
        ]);
      },
      onError: (error) => {
        Alert.alert('Error', error.message || 'Failed to create course.');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ChevronLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Course</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Thumbnail Preview/Picker */}
          <View style={styles.thumbnailContainer}>
            <TouchableOpacity style={styles.thumbnailPlaceholder} activeOpacity={0.7}>
              <Camera size={32} color="#64748b" />
              <Text style={styles.thumbnailText}>Add Course Thumbnail</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Layout size={18} color="#6366f1" />
                <Text style={styles.label}>Course Title</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. Master React Native Development"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <FileText size={18} color="#6366f1" />
                <Text style={styles.label}>Description</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What will students learn in this course?"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <View style={styles.labelRow}>
                  <Tag size={18} color="#6366f1" />
                  <Text style={styles.label}>Category</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity 
                      key={cat}
                      style={[styles.chip, category === cat && styles.chipActive]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <View style={styles.labelRow}>
                  <BarChart size={18} color="#6366f1" />
                  <Text style={styles.label}>Difficulty Level</Text>
                </View>
                <View style={styles.levelRow}>
                  {LEVELS.map((l) => (
                    <TouchableOpacity 
                      key={l.value}
                      style={[styles.levelChip, level === l.value && styles.levelChipActive]}
                      onPress={() => setLevel(l.value)}
                    >
                      <Text style={[styles.levelText, level === l.value && styles.levelTextActive]}>{l.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <DollarSign size={18} color="#6366f1" />
                <Text style={styles.label}>Price (USD)</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
            onPress={handleCreate}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Course</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  thumbnailContainer: {
    width: '100%',
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e2e8f0',
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  thumbnailText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
  },
  chipScroll: {
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  chipTextActive: {
    color: '#fff',
  },
  levelRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  levelChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  levelChipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  levelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  levelTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
