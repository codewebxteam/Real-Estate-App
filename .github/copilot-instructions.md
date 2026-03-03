# Real Estate App Development

This is the setup guide for the Real Estate Mobile Application built with React Native and Expo.

## Project Setup Checklist

### ✅ Project Structure Created
- Expo project initialized
- NativeWind Tailwind CSS configured
- Firebase configuration files set up
- React Navigation integrated
- Reanimated animations library ready

### ✅ Key Features Implemented
- Home screen with featured properties
- Property detail screen with animations
- User profile screen
- Tab-based navigation
- Animated components (cards, buttons, fade-in views)

### 📋 Configuration Steps Remaining

1. **Firebase Setup**
   - Visit https://console.firebase.google.com
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Create Storage bucket
   - Copy credentials to `.env` file

2. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Firebase credentials

3. **Install Dependencies**
   ```bash
   npm install
   ```
   OR
   ```bash
   yarn install
   ```

4. **Run the App Locally**
   ```bash
   npm start
   ```
   Then press:
   - `w` for web
   - `i` for iOS
   - `a` for Android

5. **Run on Physical Device**
   - Install Expo Go app on your phone
   - Scan QR code from terminal
   - Or use `expo publish` to share

## Animations Included

1. **SpringScale Animation** - Properties bounce in with spring animation
2. **FadeIn Animation** - Content fades in with optional delay
3. **PulseEffect** - Button scales with pulse while loading
4. **ImageScale** - Property images scale on detail screen

## File Structure

```
appr/
├── src/
│   ├── components/
│   │   ├── AnimatedCard.tsx       # Property card with animations
│   │   ├── FadeInView.tsx         # Fade-in wrapper component
│   │   └── PulseButton.tsx        # Button with pulse effect
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Property listing screen
│   │   ├── PropertyDetailScreen.tsx # Property details
│   │   └── ProfileScreen.tsx      # User profile
│   ├── navigation/
│   │   └── RootNavigator.tsx      # Navigation configuration
│   ├── firebase/
│   │   └── config.ts              # Firebase setup
│   └── utils/
├── App.tsx                        # Main entry point
├── global.css                     # Tailwind directives
├── app.json                       # Expo configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.js             # Tailwind configuration
├── .babelrc                       # Babel configuration
├── .env.example                   # Environment variables template
└── README.md                      # Project documentation
```

## Getting Started Command

After setup, run:
```bash
npm start
```

This will give you options to run on:
- Web browser (press `w`)
- iOS simulator (press `i`)  
- Android emulator (press `a`)
- Physical device via Expo Go app (Scan QR)

## Important Notes

- Update `.env` with your Firebase credentials before testing
- NativeWind uses Tailwind CSS classes directly in React Native
- All animations use React Native Reanimated v3
- The app is TypeScript-ready for better development experience
