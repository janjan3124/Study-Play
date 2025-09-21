import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2F5D50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* StudyPlay Icon */}
      <Ionicons name="book-outline" size={80} color="#2F5D50" style={styles.icon} />

      {/* Title */}
      <Text style={styles.title}>StudyPlay</Text>
      <Text style={styles.subtitle}>Balance study and sports in one place</Text>

      {/* Actions */}
      <Pressable style={styles.button} onPress={() => router.push("/goals")}>
        <Ionicons name="list-outline" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>My Tasks</Text>
      </Pressable>

      <Pressable 
        style={[styles.button, { backgroundColor: "#4285F4" }]} 
        onPress={() => router.push("/goals/create")}
      >
        <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Quick Add Task</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9F4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#2F5D50",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 16,
    backgroundColor: "#2F5D50",
    borderRadius: 14,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Home;
