import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export function useUserProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !db) {
      setLoading(false);
      setProfile(null);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, "users", userId),
      (snap) => {
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("[UniTrade] Error fetching user profile:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const updateProfile = async (data) => {
    if (!userId || !db) return;
    try {
      await setDoc(doc(db, "users", userId), data, { merge: true });
    } catch (error) {
      console.error("[UniTrade] Error updating user profile:", error);
      throw error;
    }
  };

  return { profile, loading, updateProfile };
}
