import { createContext, useState, useEffect, useMemo } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import PropTypes from "prop-types";

import { auth } from "../../../firebaseConfig";

// The AuthContext provides an interface to share authentication state and 
// related operations across the components of the application.
export const AuthContext = createContext({});

// The AuthProvider is a component that wraps around components
// and provides them access to the shared authentication state and operations.
export function AuthProvider({ children }) {

  // user - stores the currently logged in user information.
  const [user, setUser] = useState(null);

  // Monitor the user's authentication state and updates the 
  // `user` state variable accordingly.
  useEffect(() => {
    onAuthStateChanged(auth, (userState) => {
      if (userState) {
        setUser(userState);
      } else {
        setUser(null);
      }
    });
  }, []);

  // useMemo is used to prevent unnecessary re-renders and computations 
  // if the `user` state hasn't changed. This also wraps up the 
  // signin and signout operations.
  const authContextValue = useMemo(
    () => ({
      user,
      setUser,
      signin: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
      },
      signout: async () => {
        await signOut(auth);
      },
    }),
    [user]
  );

  // The AuthContext.Provider component makes the authentication context 
  // available to all child components of this AuthProvider component.
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
