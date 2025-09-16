# AlwaysON React Native App

This is the **React Native version** with **real iOS eSIM APIs** for production use on iPhones.

## Real eSIM Features

- **CoreTelephony Integration**: Real carrier detection and switching
- **Network Framework**: Actual connection monitoring  
- **Native eSIM Management**: Real eSIM installation/removal
- **iOS Settings Integration**: Native iPhone settings support
- **Emergency Backup**: True network switching during failures

## Setup for iPhone Testing

### Option 1: GitHub Codespaces + Expo Go (Recommended)

1. **Upload this project to GitHub**
2. **Create GitHub Codespace**
3. **Run in codespace:**
   ```bash
   cd react-native
   npm install
   npx expo start --tunnel
   ```
4. **Scan QR with iPhone** (using Expo Go app)

### Option 2: Local Development (Requires Mac + Xcode)

```bash
npm install
npx expo run:ios
```

## Real vs Simulated Features

| Feature | Web App | React Native |
|---------|---------|--------------|
| eSIM Installation | ✅ Simulated | ✅ **Real iOS APIs** |
| Carrier Detection | ✅ Mock | ✅ **CoreTelephony** |
| Network Monitoring | ✅ Demo | ✅ **Network Framework** |
| Emergency Backup | ✅ UI only | ✅ **Real switching** |

## iOS Native Modules

- **AlwaysONModule.swift**: Real eSIM management
- **AlwaysONNative.ts**: TypeScript bridge to Swift
- **Production-ready** iOS integration

## Testing Real eSIM

The React Native app will give you the **authentic iOS eSIM experience** with:
- Real eSIM profile downloads
- Actual carrier switching
- Native iOS installation prompts
- True emergency backup activation

Perfect for **production testing** and **user validation** on actual iPhone devices!