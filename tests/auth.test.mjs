import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Firebase environment example template defines all required credentials", () => {
  const envExamplePath = path.join(process.cwd(), ".env.example");
  assert.ok(fs.existsSync(envExamplePath), ".env.example must exist");

  const content = fs.readFileSync(envExamplePath, "utf8");
  assert.ok(content.includes("NEXT_PUBLIC_FIREBASE_API_KEY"), "Missing API key template");
  assert.ok(content.includes("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"), "Missing auth domain template");
  assert.ok(content.includes("NEXT_PUBLIC_FIREBASE_PROJECT_ID"), "Missing project id template");
  assert.ok(content.includes("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"), "Missing storage bucket template");
  assert.ok(content.includes("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"), "Missing messaging sender id template");
  assert.ok(content.includes("NEXT_PUBLIC_FIREBASE_APP_ID"), "Missing app id template");
});

test("Firebase client module structure and exports are valid", () => {
  const firebaseTsPath = path.join(process.cwd(), "lib", "firebase.ts");
  assert.ok(fs.existsSync(firebaseTsPath), "lib/firebase.ts must exist");

  const content = fs.readFileSync(firebaseTsPath, "utf8");
  assert.ok(content.includes("isFirebaseConfigured"), "Must export isFirebaseConfigured");
  assert.ok(content.includes("syncUserProfileToFirestore"), "Must export syncUserProfileToFirestore");
  assert.ok(content.includes("fetchUserProfileFromFirestore"), "Must export fetchUserProfileFromFirestore");
  assert.ok(content.includes("auth"), "Must export auth");
  assert.ok(content.includes("db"), "Must export db");
});

test("AuthContext module provides required sign in, sign up, demo and logout methods", () => {
  const authContextPath = path.join(process.cwd(), "context", "AuthContext.tsx");
  assert.ok(fs.existsSync(authContextPath), "context/AuthContext.tsx must exist");

  const content = fs.readFileSync(authContextPath, "utf8");
  assert.ok(content.includes("loginWithEmail"), "Must export loginWithEmail");
  assert.ok(content.includes("registerWithEmail"), "Must export registerWithEmail");
  assert.ok(content.includes("loginWithGoogle"), "Must export loginWithGoogle");
  assert.ok(content.includes("loginAsDemo"), "Must export loginAsDemo");
  assert.ok(content.includes("logout"), "Must export logout");
  assert.ok(content.includes("resetPassword"), "Must export resetPassword");
  assert.ok(content.includes("useAuth"), "Must export useAuth hook");
});

test("Login page supports Citizen, DISCOM, and Policymaker roles and authentication", () => {
  const loginPagePath = path.join(process.cwd(), "app", "login", "page.tsx");
  assert.ok(fs.existsSync(loginPagePath), "app/login/page.tsx must exist");

  const content = fs.readFileSync(loginPagePath, "utf8");
  assert.ok(content.includes("citizen"), "Login page must support citizen role");
  assert.ok(content.includes("discom"), "Login page must support discom role");
  assert.ok(content.includes("policymaker"), "Login page must support policymaker role");
  assert.ok(!content.includes("Continue with Google"), "Continue with Google must be removed");
  assert.ok(!content.includes("handleDemoSignIn"), "Direct demo sign-in buttons must be removed");
  assert.ok(content.includes("Mandatory Authentication"), "Must enforce mandatory authentication");
  assert.ok(content.includes("getDestination"), "Must support dynamic redirect destination");
});

test("AuthGuard mandates sign-in for all pages and protects dashboard routes", () => {
  const authGuardPath = path.join(process.cwd(), "components", "AuthGuard.tsx");
  assert.ok(fs.existsSync(authGuardPath), "components/AuthGuard.tsx must exist");

  const guardContent = fs.readFileSync(authGuardPath, "utf8");
  assert.ok(guardContent.includes("isLoginPage"), "Must distinguish login page from protected pages");
  assert.ok(guardContent.includes("router.replace"), "Must redirect unauthenticated users");
  assert.ok(guardContent.includes("redirect"), "Must preserve redirect query parameter");

  const layoutPath = path.join(process.cwd(), "app", "layout.tsx");
  const layoutContent = fs.readFileSync(layoutPath, "utf8");
  assert.ok(layoutContent.includes("AuthGuard"), "Root layout must enforce AuthGuard");
});
