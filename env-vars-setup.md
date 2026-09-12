Part 0 — Env vars and dashboard setup (step by step, you do this)
Summary: everything the app needs
Name Where it goes Status Comes from
EXPO*PUBLIC_CLERK_PUBLISHABLE_KEY .env (app) ✅ already set Clerk dashboard → API keys
EXPO_PUBLIC_CONVEX_URL .env.local (app) ✅ already set (written by npx convex dev) Convex
CLERK_JWT_ISSUER_DOMAIN Convex dashboard env vars (not a local file) 🆕 needed Clerk dashboard → Convex integration
EXPO_PUBLIC_RC_IOS_KEY .env.local (app) 🆕 needed RevenueCat dashboard → your App Store app's public API key (appl*…)
These are uploaded into RevenueCat, never added to the app or .env:

In-App Purchase Key (.p8 file + Issuer ID). Required.
App Store Connect API Key (.p8 file + Issuer ID + Vendor number). Optional; it lets RevenueCat import your products automatically.
Rules of thumb:

Anything starting with EXPO*PUBLIC* is baked into the app bundle, and anyone can read it. Only public keys go there (Clerk pk*… and RevenueCat appl*… are designed to be public).
Secrets (the .p8 files) stay in dashboards.
After changing .env or .env.local, restart Metro with a cleared cache: npx expo start -c. The values are inlined when the bundle is built.
Dashboard button labels shift a little over time. If a label doesn't match exactly, look for the closest equivalent in the same section.

Step 1 — Apple prerequisites (do these first; everything else depends on them)
Apple Developer Program membership ($99/yr) at developer.apple.com, enrolled under the Apple ID you'll publish with.
App Store Connect → Business:
Sign the Paid Apps Agreement.
Fill in Tax and Banking until the status shows Active/Clear.
In-app purchases, even sandbox test ones, won't load until this is done.
App Store Connect → Apps → "+" → New App:
Platform iOS, name "Bulky AI" (or your final name).
Bundle ID com.jatin4224.obuai: it must match ios.bundleIdentifier in app.json. If it isn't in the dropdown, register it first at developer.apple.com → Certificates, IDs & Profiles → Identifiers → "+".
SKU is any unique string (e.g. obuai-ios).
Step 2 — CLERK_JWT_ISSUER_DOMAIN (lets Convex trust Clerk sign-ins)
Go to dashboard.clerk.com → select your obuAI application (make sure the Development instance is selected at the top).

Open the Convex integration page (dashboard.clerk.com/apps/setup/convex; or search "Convex" in the dashboard) → click Activate Convex integration.

The page shows the Frontend API URL, e.g. https://verb-noun-00.clerk.accounts.dev. Copy it.

Go to dashboard.convex.dev → your obuAI project → your dev deployment → Settings → Environment Variables → Add:

Name: CLERK_JWT_ISSUER_DOMAIN
Value: the URL you copied (no trailing slash)
Or from the terminal: npx convex env set CLERK_JWT_ISSUER_DOMAIN https://verb-noun-00.clerk.accounts.dev

Later, at launch: Clerk's Production instance has a different Frontend API URL (https://clerk.<your-domain>). Set that value on the Convex production deployment too.

Step 3 — Create the subscriptions in App Store Connect
App Store Connect → Apps → your app → Monetization → Subscriptions (the sidebar may label it Features → Subscriptions) → "+" next to Subscription Groups.
Reference name: Bulky Premium
Inside the group, "+" → create the monthly subscription:
Reference Name: Bulky Monthly
Product ID: bulky_monthly (can never be changed or reused)
Subscription Duration: 1 Month
Subscription Prices → "+" → pick your base price (plan.md says $8.99; Apple converts it to local currencies like ₹ automatically) → Next → Confirm
Same group, "+" → create the yearly subscription:
Reference Name: Bulky Yearly
Product ID: bulky_yearly
Duration: 1 Year
Price: $24.99 (or your choice)
For each subscription, add the free trial: Introductory Offers (inside Subscription Prices) → "+"
Countries: all
Start date: today; no end date
Type: Free
Duration: 3 Days
Confirm
For each subscription, under Localization → "+": Subscription Display Name (e.g. "Bulky Premium Monthly") and a short Description.
For each subscription, under Review Information: upload a screenshot of the paywall (you can do this after the paywall is built; a placeholder works for sandbox testing).
On the group page, add a Subscription Group Localization (Display Name "Bulky Premium", App Name).
Products will show "Missing Metadata" or "Ready to Submit". That's fine for sandbox testing. They get approved together with your first app submission.
The app reads prices from Apple at runtime, so changing prices later needs no code change.

Step 4 — Generate the In-App Purchase Key (required by RevenueCat)
App Store Connect → Users and Access → Integrations → In-App Purchase.
Click Generate In-App Purchase Key (or "+" if you've made one before) → name it RevenueCat → Generate.
Click Download API Key → you get a .p8 file. Apple lets you download it only once. Store it somewhere safe (not in the repo).
Copy the Issuer ID shown at the top of that page.
Optional but recommended — App Store Connect API Key (lets RevenueCat auto-import products):

Users and Access → Integrations → App Store Connect API → "+" → name RevenueCat → Access App Manager → Generate → Download the .p8 (one-time) → copy the Issuer ID.
Vendor number: App Store Connect → Payments and Financial Reports, shown in the top-left.
Step 5 — RevenueCat setup → EXPO_PUBLIC_RC_IOS_KEY
Sign up at app.revenuecat.com → Create new project → name Bulky AI.
Add the App Store app: in the project, go to Apps (Project settings → Apps & providers) → + New → App Store:
App name: Bulky AI iOS
Bundle ID: com.jatin4224.obuai
Save
Upload the In-App Purchase Key: open that app → In-app purchase key configuration tab → upload the .p8 from Step 4 → paste the Issuer ID (the Key ID is read from the file) → Save changes → wait for "Valid credentials".
(Optional) App Store Connect API tab → upload the second .p8 → Issuer ID + Vendor number → Save Changes.
Products: Product catalog → Products → + New:
Choose Import Products if you did step 4, or add them manually: identifier bulky_monthly (App Store) → Save.
Repeat for bulky_yearly. The identifiers must match App Store Connect exactly.
Entitlement: Product catalog → Entitlements → + New entitlement:
Identifier bulky_premium, description "Premium access" → Save.
Open it → Attach → attach both bulky_monthly and bulky_yearly.
Offering: Product catalog → Offerings → + New:
Identifier default, description "Default paywall" → Save.
Open it → + Add package → identifier $rc_monthly → attach bulky_monthly → Save.

- Add package → $rc*annual → attach bulky_yearly → Save.
  Make sure this offering is marked Default in the Offerings list; if not, use the row's menu → Make default. The app reads offerings.current.
  Get the key: Project settings → API keys (also shown on the App Store app's page) → copy the public app-specific key for the App Store app. It starts with appl*. Do not use a secret key (sk\_…).
  Add it to .env.local:
  EXPO_PUBLIC_RC_IOS_KEY=appl_xxxxxxxxxxxxxxxxxxxx
  Step 6 — Sandbox tester + iOS dev build (you're on Windows)
  App Store Connect → Users and Access → Sandbox → Test Accounts (older UI: Sandbox Testers) → "+":
  Use an email you own that is not already an Apple ID. A Gmail alias like you+sandbox1@gmail.com works.
  On your iPhone (iOS 18+): Settings → Developer → Sandbox Apple Account → sign in with that tester.
  The Developer menu appears after a dev build has been installed or the phone has been connected to Xcode once.
  iOS 17 and earlier: Settings → App Store → Sandbox Account.
  Build: Xcode doesn't run on Windows, so build in the cloud with EAS on a real iPhone. npx expo run:ios needs a Mac.
  npm i -g eas-cli → eas login
  eas device:create → open the link on the iPhone to register it
  eas build --profile development --platform ios → install from the QR code/link → run npx expo start --dev-client
  In Expo Go, RevenueCat runs in Preview API mode with mock purchases. That's fine for checking the UI; real purchases need the dev build.
  Sandbox timing: a 3-day trial and each renewal happen within minutes, so you can watch a trial become a paid renewal quickly
