/* eslint react-refresh/only-export-components: "off" */
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInAnonymously,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
  updateProfile,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children, app, db, appId }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = app ? getAuth(app) : null;

  // Auth providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const appleProvider = new OAuthProvider('apple.com');

  useEffect(() => {
    if (!auth || !db) {
      console.warn('Firebase not configured; running in offline demo mode.');
      const demoUser = {
        uid: 'demo-user',
        name: 'Israel Raymon',
        username: 'israelraymon',
        email: 'demo@fishing.app',
        location: 'Tennessee',
        catches: 105,
        followers: 35,
        following: 42,
        species: 25,
        gearCount: 12,
        locations: 15,
        profilePrivacy: 'public',
        avatar: null,
        bio: 'Passionate angler from Tennessee',
        joinDate: new Date().toISOString(),
        isAnonymous: false
      };
      setUser(demoUser);
      setUserId('demo-user');
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setIsLoading(true);
      setError(null);

      if (authUser) {
        const currentUserId = authUser.uid;
        setUserId(currentUserId);

        try {
          // Get user profile from Firestore
          const userDocRef = doc(db, 'artifacts', appId, 'users', currentUserId, 'userProfile', 'profile');
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: currentUserId,
              email: authUser.email,
              isAnonymous: authUser.isAnonymous,
              ...userData
            });
          } else {
            // Create default profile for new users
            const defaultUser = {
              name: authUser.displayName || 'Angler',
              username: authUser.email?.split('@')[0] || `angler_${currentUserId.slice(0, 8)}`,
              email: authUser.email,
              location: '',
              catches: 0,
              followers: 0,
              following: 0,
              species: 0,
              gearCount: 0,
              locations: 0,
              profilePrivacy: 'public',
              avatar: authUser.photoURL,
              bio: '',
              joinDate: new Date().toISOString(),
              isAnonymous: authUser.isAnonymous
            };
            
            await setDoc(userDocRef, defaultUser);
            setUser({
              uid: currentUserId,
              ...defaultUser
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError('Failed to load user profile');
        }
      } else {
        setUser(null);
        setUserId(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, appId]);

  // Auth methods
  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password, userData = {}) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (userData.name) {
        await updateProfile(result.user, { displayName: userData.name });
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, appleProvider);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      setError(null);
      await signInAnonymously(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const changePassword = async (newPassword) => {
    try {
      setError(null);
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      if (userId && db) {
        const userDocRef = doc(db, 'artifacts', appId, 'users', userId, 'userProfile', 'profile');
        await updateDoc(userDocRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
        setUser(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      setError(null);
      if (auth.currentUser && userId && db) {
        // Delete user data from Firestore
        const userDocRef = doc(db, 'artifacts', appId, 'users', userId);
        await deleteDoc(userDocRef);
        
        // Delete Firebase Auth user
        await deleteUser(auth.currentUser);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    userId,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAnonymous: user?.isAnonymous || false,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signInAsGuest,
    resetPassword,
    changePassword,
    updateUserProfile,
    deleteAccount,
    logout,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};