import React, { useState, useEffect } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Camera, Layout, Tag, DollarSign, BarChart, FileText, Save, Trash2, BookOpen, ChevronRight } from 'lucide-react-native';
import { useCourse, useUpdateCourse, useDeleteCourse } from '@/lib/api/courses';

const CATEGORIES = ['Technology', 'Business', 'Design', 'Marketing', 'Health', 'Personal Development'];
const LEVELS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' }
];

export default function EditCoursePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: course, isLoading: isLoadingCourse } = useCourse(id as string);
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const handleDelete = () => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteCourse(id as string, {
              onSuccess: () => {
                Alert.alert('Deleted', 'Course deleted successfully.', [
                  { text: 'OK', onPress: () => router.replace('/tutors') }
                ]);
              },
              onError: (error) => {
                Alert.alert('Error', error.message || 'Failed to delete course.');
              }
            });
          }
        }
      ]
    );
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('beginner');
  const [price, setPrice] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    if (course) {
      setTitle(course.title || '');
      setDescription(course.description || '');
      setCategory(course.category || '');
      setLevel(course.level || 'beginner');
      setPrice(course.price?.toString() || '0');
      setThumbnailUrl(course.thumbnail_url || '');
    }
  }, [course]);

  const handleUpdate = () => {
    if (!title || !description || !category || !price) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    updateCourse({
      id: id as string,
      updates: {
        title,
        description,
        category,
        level: level as any,
        price: parseFloat(price),
        thumbnail_url: thumbnailUrl,
      }
    }, {
      onSuccess: () => {
        Alert.alert('Success', 'Course updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      },
      onError: (error) => {
        Alert.alert('Error', error.message || 'Failed to update course.');
      }
    });
  };

  if (isLoadingCourse) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Edit Course</Text>
          <TouchableOpacity 
            onPress={handleUpdate} 
            disabled={isUpdating}
            style={styles.saveButton}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#6366f1" />
            ) : (
              <Save size={22} color="#6366f1" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push(`/tutors/edit/${id}/lessons`)}
            >
              <View style={styles.actionIconContainer}>
                <BookOpen size={20} color="#6366f1" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Manage Curriculum</Text>
                <Text style={styles.actionSubtitle}>Add chapters and lessons to your course</Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Thumbnail Preview/Picker */}
          <View style={styles.thumbnailContainer}>
            <TouchableOpacity style={styles.thumbnailPlaceholder} activeOpacity={0.7}>
              <Camera size={32} color="#64748b" />
              <Text style={styles.thumbnailText}>Change Course Thumbnail</Text>
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
            style={[styles.submitButton, isUpdating && styles.submitButtonDisabled]}
            onPress={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="#ef4444" />
              ) : (
                <>
                  <Trash2 size={20} color="#ef4444" />
                  <Text style={styles.deleteButtonText}>Delete Course</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.dangerSubtitle}>
              Once you delete a course, there is no going back. Please be certain.
            </Text>
          </View>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  saveButton: {
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
  quickActions: {
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748b',
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
  dangerZone: {
    marginTop: 48,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fee2e2',
    gap: 16,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#991b1b',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  dangerSubtitle: {
    fontSize: 12,
    color: '#991b1b',
    textAlign: 'center',
    opacity: 0.6,
  },
});
