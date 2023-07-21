import { createContext, useState, useEffect, useMemo } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import PropTypes from "prop-types";

import { auth } from "../../../firebaseConfig";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (userState) => {
      if (userState) {
        setUser(userState);
      } else {
        setUser(null);
      }
    });
  }, []);

  const authContextValue = useMemo(
    () => ({
      user,
      setUser,
      signin: async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
          console.error(e);
        }
      },
      signout: async () => {
        try {
          await signOut(auth);
        } catch (e) {
          console.error(e);
        }
      },
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
