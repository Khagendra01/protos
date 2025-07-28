# Custom Emoji & GIF Chat App

A React Native Expo app that allows users to create custom emojis and send GIFs, similar to Slack and Discord functionality.

## Features

### 🎨 Custom Emoji Creation
- Upload images from your device's photo library
- Automatically crop images to square format for emoji consistency
- Store custom emojis locally on the device
- Persistent storage - emojis remain available after app restart

### 🎭 GIF Search & Selection
- Search through a curated collection of GIFs
- Tap to send GIFs in chat
- Real-time search functionality

### 💬 Chat Interface
- Send text messages
- Send custom emojis
- Send GIFs
- Message timestamps
- Modern chat bubble design

## How to Use

### Adding Custom Emojis
1. Tap the 📷 button in the input area
2. Select an image from your photo library
3. Enter a name for your custom emoji
4. The emoji will be saved and available in your custom emoji picker

### Using Custom Emojis
1. Tap the 😊 button to open the emoji picker
2. Browse through your custom emojis
3. Tap any emoji to send it in the chat

### Searching and Sending GIFs
1. Tap the "GIF" button to open the GIF search
2. Type your search query
3. Browse through the results
4. Tap any GIF to send it in the chat

## Technical Implementation

### Local Storage
- Custom emojis are stored in the device's document directory
- Each emoji has a JSON metadata file and an image file
- Images are copied to local storage for offline access

### File Structure
```
CustomEmojiApp/
├── App.tsx                 # Main app component
├── components/
│   ├── EmojiPicker.tsx    # Custom emoji picker component
│   └── GifSearch.tsx      # GIF search component
└── README.md
```

### Dependencies
- `expo-image-picker`: For selecting images from photo library
- `expo-file-system`: For local file storage
- `expo-media-library`: For accessing device photos
- `emoji-mart`: For emoji picker functionality (ready for integration)
- `react-native-gif-search`: For GIF search functionality (ready for integration)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your device:
   - Use Expo Go app to scan the QR code
   - Or run `npm run android` / `npm run ios`

## Future Enhancements

### Real GIF API Integration
To integrate with a real GIF API (like Giphy):

1. Sign up for a Giphy API key
2. Replace the sample GIFs in `GifSearch.tsx` with actual API calls
3. Add proper error handling and loading states

### Enhanced Emoji Picker
To use the full emoji-mart functionality:

1. Import and integrate the emoji-mart components
2. Add standard emoji categories alongside custom emojis
3. Implement emoji search functionality

### Additional Features
- Emoji categories and organization
- GIF favorites and recent searches
- Emoji reactions on messages
- Share custom emojis with other users
- Cloud storage for emojis and GIFs

## Permissions

The app requires the following permissions:
- **Photo Library Access**: To select images for custom emojis
- **Camera Access**: For taking photos directly in the app (future feature)

## Troubleshooting

### Custom Emojis Not Loading
- Check if the app has photo library permissions
- Restart the app to reload custom emojis
- Clear app data if emojis are corrupted

### GIFs Not Loading
- Check your internet connection
- The current implementation uses sample GIFs - integrate a real API for production use

## Contributing

Feel free to contribute to this project by:
- Adding new features
- Improving the UI/UX
- Fixing bugs
- Adding tests

## License

This project is open source and available under the MIT License. 