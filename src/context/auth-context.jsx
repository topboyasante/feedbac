import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserDetails, setCurrentUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async (uid) => {
      try {
        const usersCollectionRef = collection(db, "users");
        const userQuery = query(usersCollectionRef, where("uid", "==", uid));
        const userDocSnap = await getDocs(userQuery);

        if (!userDocSnap.empty) {
          const userData = userDocSnap.docs[0].data();
          setCurrentUserDetails(userData);
        } else {
          console.error("User details not found.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        fetchUserDetails(user.uid);
      } else {
        setCurrentUserDetails(null);
      }
    });

    return () => unsubscribe();
  }, []);


  const value = { currentUser, loading, currentUserDetails };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
