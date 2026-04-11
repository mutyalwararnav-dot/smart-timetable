"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClayCard } from "@/components/ClayCard";
import { ClayButton } from "@/components/ClayButton";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [timerDuration, setTimerDuration] = useState(25);
  const [parallaxEnabled, setParallaxEnabled] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setDisplayName(user.user_metadata?.full_name || "");
        setMobileNumber(user.user_metadata?.mobile_number || "");
        if (user.user_metadata?.focus_time) {
          setTimerDuration(user.user_metadata.focus_time);
        }
      } else {
        router.push("/login");
      }
    });
  }, [supabase, router]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: displayName,
          mobile_number: mobileNumber,
          focus_time: timerDuration,
        }
      });
      if (error) throw error;
      alert("Profile updated successfully!");
      router.refresh();
    } catch (error: any) {
      alert("Error updating profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account preferences and settings.</p>
      </div>

      {/* Card 1: Profile Information */}
      <ClayCard className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Profile Information</h2>
          <p className="text-sm text-slate-400">Update your personal details here.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email (Read Only)</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 rounded-xl cursor-not-allowed focus:outline-none bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-indigo-500"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Mobile Number (Optional)</label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-indigo-500"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <ClayButton onClick={handleSaveProfile} isLoading={isSaving}>
            Save Profile
          </ClayButton>
        </div>
      </ClayCard>

      {/* Card 2: App Preferences */}
      <ClayCard className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">App Preferences</h2>
          <p className="text-sm text-slate-400">Customize your app experience.</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Default Focus Timer Duration (Minutes)</label>
            <input
              type="number"
              value={timerDuration}
              onChange={(e) => setTimerDuration(parseInt(e.target.value) || 25)}
              min="1"
              max="120"
              className="w-full max-w-xs px-4 py-3 rounded-xl transition-colors focus:outline-none bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">Enable Parallax Background</p>
              <p className="text-xs text-slate-500">Adds a 3D depth effect to backgrounds based on mouse movement.</p>
            </div>
            
            {/* Visual Toggle Switch */}
            <button 
              type="button"
              role="switch"
              aria-checked={parallaxEnabled}
              onClick={() => setParallaxEnabled(!parallaxEnabled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                parallaxEnabled ? 'bg-indigo-500' : 'bg-slate-600'
              }`}
            >
              <span 
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  parallaxEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} 
              />
            </button>
          </div>
        </div>
      </ClayCard>

      {/* Card 3: Account Actions */}
      <ClayCard className="space-y-6 border border-red-900/30">
        <div>
          <h2 className="text-xl font-bold text-red-400">Account Actions</h2>
          <p className="text-sm text-slate-400">Destructive actions for your account.</p>
        </div>
        
        <div>
          <ClayButton 
            onClick={handleSignOut} 
            isLoading={isSigningOut}
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white"
          >
            Sign Out
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
}
