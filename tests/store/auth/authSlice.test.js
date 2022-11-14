import {
  authSlice,
  cleanErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "../../../src/store/auth/authSlice";
import { authenticatedState, initialState } from "../../fixtures/authStates";
import { testUserCredentials } from "../../fixtures/testUser";

describe("Pruebas en authSlice", () => {
  test("Debe retornar el estado inicial", () => {
    expect(authSlice.getInitialState()).toEqual(initialState);
  });

  test("Debe realizar el login", () => {
    const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
    expect(state).toEqual({
      status: "authenticated",
      user: testUserCredentials,
      errorMessage: undefined,
    });
  });

  test("Debe realizar el logout", () => {
    const state = authSlice.reducer(authenticatedState, onLogout());
    expect(state).toEqual({
      status: "non-authenticated",
      user: {},
      errorMessage: undefined,
    });
  });

  test("Debe realizar el logout", () => {
    const errorMessage = "Credenciales no válidas";
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
    expect(state).toEqual({
      status: "non-authenticated",
      user: {},
      errorMessage: errorMessage,
    });
  });

  test("Debe limpiar el mensaje de error", () => {
    const errorMessage = "Credenciales no válidas";
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
    const newState = authSlice.reducer(state, cleanErrorMessage());
    expect(newState.errorMessage).toBe(undefined);
  });

  test("Debe retornar el estado inicial llamando onChecking", () => {
    const state = authSlice.reducer(authenticatedState, onChecking());
    expect(state).toEqual(initialState);
  });
});
