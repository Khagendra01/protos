import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';

interface CustomEmoji {
  id: string;
  name: string;
  uri: string;
  localPath: string;
}

interface EmojiPickerProps {
  customEmojis: CustomEmoji[];
  onEmojiSelect: (emoji: CustomEmoji) => void;
  onClose: () => void;
}

export default function EmojiPicker({ customEmojis, onEmojiSelect, onClose }: EmojiPickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Custom Emojis</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal style={styles.emojiList}>
        {customEmojis.map(emoji => (
          <TouchableOpacity
            key={emoji.id}
            style={styles.emojiItem}
            onPress={() => onEmojiSelect(emoji)}
          >
            <Image source={{ uri: `file://${emoji.localPath}` }} style={styles.emojiImage} />
            <Text style={styles.emojiName}>{emoji.name}</Text>
          </TouchableOpacity>
        ))}
        
        {customEmojis.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No custom emojis yet</Text>
            <Text style={styles.emptySubtext}>Tap the camera button to add one!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    maxHeight: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 18,
    color: '#666',
  },
  emojiList: {
    padding: 12,
  },
  emojiItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  emojiImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  emojiName: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#999',
  },
}); 