"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getFirebaseClients } from "@/lib/firebase";

export function useAuthToken() {
  const { user } = useAuth();

  useEffect(() => {
    const setAuthToken = async () => {
      const { auth } = getFirebaseClients();
      if (!auth || !user) return;

      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (idToken) {
          // Gửi token lên server để tạo session
          await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          });
        }
      } catch (error) {
        console.error('Error setting auth token:', error);
      }
    };

    if (user) {
      setAuthToken();
    } else {
      // Xóa token khi logout
      fetch('/api/auth/logout', { method: 'POST' });
    }
  }, [user]);
}