// app/landing.js
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const features = [
  {
    icon: "shield-checkmark",
    title: "Secure Tracking",
    text: "Your tool data is encrypted and only shared with law enforcement when needed.",
  },
  {
    icon: "car",
    title: "Canada-Wide",
    text: "Coverage from BC to Newfoundland – recover tools anywhere in Canada.",
  },
  {
    icon: "time",
    title: "Real-Time Updates",
    text: "Get instant notifications when your tool status changes.",
  },
  {
    icon: "checkmark-circle",
    title: "Verified Listings",
    text: "All tools are verified by our team or law enforcement partners.",
  },
];

export default function Landing() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/register");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Tool-Index</Text>
          <Text style={styles.tagline}>www.toolindex.ca</Text>
        </View>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Track Your Tools Across <Text style={styles.heroAccent}>Canada</Text>
        </Text>
        <Text style={styles.heroText}>
          The largest database of construction tools from DeWalt, Milwaukee,
          Gray Tools, and more. Report lost tools, check recovery status, and
          connect with law enforcement – all in one place.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started Free</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15,000+</Text>
            <Text style={styles.statLabel}>Tools Tracked</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2,500+</Text>
            <Text style={styles.statLabel}>Recoveries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Canadian Cities</Text>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Tool-Index?</Text>
        <Text style={styles.sectionSubtitle}>
          Built for Canadian tradespeople, by people who understand the job site
        </Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <View key={idx} style={styles.featureCard}>
              <Ionicons name={feature.icon} size={32} color="#3b82f6" />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaContainer}>
        <Text style={styles.ctaTitle}>Start Protecting Your Tools Today</Text>
        <Text style={styles.ctaText}>
          Join thousands of Canadian tradespeople who never lose track of their
          investment.
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
          <Text style={styles.ctaButtonText}>{`Get Started – It's Free `}</Text>
          <Ionicons name="arrow-forward" size={18} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Tool-Index. All rights reserved.
        </Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  brand: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  tagline: {
    fontSize: 10,
    color: "#6b7280",
  },
  signInText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3b82f6",
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#f0f7ff",
    marginHorizontal: 16,
    borderRadius: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 36,
    marginBottom: 12,
  },
  heroAccent: {
    color: "#3b82f6",
  },
  heroText: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: 12,
    color: "#4b5563",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  featureText: {
    fontSize: 12,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 18,
  },
  ctaContainer: {
    backgroundColor: "#3b82f6",
    marginHorizontal: 20,
    marginVertical: 32,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
    marginRight: 8,
  },
  footer: {
    marginTop: 32,
    marginBottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 12,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  footerLink: {
    fontSize: 12,
    color: "#6b7280",
    marginHorizontal: 12,
    textDecorationLine: "underline",
  },
});
