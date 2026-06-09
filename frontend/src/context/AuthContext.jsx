import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';
import { Loader2, ShieldCheck, Mail, UserPlus, Sparkles } from 'lucide-react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockLoadingProfile, setMockLoadingProfile] = useState(null);

  // Sync session on load
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Call backend login endpoint
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                googleId: firebaseUser.uid,
                photoUrl: firebaseUser.photoURL
              })
            });

            if (!response.ok) {
              throw new Error('Failed to synchronize user session with backend');
            }

            const dbUser = await response.json();
            setUser(dbUser);
            localStorage.setItem('careerSethuUserId', dbUser._id);
          } catch (error) {
            console.error('Session sync error:', error);
            setUser(null);
            localStorage.removeItem('careerSethuUserId');
          }
        } else {
          setUser(null);
          localStorage.removeItem('careerSethuUserId');
        }
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // Offline/Mock Auth Mode session restoration
      const storedUserId = localStorage.getItem('careerSethuUserId');
      if (storedUserId) {
        // Attempt to fetch existing profile from local DB
        fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/${storedUserId}`)
          .then(res => {
            if (!res.ok) throw new Error('Mock user not found');
            return res.json();
          })
          .then(data => {
            setUser(data.profile);
          })
          .catch(err => {
            console.warn('Could not restore mock session:', err.message);
            localStorage.removeItem('careerSethuUserId');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, []);

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        setLoading(true);
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        console.error('Firebase Google sign-in failed:', error);
        alert(`Authentication Error: ${error.message}`);
        setLoading(false);
      }
    } else {
      // Trigger Mock Auth Modal
      setShowMockModal(true);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      setUser(null);
      localStorage.removeItem('careerSethuUserId');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for selecting mock profile
  const handleSelectMockProfile = async (profileType, customDetails = null) => {
    setMockLoadingProfile(profileType);
    try {
      let email = '';
      let name = '';
      let googleId = `mock-google-id-${Date.now()}`;
      let photoUrl = '';

      if (profileType === 'tejas') {
        email = 'tejas@ibm.com';
        name = 'TEJAS';
        photoUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop';
      } else if (profileType === 'aryan') {
        email = 'aryachi007@gmail.com';
        name = 'ARYAN R';
        photoUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop';
      } else if (profileType === 'new') {
        email = customDetails?.email || `mock-${Date.now()}@gmail.com`;
        name = customDetails?.name || 'Mock Explorer';
        photoUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, googleId, photoUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to create/login mock user');
      }

      const dbUser = await response.json();
      setUser(dbUser);
      localStorage.setItem('careerSethuUserId', dbUser._id);
      setShowMockModal(false);
    } catch (error) {
      console.error('Mock login failed:', error);
      alert('Mock authentication failed. Ensure backend server is running.');
    } finally {
      setMockLoadingProfile(null);
    }
  };

  const updateUserSession = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, isFirebaseConfigured, updateUserSession }}>
      {children}

      {/* Mock Authentication Modal */}
      {showMockModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#0b0b0c] border border-white/10 rounded-[2rem] max-w-md w-full p-8 shadow-2xl relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-3 text-center mb-6">
              <div className="mx-auto bg-zinc-900 border border-white/10 p-3 rounded-2xl w-fit">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Mock Identity Portal</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Firebase is offline or unconfigured. Choose a pre-seeded profile or create a fresh candidate dossier to test the full SaaS application.
              </p>
            </div>

            <div className="space-y-3">
              {/* Option A: Tejas */}
              <button
                onClick={() => handleSelectMockProfile('tejas')}
                disabled={mockLoadingProfile !== null}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-white group-hover:scale-105 transition-transform">
                    T
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">TEJAS</p>
                    <p className="text-xs text-zinc-500">Target: Frontend Developer at IBM</p>
                  </div>
                </div>
                {mockLoadingProfile === 'tejas' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              {/* Option B: Aryan R */}
              <button
                onClick={() => handleSelectMockProfile('aryan')}
                disabled={mockLoadingProfile !== null}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-white group-hover:scale-105 transition-transform">
                    A
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">ARYAN R</p>
                    <p className="text-xs text-zinc-500">Target: worker at GOOGLE</p>
                  </div>
                </div>
                {mockLoadingProfile === 'aryan' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-violet-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              {/* Option C: Create New Mock Profile */}
              <button
                onClick={() => handleSelectMockProfile('new')}
                disabled={mockLoadingProfile !== null}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 group-hover:scale-105 transition-transform">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">Create New Candidate</p>
                    <p className="text-xs text-zinc-500">Logs in a blank profile to trigger onboarding</p>
                  </div>
                </div>
                {mockLoadingProfile === 'new' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <Mail className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowMockModal(false)}
                disabled={mockLoadingProfile !== null}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
