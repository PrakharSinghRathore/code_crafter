
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isSubscribed: boolean;
  generationsRemaining: number;
  setIsSubscribed: (value: boolean) => void;
  setGenerationsRemaining: (value: number) => void;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

export interface UserData {
  email: string;
  displayName?: string;
  isSubscribed: boolean;
  generationsRemaining: number;
  createdAt: number;
  lastLoginAt: number;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  isSubscribed: false,
  generationsRemaining: 3,
  setIsSubscribed: () => {},
  setGenerationsRemaining: () => {},
  updateUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [generationsRemaining, setGenerationsRemaining] = useState(3);
  const auth = getAuth();
  const firestore = getFirestore();

  // Initialize or fetch user data from Firestore
  const initializeUserData = async (currentUser: User) => {
    try {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // User exists in Firestore, get their data
        const userData = userDoc.data() as UserData;
        console.log("Retrieved user data:", userData);
        setIsSubscribed(userData.isSubscribed);
        setGenerationsRemaining(userData.generationsRemaining);
        
        // Update last login time
        await updateDoc(userDocRef, {
          lastLoginAt: Date.now()
        });
      } else {
        // First time user, create their document
        console.log("Creating new user document in Firestore");
        const newUserData: UserData = {
          email: currentUser.email || '',
          displayName: currentUser.displayName || undefined,
          isSubscribed: false,
          generationsRemaining: 3,
          createdAt: Date.now(),
          lastLoginAt: Date.now()
        };
        
        await setDoc(userDocRef, newUserData);
        setIsSubscribed(false);
        setGenerationsRemaining(3);
      }
    } catch (error) {
      console.error("Error initializing user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    }
  };

  // Update user data in Firestore
  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, data);
      
      // Update local state if relevant fields were updated
      if (data.isSubscribed !== undefined) setIsSubscribed(data.isSubscribed);
      if (data.generationsRemaining !== undefined) setGenerationsRemaining(data.generationsRemaining);
      
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
      toast({
        title: "Error",
        description: "Failed to update user data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser ? "User logged in" : "No user");
      setUser(currentUser);
      
      if (currentUser) {
        initializeUserData(currentUser);
      } else {
        // Reset state when logged out
        setIsSubscribed(false);
        setGenerationsRemaining(3);
      }
      
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, [auth]);

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        logout, 
        isSubscribed, 
        generationsRemaining,
        setIsSubscribed,
        setGenerationsRemaining,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
