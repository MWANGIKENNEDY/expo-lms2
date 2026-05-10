import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, Stack } from 'expo-router'
import { BarChart2, Clock, Star, Tag, Users, Heart, ChevronDown } from 'lucide-react-native'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, FlatList, ActivityIndicator } from 'react-native'
import { useCourses } from '@/lib/api/courses'
import { router } from 'expo-router'

const { width } = Dimensions.get('window')

export default function SearchScreen() {
  const params = useLocalSearchParams()
  const query = (params.q || params.query || params.search || '') as string
  const { data: courses = [], isLoading } = useCourses()

  const filteredResults = courses.filter(course => 
    course.title.toLowerCase().includes(query.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(query.toLowerCase())) ||
    (course.category && course.category.toLowerCase().includes(query.toLowerCase()))
  )

  const filters = [
    { id: 'difficulty', label: 'Difficulty', icon: BarChart2, active: true },
    { id: 'price', label: 'Price', icon: Tag },
    { id: 'duration', label: 'Duration', icon: Clock },
    { id: 'ratings', label: 'Ratings', icon: Star },
  ]

  return (
    <View style={styles.container}>
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#312E81', 'transparent']}
          style={[styles.aurora, { top: -100, right: -100, width: 400, height: 400 }]}
        />
        <LinearGradient
          colors={['#4C1D95', 'transparent']}
          style={[styles.aurora, { bottom: -100, left: -100, width: 400, height: 400 }]}
        />
      </View>

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterCarousel} contentContainerStyle={{ paddingRight: 40 }}>
              {filters.map((filter) => (
                <TouchableOpacity 
                  key={filter.id} 
                  style={[styles.filterChip, filter.active && styles.filterChipActive]}
                >
                  <filter.icon size={14} color={filter.active ? '#fff' : 'rgba(255,255,255,0.6)'} />
                  <Text style={[styles.filterLabel, filter.active && styles.filterLabelActive]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Results Meta */}
            <View style={styles.metaRow}>
              <Text style={styles.resultsCount}>
                {query ? `Results for "${query}"` : '24 Results Found'}
              </Text>
              <TouchableOpacity style={styles.sortButton}>
                <Text style={styles.sortText}>Sort by Relevant</Text>
                <ChevronDown size={14} color="#818CF8" />
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.courseCard}
            onPress={() => router.push({ pathname: '/course/[id]', params: { id: item.id } })}
          >
            <View style={styles.thumbnailContainer}>
              <Image 
                source={{ uri: item.thumbnail_url || 'https://media.screensdesign.com/gasset/39b0390b-0bda-47cc-bf53-e50f1940d3ab.png' }} 
                style={styles.thumbnail} 
              />
              {item.is_published && (
                <View style={styles.bestsellerBadge}>
                  <Text style={styles.bestsellerText}>PUBLISHED</Text>
                </View>
              )}
              <TouchableOpacity style={styles.heartButton}>
                <BlurView intensity={20} tint="light" style={styles.heartBlur}>
                  <Heart size={18} color="#fff" />
                </BlurView>
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <View style={styles.ratingBadge}>
                  <Star size={10} color="#FBBF24" fill="#FBBF24" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
              </View>

              <View style={styles.metaRowSmall}>
                <View style={styles.metaItem}>
                  <Users size={14} color="rgba(255,255,255,0.3)" />
                  <Text style={styles.metaText}>1.2k Students</Text>
                </View>
                <View style={styles.metaItem}>
                  <BarChart2 size={14} color="rgba(255,255,255,0.3)" />
                  <Text style={styles.metaText}>{item.level || 'Beginner'}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.priceText}>${item.price || 'Free'}</Text>
                <View style={styles.mentorInfo}>
                  <View style={styles.mentorAvatar}>
                    <Image source={{ uri: 'https://media.screensdesign.com/afprjsia/c4b1ad9c-3e44-4391-b4e9-9ea508f16835.png' }} style={styles.avatarImage} />
                  </View>
                  <Text style={styles.mentorName}>Expert Instructor</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.skeletonContainer}>
              <ActivityIndicator color="#6366F1" size="large" />
            </View>
          ) : filteredResults.length === 0 ? (
            <View className="py-20 items-center">
              <Text className="text-white/40">No courses found matching your search.</Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  aurora: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.6,
  },
  scrollContent: {
    paddingTop: 140, // Increased to account for native search bar if it pushes content
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  filterCarousel: {
    marginBottom: 24,
    marginLeft: -24,
    paddingLeft: 24,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#fff',
  },
  filterLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterLabelActive: {
    color: '#fff',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsCount: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  courseCard: {
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    marginBottom: 24,
  },
  thumbnailContainer: {
    height: 192,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  bestsellerBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(79, 70, 229, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestsellerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  heartBlur: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
    lineHeight: 24,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  metaRowSmall: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  priceText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mentorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  mentorName: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  skeletonContainer: {
    opacity: 0.5,
  },
  skeletonCard: {
    height: 300,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
  },
  skeletonImage: {
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    marginBottom: 16,
  },
  skeletonTextRow: {
    height: 20,
    width: '70%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    marginBottom: 10,
  },
  skeletonTextSmall: {
    height: 12,
    width: '40%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
  },
})
