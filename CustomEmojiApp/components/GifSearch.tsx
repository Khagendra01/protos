import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet } from 'react-native';

interface GifSearchProps {
  onGifSelect: (gifUrl: string) => void;
  onClose: () => void;
  customGifs?: string[];
}

export default function GifSearch({ onGifSelect, onClose, customGifs = [] }: GifSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Sample GIF URLs for demonstration
  const sampleGifs = [
    'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
    'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif',
    'https://media.giphy.com/media/3o7TKDEq4wZrIsm0jK/giphy.gif',
    'https://media.giphy.com/media/3o7TKDEq4wZrIsm0jK/giphy.gif',
    'https://media.giphy.com/media/3o7TKDEq4wZrIsm0jK/giphy.gif',
    'https://media.giphy.com/media/3o7TKDEq4wZrIsm0jK/giphy.gif',
    'https://media.giphy.com/media/3o7TKDEq4wZrIsm0jK/giphy.gif',
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Combine sample GIFs and custom GIFs for search
    const allGifs = [...sampleGifs, ...customGifs];
    const filteredGifs = allGifs.filter(gif => 
      gif.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredGifs);
  };

  const handleGifSelect = (gifUrl: string) => {
    onGifSelect(gifUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GIF Search</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search GIFs..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      <ScrollView style={styles.results}>
        {searchResults.length > 0 ? (
          searchResults.map((gif, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gifItem}
              onPress={() => handleGifSelect(gif)}
            >
              <Image source={{ uri: gif }} style={styles.gifImage} />
            </TouchableOpacity>
          ))
        ) : searchQuery ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No GIFs found</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Search for GIFs above</Text>
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
    maxHeight: 300,
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
    margin: 12,
  },
  results: {
    padding: 12,
  },
  gifItem: {
    marginBottom: 8,
  },
  gifImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 