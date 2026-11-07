
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";

const API_URL = "https://script.google.com/macros/s/AKfycbyF5JihmoxmYeYD2v2lzA4cvPdbkPYCc35QziISCveazCN4ScBMFJ-e0Dl6gifWtoTf5w/exec";

const tools = [
  "Chat",
  "Vision",
  "Voice",
  "Writer",
  "Translate",
  "Study",
  "Summary",
  "Code"
];

export default function App() {
  const [selectedTool, setSelectedTool] = useState("Chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();

    if (!text || loading) return;

    setMessages(prev => [
      ...prev,
      { role: "user", text }
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify({
          message: text
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: data.reply || "No response received."
        }
      ]);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: "Connection error: " + error.message
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Tell Professor</Text>
          <Text style={styles.subtitle}>AI ASSISTANT</Text>
        </View>
        <Text style={styles.online}>● ONLINE</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tools}
      >
        {tools.map(tool => (
          <TouchableOpacity
            key={tool}
            style={[
              styles.tool,
              selectedTool === tool && styles.activeTool
            ]}
            onPress={() => setSelectedTool(tool)}
          >
            <Text style={styles.toolText}>{tool}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.chat}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.length === 0 && (
          <View style={styles.welcome}>
            <Text style={styles.welcomeTitle}>
              Welcome to Tell Professor AI
            </Text>
            <Text style={styles.welcomeText}>
              Your intelligent assistant is ready.
              Ask anything to get started!
            </Text>
          </View>
        )}

        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.message,
              message.role === "user"
                ? styles.userMessage
                : styles.aiMessage
            ]}
          >
            <Text style={styles.messageLabel}>
              {message.role === "user" ? "YOU" : "PROFESSOR AI"}
            </Text>
            <Text style={styles.messageText}>
              {message.text}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator color="#a78bfa" />
            <Text style={styles.loadingText}>
              Professor AI is thinking...
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Ask Professor AI anything..."
          placeholderTextColor="#85859b"
          value={input}
          onChangeText={setInput}
          multiline
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        POWERED BY GEMINI AI
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090b1b",
    paddingTop: 45
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "bold"
  },
  subtitle: {
    color: "#a78bfa",
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 4
  },
  online: {
    color: "#4ade80",
    fontSize: 11
  },
  tools: {
    maxHeight: 55,
    paddingLeft: 12
  },
  tool: {
    backgroundColor: "#171a32",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    height: 42
  },
  activeTool: {
    backgroundColor: "#7046d3"
  },
  toolText: {
    color: "#ffffff",
    fontSize: 12
  },
  chat: {
    flex: 1,
    padding: 15
  },
  welcome: {
    marginTop: 80,
    alignItems: "center"
  },
  welcomeTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center"
  },
  welcomeText: {
    color: "#aaaac0",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22
  },
  message: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    maxWidth: "90%"
  },
  userMessage: {
    backgroundColor: "#49318c",
    alignSelf: "flex-end"
  },
  aiMessage: {
    backgroundColor: "#191d36",
    alignSelf: "flex-start"
  },
  messageLabel: {
    color: "#b9a5ff",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 7
  },
  messageText: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 22
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12
  },
  loadingText: {
    color: "#aaaac0"
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171a32",
    margin: 12,
    padding: 8,
    borderRadius: 18
  },
  input: {
    flex: 1,
    color: "#ffffff",
    padding: 12,
    maxHeight: 100
  },
  sendButton: {
    backgroundColor: "#7046d3",
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  sendText: {
    color: "#ffffff",
    fontSize: 22
  },
  footer: {
    color: "#65657d",
    textAlign: "center",
    fontSize: 9,
    paddingBottom: 10,
    letterSpacing: 2
  }
});
