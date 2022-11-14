import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CalendarPage } from "../../src/calendar/pages/CalendarPage";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { AppRouter } from "../../src/router/AppRouter";

jest.mock("../../src/hooks/useAuthStore");
jest.mock("../../src/calendar/pages/CalendarPage", () => ({
  CalendarPage: () => <h1>CalendarPage</h1>,
}));

describe("Pruebas en <AppRouter />", () => {
  const mockCheckAuthToken = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test("Debe mostrar la pantalla de carga y llamar checkAuthToken", () => {
    useAuthStore.mockReturnValue({
      status: "checking",
      checkAuthToken: mockCheckAuthToken,
    });

    render(<AppRouter />);

    expect(screen.getByText("Cargando...")).toBeTruthy();
    expect(mockCheckAuthToken).toHaveBeenCalled();
  });

  test("Debe mostrar la pantalla de login si no está autenticado", () => {
    useAuthStore.mockReturnValue({
      status: "non-authenticated",
      checkAuthToken: mockCheckAuthToken,
    });

    const { container } = render(
      <MemoryRouter initialEntries={["/auth2/algo/otracosa"]}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText("Ingreso")).toBeTruthy();
    expect(screen.getByText("Registro")).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  test("Debe mostrar el calendario si está autenticado", () => {
    useAuthStore.mockReturnValue({
      status: "authenticated",
      checkAuthToken: mockCheckAuthToken,
    });

    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("CalendarPage")).toBeTruthy();
  });
});
