import {
  onCloseDateModal,
  onOpenDateModal,
  uiSlice,
} from "../../../src/store/ui/uiSlice";

describe("Pruebas en uiSlice", () => {
  test("Debe tener el estado por defecto", () => {
    expect(uiSlice.getInitialState()).toEqual({ isDateModalOpen: false });
  });

  test("Debe cambiar el isDateOpenModal correctamente", () => {
    let state = uiSlice.getInitialState();
    state = uiSlice.reducer(state, onOpenDateModal());
    expect(state).toEqual({ isDateModalOpen: true });
    state = uiSlice.reducer(state, onCloseDateModal());
    expect(state).toEqual({ isDateModalOpen: false });
  });
});
