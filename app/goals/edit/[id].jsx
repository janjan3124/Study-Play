import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  ActivityIndicator, 
  Keyboard, 
  Alert 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const categories = ["Study", "Sports"];

const EditGoal = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Study");
  const [loading, setLoading] = useState(true);

  // Fetch goal data
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setCategory(data.category || "Study");
        }
      } catch (error) {
        console.log("Error fetching goal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        title,
        category,
      });
      Keyboard.dismiss();
      router.push("/goals");
    } catch (error) {
      console.log("Error updating goal:", error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "goals", id));
              router.push("/goals");
            } catch (error) {
              console.log("Error deleting goal:", error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>

      {/* Title */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Category Selector */}
      <View style={styles.categoryRow}>
        {categories.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            style={[
              styles.categoryButton,
              category === c && styles.activeCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                category === c && styles.activeCategoryText,
              ]}
            >
              {c}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Update Button */}
      <Pressable
        onPress={handleUpdate}
        style={[styles.button, { backgroundColor: "#21cc8d" }]}
      >
        <Text style={styles.buttonText}>Update Task</Text>
      </Pressable>

      {/* Delete Button */}
      <Pressable
        onPress={handleDelete}
        style={[styles.button, { backgroundColor: "#E53935", marginTop: 10 }]}
      >
        <Text style={styles.buttonText}>Delete Task</Text>
      </Pressable>
    </View>
  );
};

export default EditGoal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F9F4",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#2F5D50",
    marginTop: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#DDE5DC",
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDE5DC",
    backgroundColor: "white",
  },
  activeCategory: {
    backgroundColor: "#2F5D50",
    borderColor: "#2F5D50",
  },
  categoryText: {
    fontSize: 16,
    color: "#2F5D50",
  },
  activeCategoryText: {
    color: "white",
    fontWeight: "600",
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
