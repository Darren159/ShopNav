import { createContext, useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
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
        } catch (error) {
          let errorMessage;
          
          switch (error.code) {
            case 'auth/user-not-found':
              errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'The password is invalid or the user does not have a password.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'The email address is badly formatted.';
              break;
            default:
              errorMessage = 'Something went wrong. Please try again later.';
          }
      
          Alert.alert(
            "Authentication Failed",
            errorMessage,
            [
              { text: "OK" }
            ]
          );
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
