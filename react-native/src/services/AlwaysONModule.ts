import { NativeModulesProxy } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to AlwaysONModule.web.ts
// and on native platforms to AlwaysONModule.ts
import AlwaysONModule from './AlwaysONModule';

export default AlwaysONModule;