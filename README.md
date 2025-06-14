# CraveHub iOS App

This is the iOS version of the CraveHub food delivery application, built using Ionic Capacitor to convert the React web app into a native iOS application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Xcode** (latest version from Mac App Store)
- **iOS Simulator** or a physical iOS device
- **Apple Developer Account** (for App Store deployment)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Capacitor CLI

```bash
npm install -g @capacitor/cli
```

### 3. Build the Web App

```bash
npm run build
```

### 4. Initialize iOS Platform

```bash
npx cap add ios
```

### 5. Sync Web Assets to iOS

```bash
npx cap sync ios
```

### 6. Open in Xcode

```bash
npx cap open ios
```

## Development Workflow

### Running on iOS Simulator

1. Build the web app:
   ```bash
   npm run build
   ```

2. Sync changes to iOS:
   ```bash
   npx cap sync ios
   ```

3. Open Xcode and run the app:
   ```bash
   npx cap open ios
   ```

### Quick Development Commands

- **Build and sync**: `npm run ios:dev`
- **Build, sync, and open Xcode**: `npm run ios:build`
- **Run on device/simulator**: `npm run ios:run`

## App Store Deployment

### 1. Configure App Information

Update the following files with your app details:

- `capacitor.config.ts`: Update `appId` and `appName`
- `ios/App/App/Info.plist`: Update bundle identifier and app name

### 2. Add App Icons

1. Create app icons in various sizes (20x20 to 1024x1024)
2. Add them to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### 3. Configure Signing

1. Open the project in Xcode
2. Select your development team
3. Configure provisioning profiles
4. Set up code signing

### 4. Build for Release

1. In Xcode, select "Any iOS Device" as the target
2. Choose Product → Archive
3. Follow the App Store submission process

## Native Features

The app includes the following native iOS features:

### Push Notifications
- Remote push notifications for order updates
- Local notifications for delivery reminders
- Background notification handling

### Location Services
- GPS location for accurate delivery
- Location-based restaurant recommendations
- Real-time delivery tracking

### Camera Integration
- Photo capture for profile pictures
- Image selection from photo library
- Camera permissions handling

### Haptic Feedback
- Touch feedback for button interactions
- Enhanced user experience
- Native iOS feel

### Share Functionality
- Native iOS share sheet
- Share products and orders
- Social media integration

### Status Bar & Safe Areas
- Proper status bar styling
- Safe area handling for notched devices
- iOS-specific UI adaptations

## Configuration Files

### `capacitor.config.ts`
Main configuration file for Capacitor settings, plugins, and iOS-specific options.

### `ios/App/App/Info.plist`
iOS app configuration including permissions, background modes, and app metadata.

### `ios/App/App/AppDelegate.swift`
iOS app delegate for handling app lifecycle and push notifications.

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed and Xcode is up to date
2. **Simulator Issues**: Reset iOS Simulator if app doesn't load properly
3. **Permission Errors**: Check Info.plist for required usage descriptions
4. **Network Issues**: Ensure your backend API is accessible from iOS

### Debug Mode

To debug the app:

1. Open Safari on your Mac
2. Go to Develop → [Your Device] → [Your App]
3. Use Safari's Web Inspector to debug

## App Store Guidelines

Ensure your app complies with Apple's App Store guidelines:

- Provide clear app description and screenshots
- Include privacy policy for data collection
- Test on multiple iOS devices and versions
- Follow iOS Human Interface Guidelines
- Implement proper error handling

## Support

For issues related to:
- **Capacitor**: Check [Capacitor Documentation](https://capacitorjs.com/docs)
- **iOS Development**: Refer to [Apple Developer Documentation](https://developer.apple.com/documentation/)
- **App Store Submission**: See [App Store Connect Help](https://help.apple.com/app-store-connect/)

## License

This project is licensed under the MIT License.