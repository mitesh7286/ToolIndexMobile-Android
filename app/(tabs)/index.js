import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../services/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // The AuthProvider will detect the session change and redirect automatically,
      // but we can also manually navigate for a smoother experience.
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
      alert("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Welcome to Tool-Index!
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#ef4444",
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 24,
          alignItems: "center",
        }}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            Logout
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
