"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  syncUserProfileToFirestore,
  fetchUserProfileFromFirestore,
  UserProfileData,
} from "@/lib/firebase";
import { useRole, UserRole } from "@/components/RoleContext";

export interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  isDemo?: boolean;
}

export type AuthUser = (User | DemoUser) & { isDemo?: boolean };

interface StoredAccount {
  email: string;
  password: string;
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string | null;
  };
  profile: UserProfileData;
}

interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  isDemoMode: boolean;
  isFirebaseConfigured: boolean;
  loginWithEmail: (email: string, password: string) => Promise<User | AuthUser | void>;
  registerWithEmail: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    organization?: string
  ) => Promise<User | AuthUser | void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: (role: UserRole, customName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REGISTERED_ACCOUNTS_KEY = "igg_registered_accounts";
const CURRENT_USER_KEY = "igg_current_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { setRole } = useRole();

  // Clear demo data on load and initialize current user
  useEffect(() => {
    // Purge any legacy demo user session
    localStorage.removeItem("igg_demo_user");

    // Check if there is an active verified session
    const savedUserJson = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUserJson) {
      try {
        const savedAccount: StoredAccount = JSON.parse(savedUserJson);
        if (savedAccount && savedAccount.user) {
          setUser(savedAccount.user as AuthUser);
          setUserProfile(savedAccount.profile);
          if (savedAccount.profile?.role) {
            setRole(savedAccount.profile.role);
          }
        }
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const profile = await fetchUserProfileFromFirestore(firebaseUser.uid);
        if (profile) {
          setUserProfile(profile);
          if (profile.role) {
            setRole(profile.role);
          }
        } else {
          const newProfile = await syncUserProfileToFirestore(firebaseUser, { role: "citizen" });
          if (newProfile) setUserProfile(newProfile);
        }
      } else {
        // Only clear if no local registered user session
        if (!localStorage.getItem(CURRENT_USER_KEY)) {
          setUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setRole]);

  // Mandatory Login with Email & Password
  const loginWithEmail = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. If Firebase Auth is configured, attempt Firebase login
    if (auth && isFirebaseConfigured) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = userCredential.user;
        const profile = await fetchUserProfileFromFirestore(fbUser.uid);
        if (profile) {
          setUserProfile(profile);
          if (profile.role) setRole(profile.role);
        }
        setUser(fbUser);
        return fbUser;
      } catch (fbError: any) {
        console.warn("Firebase Auth sign-in failed, checking registered accounts:", fbError.code);
        // Fall through to registered accounts if Firebase had an error
      }
    }

    // 2. Check registered accounts store
    const registeredJson = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    const registeredAccounts: StoredAccount[] = registeredJson ? JSON.parse(registeredJson) : [];
    const account = registeredAccounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (account) {
      if (account.password !== password) {
        throw new Error("Invalid password. Please check your credentials.");
      }
      setUser(account.user as AuthUser);
      setUserProfile(account.profile);
      if (account.profile?.role) {
        setRole(account.profile.role);
      }
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(account));
      return account.user;
    }

    throw new Error("No account found with this email. Please check your email or create an account.");
  };

  // Register new account with Email & Password
  const registerWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    organization?: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || cleanEmail.split("@")[0];

    let createdUid = `user_${Date.now()}`;

    // 1. If Firebase is configured, create in Firebase
    if (auth && isFirebaseConfigured) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = userCredential.user;
        createdUid = fbUser.uid;
        await updateProfile(fbUser, { displayName: cleanName });
        const profile = await syncUserProfileToFirestore(
          { ...fbUser, displayName: cleanName },
          { role, organization }
        );
        if (profile) {
          setUserProfile(profile);
          setRole(role);
        }
        setUser(fbUser);
      } catch (fbError: any) {
        console.warn("Firebase createUser error, storing registered user locally:", fbError.code);
        if (fbError.code === "auth/email-already-in-use") {
          throw fbError;
        }
      }
    }

    // 2. Store in registered accounts store
    const registeredJson = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    const registeredAccounts: StoredAccount[] = registeredJson ? JSON.parse(registeredJson) : [];

    const existingIndex = registeredAccounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);
    if (existingIndex >= 0) {
      throw new Error("An account with this email already exists. Please sign in.");
    }

    const newAccount: StoredAccount = {
      email: cleanEmail,
      password: password,
      user: {
        uid: createdUid,
        email: cleanEmail,
        displayName: cleanName,
        photoURL: null,
      },
      profile: {
        uid: createdUid,
        email: cleanEmail,
        displayName: cleanName,
        role: role,
        organization: organization || (role === "discom" ? "DISCOM Utility" : role === "policymaker" ? "Energy Authority" : "Residential Consumer"),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
    };

    registeredAccounts.push(newAccount);
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(registeredAccounts));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newAccount));

    setUser(newAccount.user as AuthUser);
    setUserProfile(newAccount.profile);
    setRole(role);

    return newAccount.user;
  };

  // Login with Google
  const loginWithGoogle = async () => {
    if (!auth || !googleProvider || !isFirebaseConfigured) {
      throw new Error("Google sign-in is not configured. Please use email and password.");
    }
    const cred = await signInWithPopup(auth, googleProvider);
    const profile = await syncUserProfileToFirestore(cred.user, { role: "citizen" });
    if (profile) {
      setUserProfile(profile);
      if (profile.role) setRole(profile.role);
    }
    setUser(cred.user);
  };

  // Direct demo login is strictly disabled
  const loginAsDemo = async (_role: UserRole, _customName?: string) => {
    throw new Error("Direct demo login has been disabled. Mandatory authentication is required.");
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("igg_demo_user");
    localStorage.removeItem(CURRENT_USER_KEY);
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("Sign out warning:", e);
      }
    }
    setUser(null);
    setUserProfile(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (auth && isFirebaseConfigured) {
      await sendPasswordResetEmail(auth, cleanEmail);
      return;
    }
    // Simulate reset check for registered account
    const registeredJson = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    const registeredAccounts: StoredAccount[] = registeredJson ? JSON.parse(registeredJson) : [];
    const account = registeredAccounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (!account) {
      throw new Error("No account found with this email address.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isDemoMode: false,
        isFirebaseConfigured,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsDemo,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
