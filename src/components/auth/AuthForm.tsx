
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
  updateProfile
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration with actual credentials
const firebaseConfig = {
  apiKey: "AIzaSyAYD3Dw64rcjgdrSB9HR0JiNW8qp4ne3h0",
  authDomain: "project1-e9627.firebaseapp.com",
  projectId: "project1-e9627",
  storageBucket: "project1-e9627.appspot.com",
  messagingSenderId: "528098334551",
  appId: "1:528098334551:web:fb94a6d28b474b39329012"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!email || !password || !displayName) {
      toast({ 
        title: "Error", 
        description: "Please fill in all fields", 
        variant: "destructive" 
      });
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      toast({ 
        title: "Error", 
        description: "Please enter a valid email address", 
        variant: "destructive" 
      });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast({ 
        title: "Error", 
        description: "Password should be at least 6 characters", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's display name
      await updateProfile(user, { displayName });
      
      toast({
        title: "Success",
        description: "Your account has been created",
      });
    } catch (error) {
      const authError = error as AuthError;
      console.error("Sign up error:", authError);
      let errorMessage = "Failed to create account";
      
      if (authError.code === 'auth/email-already-in-use') {
        errorMessage = "Email is already in use";
      } else if (authError.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (authError.code === 'auth/weak-password') {
        errorMessage = "Password is too weak";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!email || !password) {
      toast({ 
        title: "Error", 
        description: "Please fill in all fields", 
        variant: "destructive" 
      });
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      toast({ 
        title: "Error", 
        description: "Please enter a valid email address", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description: "You have been signed in",
      });
    } catch (error) {
      const authError = error as AuthError;
      console.error("Sign in error:", authError);
      let errorMessage = "Failed to sign in";
      
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (authError.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (authError.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Success",
        description: "You have been signed in with Google",
      });
    } catch (error) {
      const authError = error as AuthError;
      console.error("Google sign in error:", authError);
      
      let errorMessage = "Failed to sign in with Google";
      if (authError.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign in was cancelled";
      } else if (authError.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by the browser. Please allow popups for this site.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" className="w-full">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <TabsContent value="login">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Name</Label>
                <Input
                  id="display-name"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </TabsContent>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25526 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25537 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            Google
          </Button>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
