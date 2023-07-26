import renderer from "react-test-renderer";
import { Alert } from "react-native";
import { router } from "expo-router";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import SignIn from "../sign-in";
import { AuthContext } from "../context/auth";

jest.mock("firebase/auth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../firebaseConfig.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("expo-router", () => ({
  Stack: {
    Screen: () => "MockedScreenComponent",
  },
  router: {
    replace: jest.fn(),
  },
}));

jest.spyOn(Alert, "alert");

const signInMock = jest.fn();

describe("SignIn", () => {
  it("renders correctly", async () => {
    const tree = renderer
      .create(
        <AuthContext.Provider value={{ user: null, signin: signInMock }}>
          <SignIn />
        </AuthContext.Provider>
      )
      .toJSON();
    await waitFor(() => expect(tree).toMatchSnapshot());
  });

  it("calls signin function with the input value", async () => {
    const { getByText, getByPlaceholderText } = render(
      <AuthContext.Provider value={{ user: null, signin: signInMock }}>
        <SignIn />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith("test@example.com", "password");
    });
  });

  it("calls router function when there is a user logged in", () => {
    render(
      <AuthContext.Provider value={{ user: true, signin: signInMock }}>
        <SignIn />
      </AuthContext.Provider>
    );

    expect(router.replace).toHaveBeenCalledWith("/developerAccess");
  });

  it("shows an error alert when signin fails", async () => {
    const { getByText, getByPlaceholderText } = render(
      <AuthContext.Provider
        value={{
          user: null,
          signin: jest.fn(() => {
            throw new Error("Test error");
          }),
        }}
      >
        <SignIn />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password");
    fireEvent.press(getByText("Login"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Sign In Error",
        "Invalid Email/Password",
        [{ text: "OK" }],
        { cancelable: false }
      )
    );
  });
  it("shows loading indicator when signing in", async () => {
    const { getByText, getByPlaceholderText, queryByTestId } = render(
      <AuthContext.Provider value={{ user: null, signin: signInMock }}>
        <SignIn />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password");
    fireEvent.press(getByText("Login"));

    expect(queryByTestId("loading")).toBeTruthy();

    await waitFor(() => expect(queryByTestId("loading")).toBeNull());
  });
});
