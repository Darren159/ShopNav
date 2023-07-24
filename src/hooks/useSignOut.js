import { useContext } from "react";
import { router } from "expo-router";
import { AuthContext } from "../app/context/auth";

export default function useSignOut() {
  const { signout } = useContext(AuthContext);

  return async () => {
    await signout();
    router.replace("/sign-in");
  };
}
