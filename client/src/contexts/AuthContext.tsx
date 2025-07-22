import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Set auth header for API requests
      if (user) {
        // Create user in database if doesn't exist
        try {
          await apiRequest("POST", "/api/users", {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        } catch (error) {
          // User might already exist, which is fine
          console.log("User already exists or error creating user:", error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with display name
    await updateProfile(result.user, { displayName });
    await result.user.getIdToken();
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Interceptor to add Firebase ID token to requests
export async function addAuthHeader(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'x-firebase-uid': user.uid,
    };
  }
  return {};
}
