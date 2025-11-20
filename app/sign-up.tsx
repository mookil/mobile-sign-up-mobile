import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";
import { auth, db } from "../lib/firebase";

interface SignUpFormValues {
  fullName: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "Name can not be less than 3 characters")
    .max(40, "Name can not exceed 40 characters")
    .required("Full name is required"),
  userName: Yup.string()
    .min(3, "user name can't be less than 3 characters")
    .max(20, "User Name can't be more 20 characters"),
  email: Yup.string().email("Invalid Email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must me a number between 0-10")
    .required("Phone number is required"),
  password: Yup.string().min(6).required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password must match")
    .required("Confirm password Field is required"),
});

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const handleSignUp = async (values: SignUpFormValues) => {
    try {
      setIsLoading(true);
      setFirebaseError(null);

      // Create user account
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Redirect immediately after successful user creation
      router.replace("/dashboard");

      // Try to save additional user data (optional, don't block redirect)
      try {
        await setDoc(doc(db, "users", userCredentials.user.uid), {
          fullName: values.fullName,
          userName: values.userName,
          email: values.email,
          phone: values.phone,
          createdAt: new Date().toISOString(),
        });
      } catch (firestoreError) {
        console.log(
          "Firestore save failed, but user was created successfully:",
          firestoreError
        );
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      setFirebaseError(error.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik<SignUpFormValues>
        initialValues={{
          fullName: "",
          userName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={SignUpSchema}
        onSubmit={handleSignUp}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              onChangeText={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
              value={values.fullName}
            />
            {touched.fullName && errors.fullName && (
              <Text style={styles.error}>{errors.fullName}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Enter User Name"
              onChangeText={handleChange("userName")}
              onBlur={handleBlur("userName")}
              value={values.userName}
            />
            {touched.userName && errors.userName && (
              <Text style={styles.error}>{errors.userName}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              onChangeText={handleChange("phone")}
              onBlur={handleBlur("phone")}
              value={values.phone}
            />
            {touched.phone && errors.phone && (
              <Text style={styles.error}>{errors.phone}</Text>
            )}

            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Enter your password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Cofirm your password"
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            {firebaseError && <Text style={styles.error}>{firebaseError}</Text>}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={() => handleSubmit()}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.link}> Back to Main Page</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  error: {
    color: "#dc2626",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  link: {
    color: "#2563eb",
    textAlign: "center",
    marginTop: 20,
  },
});
