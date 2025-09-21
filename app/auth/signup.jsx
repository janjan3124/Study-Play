import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Icon */}
      <Ionicons name="rocket-outline" size={80} color="#2F5D50" style={styles.icon} />

      <Text style={styles.title}>Join StudyPlay</Text>
      <Text style={styles.subtitle}>Create your account and start balancing study & fun</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleSignup}>
        <Ionicons name="person-add-outline" size={20} color="white" style={{ marginRight: 6 }} />
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      {/* Go to Login Link */}
      <Pressable onPress={() => router.push("/auth/login")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#F4F9F4" },
  icon: { marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2F5D50", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
  },
  error: { color: "red", marginBottom: 10 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#2F5D50",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
  link: { marginTop: 20, color: "#4285F4", fontWeight: "500" },
});
