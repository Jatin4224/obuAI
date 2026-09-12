import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignInSheet } from "@/components/auth/SignInSheet";

const { width: W, height: H } = Dimensions.get("window");

// ─── Welcome Screen ───────────────────────────────────────────────────────────
export default function WelcomeScreen() {
  const [showSheet, setShowSheet] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={s.root} edges={["top", "bottom"]}>
      <View style={s.heroWrap}>
        <Image
          source={require("@/assets/images/welcome-screen-demo-image.png")}
          style={s.hero}
          contentFit="contain"
        />
      </View>

      <View style={s.content}>
        <View style={s.logoRow}>
          <Image source={require("@/assets/images/logo-black.png")} style={s.logoIcon} contentFit="contain" />
          <Text style={s.logoText}>obuAI</Text>
        </View>
        <Text style={s.headline}>Calorie tracking{"\n"}made easy</Text>
        <Text style={s.subtitle}>
          AI that sees your food, understands your goals,{"\n"}and helps you grow.
        </Text>
      </View>

      <View style={s.bottom}>
        <TouchableOpacity
          style={s.btnPrimary}
          onPress={() => router.push("/(onboarding)/step-welcome")}
          activeOpacity={0.85}
        >
          <Text style={s.btnPrimaryLabel}>Get Started  →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnSecondary} onPress={() => setShowSheet(true)} activeOpacity={0.85}>
          <Text style={s.btnSecondaryLabel}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <SignInSheet visible={showSheet} onClose={() => setShowSheet(false)} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 24, justifyContent: "space-between" },
  heroWrap: { alignItems: "center", paddingTop: 8 },
  hero: { width: W * 0.82, height: H * 0.50 },
  content: { alignItems: "center" },
  logoRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 },
  logoIcon: { width: 20, height: 20 },
  logoText: { fontSize: 14, fontWeight: "600", color: "#1A1A2E" },
  headline: { fontSize: 29, fontWeight: "800", color: "#111111", textAlign: "center", lineHeight: 34, letterSpacing: -0.6, marginBottom: 10 },
  subtitle: { fontSize: 13, color: "#777777", textAlign: "center", lineHeight: 18 },
  bottom: { gap: 12, paddingBottom: 6 },
  btnPrimary: { height: 56, backgroundColor: "#000000", borderRadius: 100, alignItems: "center", justifyContent: "center" },
  btnPrimaryLabel: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  btnSecondary: { height: 56, backgroundColor: "#FFFFFF", borderRadius: 100, borderWidth: 1.5, borderColor: "#EBEBEB", alignItems: "center", justifyContent: "center" },
  btnSecondaryLabel: { color: "#1A1A2E", fontSize: 15, fontWeight: "600" },
});
