import { useSSO, useSignIn, useSignInWithApple, useSignUp } from "@clerk/clerk-expo";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type SheetView = "social" | "signin-email" | "signup" | "verify";

function sheetTitle(v: SheetView) {
  if (v === "signup") return "Create Account";
  if (v === "verify") return "Verify Email";
  return "Sign In";
}

function backTarget(v: SheetView): SheetView | null {
  if (v === "signin-email") return "social";
  if (v === "signup") return "social";
  if (v === "verify") return "signup";
  return null;
}

// ─── Multicolour Google G ─────────────────────────────────────────────────────
export function GoogleG({ size = 22 }: { size?: number }) {
  const inner = size * 0.6;
  const off = (size - inner) / 2;
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: "hidden" }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, backgroundColor: "#4285F4" }} />
          <View style={{ flex: 1, backgroundColor: "#EA4335" }} />
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, backgroundColor: "#34A853" }} />
          <View style={{ flex: 1, backgroundColor: "#FBBC05" }} />
        </View>
      </View>
      <View style={{ position: "absolute", width: inner, height: inner, borderRadius: inner / 2, backgroundColor: "#fff", top: off, left: off, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: size * 0.44, fontWeight: "900", color: "#4285F4", lineHeight: size * 0.5 }}>G</Text>
      </View>
    </View>
  );
}

// ─── Sign-In / Sign-Up Sheet ──────────────────────────────────────────────────
export function SignInSheet({
  visible,
  onClose,
  initialView = "social",
}: {
  visible: boolean;
  onClose: () => void;
  initialView?: SheetView;
}) {
  const insets = useSafeAreaInsets();

  // ── Sheet view state ──
  const [view, setView] = useState<SheetView>(initialView);

  // ── Shared form state ──
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Clerk hooks ──
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();
  const { startAppleAuthenticationFlow } = useSignInWithApple();

  // ── Animations ──
  const slideY = useRef(new Animated.Value(800)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(1)).current;

  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: 800, duration: 280, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start(() => closeRef.current());
  }, [slideY, backdropAnim]);

  const closeRef2 = useRef(close);
  useEffect(() => { closeRef2.current = close; }, [close]);

  useEffect(() => {
    if (visible) {
      setView(initialView);
      setEmail(""); setPassword(""); setCode("");
      contentFade.setValue(1);
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 70, friction: 12 }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const switchTo = useCallback((next: SheetView) => {
    Animated.timing(contentFade, { toValue: 0, duration: 110, useNativeDriver: true }).start(() => {
      setView(next);
      if (next === "verify") setCode("");
      Animated.timing(contentFade, { toValue: 1, duration: 140, useNativeDriver: true }).start();
    });
  }, [contentFade]);

  // ── Swipe to dismiss ──
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 6 && Math.abs(gs.dy) > Math.abs(gs.dx),
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          slideY.setValue(gs.dy);
          backdropAnim.setValue(Math.max(0, 1 - gs.dy / 280));
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 80 || gs.vy > 1.2) {
          closeRef2.current();
        } else {
          Animated.parallel([
            Animated.spring(slideY, { toValue: 0, useNativeDriver: true }),
            Animated.timing(backdropAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  // ── Auth handlers ──
  const handleApple = async () => {
    if (Platform.OS !== "ios") {
      Alert.alert("Not available", "Apple sign-in is only available on iOS.");
      return;
    }
    try {
      const { createdSessionId, setActive } = await startAppleAuthenticationFlow();
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch (err: any) {
      if (err?.code !== "ERR_CANCELED")
        Alert.alert("Error", err.errors?.[0]?.longMessage ?? "Apple sign-in failed.");
    }
  };

  const handleGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google" });
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.longMessage ?? "Google sign-in failed.");
    }
  };

  const handleEmailSignIn = async () => {
    if (!signInLoaded || !email || !password) return;
    try {
      setLoading(true);
      const result = await signIn?.create({ identifier: email, password });
      if (result?.status === "complete") await setActiveSignIn?.({ session: result.createdSessionId });
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.longMessage ?? "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUpLoaded || !email || password.length < 8) return;
    try {
      setLoading(true);
      await signUp?.create({ emailAddress: email, password });
      // This sends the OTP email
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      switchTo("verify");
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.longMessage ?? "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!signUpLoaded || code.length < 6) return;
    try {
      setLoading(true);
      const result = await signUp?.attemptEmailAddressVerification({ code });
      if (result?.status === "complete") {
        await setActiveSignUp?.({ session: result.createdSessionId! });
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.longMessage ?? "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUpLoaded) return;
    try {
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Sent", "A new code has been sent to your email.");
    } catch {
      Alert.alert("Error", "Failed to resend code. Please try again.");
    }
  };

  const back = backTarget(view);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={close}>
      {/* Backdrop */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.45)", opacity: backdropAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      {/* Sheet */}
      <KeyboardAvoidingView style={s.sheetOuter} behavior={Platform.OS === "ios" ? "padding" : "height"} pointerEvents="box-none">
        <Animated.View style={[s.sheet, { paddingBottom: insets.bottom + 20 }, { transform: [{ translateY: slideY }] }]}>

          {/* Drag handle + header */}
          <View {...pan.panHandlers}>
            <View style={s.handleRow}><View style={s.handle} /></View>
            <View style={s.header}>
              {back !== null && (
                <TouchableOpacity onPress={() => switchTo(back)} style={s.backBtn} activeOpacity={0.7}>
                  <Text style={s.backIcon}>‹</Text>
                </TouchableOpacity>
              )}
              <Text style={s.headerTitle}>{sheetTitle(view)}</Text>
              <TouchableOpacity onPress={close} style={s.closeBtn} activeOpacity={0.7}>
                <Text style={s.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Fading content area */}
          <Animated.View style={{ opacity: contentFade }}>
            {view === "social" && (
              <SocialView
                onApple={handleApple}
                onGoogle={handleGoogle}
                onEmail={() => switchTo("signin-email")}
              />
            )}
            {view === "signin-email" && (
              <SignInEmailView
                email={email} password={password}
                loading={loading}
                onEmailChange={setEmail} onPasswordChange={setPassword}
                onSignIn={handleEmailSignIn}
                onCreateAccount={() => switchTo("signup")}
              />
            )}
            {view === "signup" && (
              <SignUpView
                email={email} password={password}
                loading={loading}
                onEmailChange={setEmail} onPasswordChange={setPassword}
                onSignUp={handleSignUp}
                onSignIn={() => switchTo("signin-email")}
              />
            )}
            {view === "verify" && (
              <VerifyView
                email={email} code={code}
                loading={loading}
                onCodeChange={setCode}
                onVerify={handleVerify}
                onResend={handleResendCode}
              />
            )}
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Social options ───────────────────────────────────────────────────────────
function SocialView({ onApple, onGoogle, onEmail }: {
  onApple: () => void; onGoogle: () => void;
  onEmail: () => void;
}) {
  return (
    <View style={s.body}>
      <TouchableOpacity style={s.btnApple} onPress={onApple} activeOpacity={0.88}>
        <Text style={s.appleIcon}></Text>
        <Text style={s.btnAppleLabel}>Sign in with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.btnOutline} onPress={onGoogle} activeOpacity={0.88}>
        <GoogleG size={22} />
        <Text style={s.btnOutlineLabel}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.btnOutline} onPress={onEmail} activeOpacity={0.88}>
        <Text style={s.emailGlyph}>✉</Text>
        <Text style={s.btnOutlineLabel}>Continue with email</Text>
      </TouchableOpacity>

      <Text style={s.privacy}>
        By continuing you agree to our{" "}
        <Text style={s.privacyLink}>Terms</Text> and{" "}
        <Text style={s.privacyLink}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}

// ─── Email sign-in form ───────────────────────────────────────────────────────
function SignInEmailView({ email, password, loading, onEmailChange, onPasswordChange, onSignIn, onCreateAccount }: {
  email: string; password: string; loading: boolean;
  onEmailChange: (v: string) => void; onPasswordChange: (v: string) => void;
  onSignIn: () => void; onCreateAccount: () => void;
}) {
  const canSubmit = email.length > 0 && password.length > 0;
  return (
    <View style={s.body}>
      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Email</Text>
        <TextInput style={s.input} placeholder="you@example.com" placeholderTextColor="#9B9B9B"
          value={email} onChangeText={onEmailChange} keyboardType="email-address"
          autoCapitalize="none" autoCorrect={false} autoFocus />
      </View>

      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Password</Text>
        <TextInput style={s.input} placeholder="Your password" placeholderTextColor="#9B9B9B"
          value={password} onChangeText={onPasswordChange} secureTextEntry />
      </View>

      <TouchableOpacity style={[s.btnSignIn, !canSubmit && { opacity: 0.45 }]}
        onPress={onSignIn} disabled={loading || !canSubmit} activeOpacity={0.85}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnSignInLabel}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{ alignItems: "center" }} activeOpacity={0.7}>
        <Text style={s.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={s.switchRow}>
        <Text style={s.switchText}>Don't have an account? </Text>
        <TouchableOpacity onPress={onCreateAccount} activeOpacity={0.7}>
          <Text style={s.switchLink}>Create one</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Sign-up form ─────────────────────────────────────────────────────────────
function SignUpView({ email, password, loading, onEmailChange, onPasswordChange, onSignUp, onSignIn }: {
  email: string; password: string; loading: boolean;
  onEmailChange: (v: string) => void; onPasswordChange: (v: string) => void;
  onSignUp: () => void; onSignIn: () => void;
}) {
  const canSubmit = email.length > 0 && password.length >= 8;
  return (
    <View style={s.body}>
      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Email</Text>
        <TextInput style={s.input} placeholder="you@example.com" placeholderTextColor="#9B9B9B"
          value={email} onChangeText={onEmailChange} keyboardType="email-address"
          autoCapitalize="none" autoCorrect={false} autoFocus />
      </View>

      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Password</Text>
        <TextInput style={s.input} placeholder="Min. 8 characters" placeholderTextColor="#9B9B9B"
          value={password} onChangeText={onPasswordChange} secureTextEntry />
      </View>

      <TouchableOpacity style={[s.btnSignIn, !canSubmit && { opacity: 0.45 }]}
        onPress={onSignUp} disabled={loading || !canSubmit} activeOpacity={0.85}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnSignInLabel}>Create Account</Text>}
      </TouchableOpacity>

      <Text style={s.termsNote}>
        By creating an account you agree to our{" "}
        <Text style={s.privacyLink}>Terms of Service</Text>
        {" "}and{" "}
        <Text style={s.privacyLink}>Privacy Policy</Text>.
      </Text>

      <View style={s.switchRow}>
        <Text style={s.switchText}>Already have an account? </Text>
        <TouchableOpacity onPress={onSignIn} activeOpacity={0.7}>
          <Text style={s.switchLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── OTP verification ─────────────────────────────────────────────────────────
function VerifyView({ email, code, loading, onCodeChange, onVerify, onResend }: {
  email: string; code: string; loading: boolean;
  onCodeChange: (v: string) => void; onVerify: () => void; onResend: () => void;
}) {
  const canSubmit = code.length === 6;
  return (
    <View style={s.body}>
      <Text style={s.verifySubtitle}>
        We sent a 6-digit code to{"\n"}
        <Text style={{ fontWeight: "700", color: "#111111" }}>{email}</Text>
      </Text>

      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Verification Code</Text>
        <TextInput
          style={[s.input, s.codeInput]}
          placeholder="000000"
          placeholderTextColor="#9B9B9B"
          value={code}
          onChangeText={onCodeChange}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />
      </View>

      <TouchableOpacity style={[s.btnSignIn, !canSubmit && { opacity: 0.45 }]}
        onPress={onVerify} disabled={loading || !canSubmit} activeOpacity={0.85}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnSignInLabel}>Verify Email</Text>}
      </TouchableOpacity>

      <View style={s.switchRow}>
        <Text style={s.switchText}>Didn't receive a code? </Text>
        <TouchableOpacity onPress={onResend} activeOpacity={0.7}>
          <Text style={s.switchLink}>Resend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Sheet
  sheetOuter: { flex: 1, justifyContent: "flex-end" },
  sheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.10, shadowRadius: 20, elevation: 24 },
  handleRow: { alignItems: "center", paddingTop: 12, paddingBottom: 0 },
  handle: { width: 38, height: 4, backgroundColor: "#DEDEDE", borderRadius: 2 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111111", letterSpacing: -0.3 },
  backBtn: { position: "absolute", left: 16, width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  backIcon: { fontSize: 30, color: "#111111", lineHeight: 34, marginTop: -4 },
  closeBtn: { position: "absolute", right: 16, width: 30, height: 30, borderRadius: 15, backgroundColor: "#EFEFEF", alignItems: "center", justifyContent: "center" },
  closeBtnText: { fontSize: 14, color: "#666666", lineHeight: 16, marginTop: -1 },

  // Body
  body: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8, gap: 14 },

  // Apple
  btnApple: { height: 56, backgroundColor: "#000000", borderRadius: 100, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  appleIcon: { fontSize: 19, color: "#FFFFFF", lineHeight: 23 },
  btnAppleLabel: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },

  // Outlined (Google, Email)
  btnOutline: { height: 56, backgroundColor: "#FFFFFF", borderRadius: 100, borderWidth: 1.5, borderColor: "#E8E8E8", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  btnOutlineLabel: { fontSize: 15, fontWeight: "600", color: "#111111" },
  emailGlyph: { fontSize: 15, color: "#444444" },

  // Inputs
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#111111" },
  input: { height: 52, backgroundColor: "#F8F9FA", borderRadius: 14, borderWidth: 1.5, borderColor: "#EBEBEB", paddingHorizontal: 16, fontSize: 15, color: "#111111" },
  codeInput: { textAlign: "center", fontSize: 22, fontWeight: "700", letterSpacing: 8 },

  // Primary button
  btnSignIn: { height: 56, backgroundColor: "#FF6B35", borderRadius: 100, alignItems: "center", justifyContent: "center" },
  btnSignInLabel: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },

  // Misc
  forgotText: { fontSize: 13, color: "#777777", textAlign: "center" },
  verifySubtitle: { fontSize: 14, color: "#777777", textAlign: "center", lineHeight: 20 },
  termsNote: { fontSize: 11.5, color: "#9B9B9B", textAlign: "center", lineHeight: 17 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  switchText: { fontSize: 13, color: "#777777" },
  switchLink: { fontSize: 13, fontWeight: "700", color: "#111111" },
  privacy: { fontSize: 11.5, color: "#9B9B9B", textAlign: "center", lineHeight: 17 },
  privacyLink: { color: "#111111", fontWeight: "600" },
});
