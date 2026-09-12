# Expo v56 — Critical Notes

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any Expo code.

## Key v56 changes
- `expo-router` v56: file-based routing lives in `src/app/`. Groups use `(name)/` folders.
- `@expo/ui` v56: new native UI primitives — `NativeTabs`, `Switch`, `Picker` etc.
- `NativeTabs` from `expo-router/unstable-native-tabs` replaces the old tab navigator pattern.
- `expo-camera` v56: use `CameraView` (not the legacy `Camera` component).
- `expo-image-picker` v56: `launchCameraAsync` and `launchImageLibraryAsync` return `ImagePickerResult`.
- `expo-notifications` v56: requires explicit permission request before scheduling.
- React Native 0.85 + React 19: concurrent features enabled by default.
- `react-native-reanimated` 4.x: worklets API changed — check docs before using `useSharedValue`, `withSpring`, etc.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
