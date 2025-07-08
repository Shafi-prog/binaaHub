// @ts-nocheck
// Mobile App Entry Point (Phase 4)
// This is a placeholder for the React Native/Expo app
import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';

const App = () => {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Binna Mobile Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />
        <Button title="Login" onPress={() => setLoggedIn(true)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username || 'User'}!</Text>
      <Text style={{ marginTop: 16 }}>This is your mobile dashboard. (Demo)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, width: 220, marginBottom: 16, backgroundColor: '#fff' },
});

export default App;


