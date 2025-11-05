import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";

const Dashboard = () => {
  // Authentication state comes here

  const handleLogOut = () => {
    console.log("You are logged out");
    // log out code comes here
  };

  // Loading and redirect code comes here
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}> Welcome </Text>
      <Text style={styles.userEmail}>User comes here</Text>
      <TouchableOpacity
        style={styles.logOutButton}
        onPress={() => {
          console.log("Logged Out");
        }}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1f2938",
  },
  userEmail: {
    fontSize: 18,
    color: "#4b5563",
    marginBottom: 30,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  logOutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
