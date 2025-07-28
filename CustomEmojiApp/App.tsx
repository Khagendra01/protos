import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import EmojiPicker from './components/EmojiPicker';
import GifSearch from './components/GifSearch';

interface Message {
  id: string;
  text: string;
  type: 'text' | 'emoji' | 'gif';
  emojiData?: string;
  gifUrl?: string;
  timestamp: Date;
}

interface CustomEmoji {
  id: string;
  name: string;
  uri: string;
  localPath: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [customEmojis, setCustomEmojis] = useState<CustomEmoji[]>([]);
  const [customGifs, setCustomGifs] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifSearch, setShowGifSearch] = useState(false);
  const [gifSearchResults, setGifSearchResults] = useState<string[]>([]);
  const [gifSearchQuery, setGifSearchQuery] = useState('');

  // Sample GIF URLs for demonstration
  const sampleGifs = [
    'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
    'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif',
    'https://media.giphy.com/media/3o7TKDEq4wZrIsm0jK/giphy.gif',
    'https://media.giphy.com/media/3o7TKDEq4wZrIsm0jK/giphy.gif',
  ];

  useEffect(() => {
    loadCustomEmojis();
    loadCustomGifs();
  }, []);

  const loadCustomEmojis = async () => {
    try {
      const emojiDir = `${FileSystem.documentDirectory}custom_emojis/`;
      const dirInfo = await FileSystem.getInfoAsync(emojiDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(emojiDir, { intermediates: true });
      }
      
      const files = await FileSystem.readDirectoryAsync(emojiDir);
      const loadedEmojis: CustomEmoji[] = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const emojiData = await FileSystem.readAsStringAsync(`${emojiDir}${file}`);
          const emoji = JSON.parse(emojiData);
          loadedEmojis.push(emoji);
        }
      }
      
      setCustomEmojis(loadedEmojis);
    } catch (error) {
      console.error('Error loading custom emojis:', error);
    }
  };

  const loadCustomGifs = async () => {
    try {
      const gifDir = `${FileSystem.documentDirectory}custom_gifs/`;
      const dirInfo = await FileSystem.getInfoAsync(gifDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });
      }
      
      const files = await FileSystem.readDirectoryAsync(gifDir);
      const loadedGifs: string[] = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const gifData = await FileSystem.readAsStringAsync(`${gifDir}${file}`);
          const gif = JSON.parse(gifData);
          if (gif.localPath) {
            loadedGifs.push(`file://${gif.localPath}`);
          }
        }
      }
      
      setCustomGifs(loadedGifs);
    } catch (error) {
      console.error('Error loading custom GIFs:', error);
    }
  };

  const saveCustomEmoji = async (name: string, uri: string) => {
    try {
      const emojiDir = `${FileSystem.documentDirectory}custom_emojis/`;
      const fileName = `${name}.json`;
      const imageFileName = `${name}.png`;
      const localPath = `${emojiDir}${imageFileName}`;
      
      // Copy image to local storage
      await FileSystem.copyAsync({
        from: uri,
        to: localPath,
      });
      
      const emoji: CustomEmoji = {
        id: Date.now().toString(),
        name,
        uri,
        localPath,
      };
      
      // Save emoji metadata
      await FileSystem.writeAsStringAsync(
        `${emojiDir}${fileName}`,
        JSON.stringify(emoji)
      );
      
      setCustomEmojis(prev => [...prev, emoji]);
      Alert.alert('Success', 'Custom emoji saved!');
    } catch (error) {
      console.error('Error saving custom emoji:', error);
      Alert.alert('Error', 'Failed to save custom emoji');
    }
  };

  const saveCustomGif = async (uri: string) => {
    try {
      const gifDir = `${FileSystem.documentDirectory}custom_gifs/`;
      const dirInfo = await FileSystem.getInfoAsync(gifDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });
      }
      
      // Generate a unique name for the GIF
      const gifName = `custom_gif_${Date.now()}`;
      const gifFileName = `${gifName}.gif`;
      const localPath = `${gifDir}${gifFileName}`;
      
      // Copy GIF to local storage
      await FileSystem.copyAsync({
        from: uri,
        to: localPath,
      });
      
      // Save GIF metadata
      const gifData = {
        id: Date.now().toString(),
        name: gifName,
        uri,
        localPath,
        type: 'custom_gif'
      };
      
      await FileSystem.writeAsStringAsync(
        `${gifDir}${gifName}.json`,
        JSON.stringify(gifData)
      );
      
      // Refresh custom GIFs list
      await loadCustomGifs();
      
      Alert.alert('Success', 'Custom GIF saved! You can now send it in chat.');
    } catch (error) {
      console.error('Error saving custom GIF:', error);
      Alert.alert('Error', 'Failed to save custom GIF');
    }
  };

  const [showNameInput, setShowNameInput] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [emojiNameInput, setEmojiNameInput] = useState('');

  const pickImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setShowNameInput(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickGif = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1.0,
      });

      if (!result.canceled && result.assets[0]) {
        // Check if the selected file is a GIF
        const fileName = result.assets[0].uri.toLowerCase();
        if (fileName.endsWith('.gif')) {
          // Save GIF to local storage
          await saveCustomGif(result.assets[0].uri);
        } else {
          Alert.alert('Invalid File', 'Please select a GIF file');
        }
      }
    } catch (error) {
      console.error('Error picking GIF:', error);
      Alert.alert('Error', 'Failed to pick GIF');
    }
  };

  const handleSaveEmoji = async () => {
    if (emojiNameInput.trim() && selectedImageUri) {
      await saveCustomEmoji(emojiNameInput.trim(), selectedImageUri);
      setShowNameInput(false);
      setSelectedImageUri(null);
      setEmojiNameInput('');
    }
  };

  const handleCancelEmoji = () => {
    setShowNameInput(false);
    setSelectedImageUri(null);
    setEmojiNameInput('');
  };

  const searchGifs = async (query: string) => {
    if (!query.trim()) {
      setGifSearchResults([]);
      return;
    }
    
    // Simulate GIF search - in a real app, you'd use a GIF API
    const filteredGifs = sampleGifs.filter(gif => 
      gif.toLowerCase().includes(query.toLowerCase())
    );
    setGifSearchResults(filteredGifs);
  };

  const sendMessage = (text: string, type: 'text' | 'emoji' | 'gif', emojiData?: string, gifUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      emojiData,
      gifUrl,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const handleSendText = () => {
    if (inputText.trim()) {
      sendMessage(inputText, 'text');
    }
  };

  const handleSendEmoji = (emoji: CustomEmoji) => {
    // Insert emoji inline with current text
    const emojiPlaceholder = `:${emoji.name}:`;
    setInputText(prev => prev + emojiPlaceholder);
    setShowEmojiPicker(false);
  };

  const handleSendGif = (gifUrl: string) => {
    sendMessage('GIF', 'gif', undefined, gifUrl);
    setShowGifSearch(false);
    setGifSearchQuery('');
  };

  const renderMessage = (message: Message) => {
    const renderInlineContent = (text: string) => {
      // Split text by emoji placeholders (:emoji_name:)
      const parts = text.split(/(:\w+:)/g);
      
      return (
        <View style={styles.inlineContent}>
          {parts.map((part, index) => {
            if (part.startsWith(':') && part.endsWith(':')) {
              // This is an emoji placeholder
              const emojiName = part.slice(1, -1);
              const emoji = customEmojis.find(e => e.name === emojiName);
              
              if (emoji) {
                return (
                  <Image 
                    key={index}
                    source={{ uri: `file://${emoji.localPath}` }} 
                    style={styles.inlineEmoji} 
                  />
                );
              }
            }
            // Return text for non-emoji parts or unfound emojis
            return (
              <Text key={index} style={styles.messageText}>
                {part}
              </Text>
            );
          })}
        </View>
      );
    };

    return (
      <View key={message.id} style={styles.messageContainer}>
        <View style={styles.messageBubble}>
          {message.type === 'text' && (
            renderInlineContent(message.text)
          )}
          {message.type === 'gif' && message.gifUrl && (
            <Image source={{ uri: message.gifUrl }} style={styles.gifImage} />
          )}
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Custom Emoji & GIF Chat</Text>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer}>
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPicker
          customEmojis={customEmojis}
          onEmojiSelect={handleSendEmoji}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* GIF Search */}
      {showGifSearch && (
        <GifSearch
          onGifSelect={handleSendGif}
          onClose={() => setShowGifSearch(false)}
          customGifs={customGifs}
        />
      )}

      {/* Emoji Name Input Modal */}
      {showNameInput && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Emoji Name</Text>
            <TextInput
              style={styles.modalInput}
              value={emojiNameInput}
              onChangeText={setEmojiNameInput}
              placeholder="Enter emoji name..."
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelEmoji}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEmoji}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Text style={styles.actionButtonText}>😊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowGifSearch(!showGifSearch)}
          >
            <Text style={styles.actionButtonText}>GIF</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={pickImage}
          >
            <Text style={styles.actionButtonText}>📷</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={pickGif}
          >
            <Text style={styles.actionButtonText}>🎬</Text>
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            multiline
          />
          
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendText}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 18,
    maxWidth: '80%',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  emojiImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  inlineEmoji: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  inlineContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  gifImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },

  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
