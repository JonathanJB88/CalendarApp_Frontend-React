import { configureStore } from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { useUiStore } from "../../src/hooks";
import { uiSlice } from "../../src/store";

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
    },
    preloadedState: {
      ui: { ...initialState },
    },
  });
};

describe("Pruebas en useUiStore", () => {
  test("Debe de retornar el valor por defecto", () => {
    const mockStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });
    expect(result.current).toEqual({
      isDateModalOpen: false,
      openDateModal: expect.any(Function),
      closeDateModal: expect.any(Function),
      toggleDateModal: expect.any(Function),
    });
  });

  test("Debe de retornar el valor de isDateModalOpen en true", () => {
    const mockStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });
    const { openDateModal } = result.current;

    act(() => {
      openDateModal();
    });

    expect(result.current.isDateModalOpen).toBe(true);
  });

  test("Debe de retornar el valor de isDateModalOpen en false", () => {
    const mockStore = getMockStore({ isDateModalOpen: true });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });
    const { closeDateModal } = result.current;

    act(() => {
      closeDateModal();
    });

    expect(result.current.isDateModalOpen).toBe(false);
  });

  test("Debe retornar el valor de isDateModalOpen en false o true, ejecutando el toggle", () => {
    const mockStore = getMockStore({ isDateModalOpen: true });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}> {children} </Provider>
      ),
    });

    act(() => {
      result.current.toggleDateModal();
    });

    expect(result.current.isDateModalOpen).toBe(false);

    act(() => {
      result.current.toggleDateModal();
    });

    expect(result.current.isDateModalOpen).toBe(true);
  });
});
