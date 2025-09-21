import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const categoryOptions = ['All', 'Study', 'Sports'];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const router = useRouter();

  // animations
  const anim1 = useState(new Animated.Value(0))[0];
  const anim2 = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setGoals(list);
    });

    return unsubscribe;
  }, []);

  const toggleFab = () => {
    if (fabOpen) {
      // close
      Animated.parallel([
        Animated.timing(anim1, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(anim2, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setFabOpen(false));
    } else {
      setFabOpen(true);
      Animated.stagger(60, [
        Animated.spring(anim1, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(anim2, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    try {
      if (ts.toDate) return ts.toDate().toLocaleDateString();
      if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleDateString();
      return new Date(ts).toLocaleDateString();
    } catch (e) {
      return '';
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Task', 'Are you sure you want to remove this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const docRef = doc(db, 'goals', id);
            await deleteDoc(docRef);
          } catch (error) {
            console.log('Error deleting task:', error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.goalItem}
      onPress={() => router.push(`/goals/edit/${item.id}`)}
    >
      <View style={styles.rowBetween}>
        <Text style={styles.goalText}>{item.title || 'Untitled Task'}</Text>
        {item.price ? (
          <Text style={styles.priceText}>{item.price}</Text>
        ) : null}
      </View>

      <Text style={styles.categoryText}>
        📌 {item.category || 'General'}
      </Text>
      <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

      {item.description ? (
        <Text numberOfLines={2} style={styles.desc}>
          {item.description}
        </Text>
      ) : null}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📚 StudyPlay Tasks</Text>
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setFilterOpen((o) => !o)}
        >
          <Text style={styles.filterToggleText}>{filter}</Text>
          <Ionicons
            name={filterOpen ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#2F5D50"
          />
        </TouchableOpacity>

        {filterOpen && (
          <View style={styles.filterOptions}>
            {categoryOptions.map((c) => (
              <Pressable
                key={c}
                onPress={() => {
                  setFilter(c);
                  setFilterOpen(false);
                }}
                style={[
                  styles.filterOption,
                  filter === c && styles.activeFilterOption,
                ]}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filter === c && styles.activeFilterOptionText,
                  ]}
                >
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Task List */}
      <FlatList
        data={goals.filter((g) => filter === 'All' || g.category === filter)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet 📝 Add one!</Text>
        }
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Floating Action Button Menu */}
      <View style={styles.fabContainer}>
        {fabOpen && (
          <>
            {/* Add Task */}
            <Animated.View
              style={{
                opacity: anim1,
                transform: [
                  {
                    translateY: anim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -70],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={[styles.fabOption, { backgroundColor: '#4CAF50' }]}
                onPress={() => {
                  router.push('/goals/create');
                  toggleFab();
                }}
              >
                <Ionicons name="add" size={22} color="white" />
              </TouchableOpacity>
            </Animated.View>

            {/* Logout */}
            <Animated.View
              style={{
                opacity: anim2,
                transform: [
                  {
                    translateY: anim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -140],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={[styles.fabOption, { backgroundColor: '#E53935' }]}
                onPress={() => {
                  signOut(auth);
                  toggleFab();
                }}
              >
                <Ionicons name="log-out" size={22} color="white" />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        {/* Main FAB */}
        <TouchableOpacity style={styles.fabMain} onPress={toggleFab}>
          <Ionicons
            name={fabOpen ? 'close' : 'menu'}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F4' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 16,
    marginTop: 0,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2F5D50' },

  filterRow: { paddingHorizontal: 16 },
  filterToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE5DC',
  },
  filterToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F5D50',
  },
  filterOptions: {
    marginTop: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDE5DC',
    borderRadius: 12,
  },
  filterOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterOptionText: { fontSize: 16, color: '#2F5D50' },
  activeFilterOption: { backgroundColor: '#4CAF50' },
  activeFilterOptionText: { color: '#fff', fontWeight: '600' },

  goalItem: {
    padding: 14,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalText: { fontSize: 18, fontWeight: '700', color: '#2F5D50' },
  priceText: { fontSize: 16, color: '#4CAF50', fontWeight: '600' },
  categoryText: { marginTop: 6, color: '#388E3C', fontWeight: '500' },
  dateText: { fontSize: 12, color: '#888', marginTop: 4 },
  desc: { marginTop: 8, color: '#444' },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
    color: '#666',
  },

  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
  },
  fabMain: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2F5D50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
  },
});
