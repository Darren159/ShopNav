import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { AuthContext } from "../../app/context/auth";
import SignOutButton from "../SignOutButton";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock("firebase/auth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../firebaseConfig.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const signoutMock = jest.fn();

describe("SignOutButton", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <AuthContext.Provider value={{ signout: signoutMock }}>
        <SignOutButton />
      </AuthContext.Provider>
    );

    expect(getByText("Logout")).toBeTruthy();
  });

  it("calls signout function and router.replace when pressed", async () => {
    const { getByText } = render(
      <AuthContext.Provider value={{ signout: signoutMock }}>
        <SignOutButton />
      </AuthContext.Provider>
    );

    fireEvent.press(getByText("Logout"));

    await waitFor(() => {
      expect(signoutMock).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith("/sign-in");
    });
  });
});
