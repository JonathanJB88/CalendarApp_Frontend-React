import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import calendarApi from "../../src/api/calendarApi";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { authSlice } from "../../src/store";
import { initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: {
      auth: { ...initialState },
    },
  });
};

describe("Pruebas en useAuthStore", () => {
  beforeEach(() => localStorage.clear());

  test("Debe retornar los valores por defecto", () => {
    const mockStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });
    expect(result.current).toEqual({
      status: "checking",
      user: {},
      errorMessage: undefined,
      startLogin: expect.any(Function),
      startRegister: expect.any(Function),
      checkAuthToken: expect.any(Function),
      startLogout: expect.any(Function),
    });
  });

  test("startLogin debe realizar el login correctamente", async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });

    await act(async () => {
      await result.current.startLogin(testUserCredentials);
    });

    const { errorMessage, user, status } = result.current;

    expect({ errorMessage, user, status }).toEqual({
      errorMessage: undefined,
      user: { name: "Test User", uid: "636f8c392458efb092aebb1c" },
      status: "authenticated",
    });
    expect(localStorage.getItem("token")).toEqual(expect.any(String));
    expect(localStorage.getItem("token-init-date")).toEqual(expect.any(String));
  });

  test("startLogin debe fallar la autenticación", async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });

    await act(async () => {
      await result.current.startLogin({
        email: "algo@google.com",
        password: "ABC123",
      });
    });

    const { errorMessage, user, status } = result.current;

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("token-init-date")).toBeNull();
    expect({ errorMessage, user, status }).toEqual({
      errorMessage: "Credenciales incorrectas", //Conviene también el expect.any(String)
      user: {},
      status: "non-authenticated",
    });
    await waitFor(() => expect(result.current.errorMessage).toBe(undefined));
  });

  test("startRegister debe realizar el registro correctamente", async () => {
    const newUser = {
      email: "algo@google.com",
      password: "ABC123",
      name: "Test User 2",
    };
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });

    const spy = jest.spyOn(calendarApi, "post").mockReturnValue({
      data: {
        ok: true,
        uid: "abc123",
        name: "Test User 2",
        toke: "Algún token",
      },
    });

    await act(async () => {
      await result.current.startRegister(newUser);
    });
    const { errorMessage, user, status } = result.current;

    expect({ errorMessage, user, status }).toEqual({
      errorMessage: undefined,
      user: { name: "Test User 2", uid: "abc123" },
      status: "authenticated",
    });

    spy.mockRestore();
  });

  test("startRegister debe fallar el registro", async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });

    await act(async () => {
      await result.current.startRegister(testUserCredentials);
    });
    const { errorMessage, user, status } = result.current;

    expect({ errorMessage, user, status }).toEqual({
      errorMessage: "Un usuario existe con ese correo",
      user: {},
      status: "non-authenticated",
    });
  });

  test("checkAuthToken debe fallar si no hay token", async () => {
    const mockStore = getMockStore({ ...initialState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, user, status } = result.current;

    expect({ errorMessage, user, status }).toEqual({
      errorMessage: undefined,
      user: {},
      status: "non-authenticated",
    });
  });

  test("checkAuthToken debe autenticar el usuario si hay un token", async () => {
    const { data } = await calendarApi.post("/auth", testUserCredentials);
    const { token } = data;
    localStorage.setItem("token", token);
    localStorage.setItem("token-init-date", new Date().getTime());
    const mockStore = getMockStore({ ...initialState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, user, status } = result.current;
    expect({ errorMessage, user, status }).toEqual({
      errorMessage: undefined,
      user: { name: "Test User", uid: "636f8c392458efb092aebb1c" },
      status: "authenticated",
    });
  });
});
