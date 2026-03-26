import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../services/supabaseClient";

export default function RegisterScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
    accountType: "",
  });

  // Display values for formatting
  const [displayPhone, setDisplayPhone] = useState("");
  const [displayPostal, setDisplayPostal] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Terms state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);

  // Formatting functions
  const formatPhone = (digits) => {
    const cleaned = digits.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    if (cleaned.length > 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length > 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 0) {
      return `(${cleaned}`;
    }
    return cleaned;
  };

  const formatPostal = (value) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (cleaned.length > 3) {
      return cleaned.slice(0, 3) + " " + cleaned.slice(3, 6);
    }
    return cleaned;
  };

  // Sync raw values to display
  useEffect(() => {
    setDisplayPhone(formatPhone(formData.phone));
  }, [formData.phone]);

  useEffect(() => {
    setDisplayPostal(formatPostal(formData.postalCode));
  }, [formData.postalCode]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "name":
        return !value ? "Full name is required" : "";
      case "phone":
        const phoneRegex = /^\d{10}$/;
        if (!value) return "Phone number is required";
        if (!phoneRegex.test(value)) return "Phone must be 10 digits";
        return "";
      case "accountType":
        return !value ? "Account type is required" : "";
      default:
        return "";
    }
  };

  // Generic change handler
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) setError("");
  };

  // Special handlers
  const handlePhoneChange = (text) => {
    const raw = text.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: raw }));
  };

  const handlePostalChange = (text) => {
    const raw = text
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);
    setFormData((prev) => ({ ...prev, postalCode: raw }));
  };

  const handleBlur = (name) => {
    const valToValidate =
      name === "phone"
        ? formData.phone
        : name === "postalCode"
          ? formData.postalCode
          : formData[name];
    const error = validateField(name, valToValidate);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isGovernmentEmail = (email) => {
    const governmentDomains = [
      "calgarypolice.ca",
      "calgary.ca",
      "camrosepolice.ca",
      "edmontonpolice.ca",
      "ottawapolice.ca",
      "torontopolice.on.ca",
      "rcmp-grc.gc.ca",
      "vpd.ca",
      "cpkcpolice.com",
      "peelpolice.ca",
      "gmail.com",
    ];
    return governmentDomains.some((domain) =>
      email.toLowerCase().includes(domain.toLowerCase()),
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!validateAllFields()) {
      setError("Please fix all errors before submitting");
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms and Conditions to register");
      setLoading(false);
      return;
    }

    if (
      formData.accountType === "government" &&
      !isGovernmentEmail(formData.email)
    ) {
      setError(
        "Government accounts must use an official government email address",
      );
      setLoading(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            fullName: formData.name,
            account_Type: formData.accountType,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            province: formData.province,
            postal_code: formData.postalCode,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
          },
          // For React Native, we don't need to specify redirect URL; Supabase will send email with default redirect
        },
      });

      if (supabaseError) throw supabaseError;
      setSuccess(true);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Account type options
  const accountTypes = [
    { label: "Tool Owner", value: "owner" },
    { label: "Business Owner", value: "business" },
    { label: "Government Agency", value: "government" },
  ];

  const getAccountTypeLabel = (value) => {
    const found = accountTypes.find((type) => type.value === value);
    return found ? found.label : "Select account type";
  };

  // Success UI
  if (success) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Registration Successful!</Text>
            <Text style={styles.successText}>
              Please check your email to verify your account. After verification
              you will be redirected automatically.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Tool‑Index</Text>
          <Text style={styles.subtitle}>Create Your Account</Text>

          {/* Error alert */}
          {error ? (
            <View style={styles.errorAlert}>
              <Text style={styles.errorAlertText}>{error}</Text>
            </View>
          ) : null}

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
              onBlur={() => handleBlur("name")}
              placeholder="Enter your full name"
              placeholderTextColor="#9ca3af"
            />
            {errors.name && (
              <Text style={styles.errorMessage}>{errors.name}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              onBlur={() => handleBlur("email")}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
            {errors.email && (
              <Text style={styles.errorMessage}>{errors.email}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
              onBlur={() => handleBlur("password")}
              placeholder="At least 6 characters"
              secureTextEntry
              placeholderTextColor="#9ca3af"
            />
            {errors.password && (
              <Text style={styles.errorMessage}>{errors.password}</Text>
            )}
          </View>

          {/* Account Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Type *</Text>
            <TouchableOpacity
              style={[
                styles.input,
                styles.pickerInput,
                errors.accountType ? styles.inputError : null,
              ]}
              onPress={() => setShowAccountTypeModal(true)}
            >
              <Text style={styles.pickerText}>
                {getAccountTypeLabel(formData.accountType)}
              </Text>
            </TouchableOpacity>
            {errors.accountType && (
              <Text style={styles.errorMessage}>{errors.accountType}</Text>
            )}
            {formData.accountType === "government" && (
              <Text style={styles.infoMessage}>
                Government accounts require official email verification
              </Text>
            )}
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[styles.input, errors.phone ? styles.inputError : null]}
              value={displayPhone}
              onChangeText={handlePhoneChange}
              onBlur={() => handleBlur("phone")}
              placeholder="(123) 456-7890"
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
            />
            {errors.phone && (
              <Text style={styles.errorMessage}>{errors.phone}</Text>
            )}
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => handleChange("address", text)}
              placeholder="Street address"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(text) => handleChange("city", text)}
              placeholder="City"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Province and Postal Code row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Province</Text>
              <TextInput
                style={styles.input}
                value={formData.province}
                onChangeText={(text) => handleChange("province", text)}
                placeholder="Province"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput
                style={styles.input}
                value={displayPostal}
                onChangeText={handlePostalChange}
                onBlur={() => handleBlur("postalCode")}
                placeholder="A1A 1A1"
                autoCapitalize="characters"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Terms Checkbox */}
          <View style={styles.termsGroup}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View
                style={[
                  styles.checkbox,
                  termsAccepted && styles.checkboxChecked,
                ]}
              >
                {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I accept the{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => setShowTermsModal(true)}
                >
                  Terms and Conditions
                </Text>
                *
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!termsAccepted || loading) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!termsAccepted || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Create Account</Text>
                {/* You can add an arrow icon here if you like */}
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <Text style={styles.dividerText}>Already have an account?</Text>
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.secondaryButtonText}>Sign In Instead</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Terms Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms and Conditions</Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalSectionTitle}>
                1. Acceptance of Terms
              </Text>
              <Text style={styles.modalText}>
                By accessing or using Tool-Index, you agree to be bound by these
                Terms and Conditions. If you do not agree, please do not use our
                service.
              </Text>
              <Text style={styles.modalSectionTitle}>2. User Accounts</Text>
              <Text style={styles.modalText}>
                You are responsible for maintaining the confidentiality of your
                account and password. You agree to accept responsibility for all
                activities that occur under your account.
              </Text>
              <Text style={styles.modalSectionTitle}>3. Privacy</Text>
              <Text style={styles.modalText}>
                Your use of Tool-Index is also governed by our Privacy Policy,
                which explains how we collect, use, and protect your personal
                information.
              </Text>
              <Text style={styles.modalSectionTitle}>4. Acceptable Use</Text>
              <Text style={styles.modalText}>
                You agree not to use Tool-Index for any unlawful purpose or in
                any way that could damage, disable, or impair the service.
              </Text>
              <Text style={styles.modalSectionTitle}>5. Termination</Text>
              <Text style={styles.modalText}>
                We reserve the right to terminate or suspend your account at any
                time for violations of these terms.
              </Text>
              <Text style={[styles.modalText, { marginTop: 8 }]}>
                Last updated: March 2026
              </Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setShowTermsModal(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Account Type Picker Modal */}
      <Modal
        visible={showAccountTypeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAccountTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentSmall}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Account Type</Text>
              <TouchableOpacity onPress={() => setShowAccountTypeModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            {accountTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={styles.accountTypeOption}
                onPress={() => {
                  handleChange("accountType", type.value);
                  setShowAccountTypeModal(false);
                }}
              >
                <Text style={styles.accountTypeText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3b82f6",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 32,
  },
  errorAlert: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorAlertText: {
    color: "#ef4444",
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  infoMessage: {
    color: "#3b82f6",
    fontSize: 12,
    marginTop: 4,
  },
  pickerInput: {
    justifyContent: "center",
  },
  pickerText: {
    fontSize: 16,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  termsGroup: {
    marginVertical: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  termsLink: {
    color: "#3b82f6",
    textDecorationLine: "underline",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
  },
  divider: {
    marginVertical: 20,
    alignItems: "center",
  },
  dividerText: {
    color: "#6b7280",
    fontSize: 14,
  },
  successCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginTop: 60,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successIconText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  successText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
  },
  modalContentSmall: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  modalClose: {
    fontSize: 20,
    color: "#6b7280",
  },
  modalBody: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 12,
    marginBottom: 4,
  },
  modalText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  modalFooter: {
    marginTop: 8,
  },
  accountTypeOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  accountTypeText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
  },
});
