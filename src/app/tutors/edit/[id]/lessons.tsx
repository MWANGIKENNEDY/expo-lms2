import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ChevronLeft, 
  Plus, 
  GripVertical, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Video, 
  ChevronDown, 
  ChevronUp,
  MoreVertical
} from 'lucide-react-native';
import { useCourse } from '@/lib/api/courses';
import { 
  useCreateChapter, 
  useUpdateChapter, 
  useDeleteChapter,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson
} from '@/lib/api/curriculum';

export default function ManageLessonsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: course, isLoading } = useCourse(id as string);
  
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapter = useDeleteChapter();
  
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();

  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'chapter' | 'lesson'>('chapter');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null); // For lesson (chapter_id)
  
  const [formTitle, setFormTitle] = useState('');

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const openChapterModal = (chapter?: any) => {
    setModalType('chapter');
    if (chapter) {
      setEditingId(chapter.id);
      setFormTitle(chapter.title);
    } else {
      setEditingId(null);
      setFormTitle('');
    }
    setModalVisible(true);
  };

  const openLessonModal = (chapterId: string, lesson?: any) => {
    setModalType('lesson');
    setParentId(chapterId);
    if (lesson) {
      setEditingId(lesson.id);
      setFormTitle(lesson.title);
    } else {
      setEditingId(null);
      setFormTitle('');
    }
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!formTitle.trim()) return;

    if (modalType === 'chapter') {
      if (editingId) {
        updateChapter.mutate({ id: editingId, updates: { title: formTitle } }, {
          onError: (error: any) => Alert.alert('Error', error.message || 'Failed to update chapter')
        });
      } else {
        createChapter.mutate({ 
          course_id: id as string, 
          title: formTitle,
          order_index: (course?.chapters?.length || 0) + 1
        }, {
          onError: (error: any) => Alert.alert('Error', error.message || 'Failed to create chapter')
        });
      }
    } else {
      if (editingId) {
        updateLesson.mutate({ id: editingId, updates: { title: formTitle } }, {
          onError: (error: any) => Alert.alert('Error', error.message || 'Failed to update lesson')
        });
      } else {
        createLesson.mutate({ 
          course_id: id as string,
          chapter_id: parentId!,
          title: formTitle,
          order_index: 0 // Simplification
        }, {
          onError: (error: any) => Alert.alert('Error', error.message || 'Failed to create lesson')
        });
      }
    }
    setModalVisible(false);
  };

  const handleDeleteChapter = (chapterId: string, title: string) => {
    Alert.alert(
      'Delete Chapter',
      `Are you sure you want to delete "${title}" and all its lessons?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteChapter.mutate({ id: chapterId, courseId: id as string }, {
            onError: (error: any) => Alert.alert('Error', error.message || 'Failed to delete chapter')
          }) 
        }
      ]
    );
  };

  const handleDeleteLesson = (lessonId: string, title: string) => {
    Alert.alert(
      'Delete Lesson',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteLesson.mutate({ id: lessonId, courseId: id as string }, {
            onError: (error: any) => Alert.alert('Error', error.message || 'Failed to delete lesson')
          }) 
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Curriculum</Text>
        <TouchableOpacity onPress={() => openChapterModal()} style={styles.addChapterButton}>
          <Plus size={20} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course?.title}</Text>
          <Text style={styles.courseSubtitle}>{course?.chapters?.length || 0} Chapters</Text>
        </View>

        {course?.chapters?.map((chapter: any) => (
          <View key={chapter.id} style={styles.chapterCard}>
            <View style={styles.chapterHeader}>
              <TouchableOpacity 
                style={styles.chapterMain} 
                onPress={() => toggleChapter(chapter.id)}
              >
                <GripVertical size={20} color="#94a3b8" />
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                {expandedChapters.includes(chapter.id) ? (
                  <ChevronUp size={20} color="#64748b" />
                ) : (
                  <ChevronDown size={20} color="#64748b" />
                )}
              </TouchableOpacity>
              <View style={styles.chapterActions}>
                <TouchableOpacity onPress={() => openChapterModal(chapter)}>
                  <Edit2 size={18} color="#64748b" style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteChapter(chapter.id, chapter.title)}>
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>

            {expandedChapters.includes(chapter.id) && (
              <View style={styles.lessonsContainer}>
                {chapter.lessons?.map((lesson: any) => (
                  <View key={lesson.id} style={styles.lessonItem}>
                    <Video size={16} color="#94a3b8" />
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <View style={styles.lessonActions}>
                      <TouchableOpacity onPress={() => openLessonModal(chapter.id, lesson)}>
                        <Edit2 size={16} color="#64748b" style={styles.actionIcon} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteLesson(lesson.id, lesson.title)}>
                        <Trash2 size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <TouchableOpacity 
                  style={styles.addLessonButton}
                  onPress={() => openLessonModal(chapter.id)}
                >
                  <Plus size={16} color="#6366f1" />
                  <Text style={styles.addLessonText}>Add Lesson</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {(!course?.chapters || course.chapters.length === 0) && (
          <View style={styles.emptyState}>
            <BookOpen size={48} color="#e2e8f0" strokeWidth={1} />
            <Text style={styles.emptyTitle}>Empty Curriculum</Text>
            <Text style={styles.emptySubtitle}>Start by adding your first chapter</Text>
            <TouchableOpacity 
              style={styles.createChapterButtonLarge}
              onPress={() => openChapterModal()}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.createChapterTextLarge}>Add Chapter</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal for Add/Edit */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Edit' : 'Add'} {modalType === 'chapter' ? 'Chapter' : 'Lesson'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={`${modalType === 'chapter' ? 'Chapter' : 'Lesson'} Title`}
              value={formTitle}
              onChangeText={setFormTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancel} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSubmit} 
                onPress={handleSubmit}
              >
                <Text style={styles.modalSubmitText}>
                  {editingId ? 'Save' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  addChapterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  courseInfo: {
    marginBottom: 24,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  chapterCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  chapterMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chapterTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  chapterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 8,
  },
  actionIcon: {
    opacity: 0.8,
  },
  lessonsContainer: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  lessonTitle: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  lessonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addLessonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 4,
  },
  addLessonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
  },
  createChapterButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  createChapterTextLarge: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  modalSubmit: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#6366f1',
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
