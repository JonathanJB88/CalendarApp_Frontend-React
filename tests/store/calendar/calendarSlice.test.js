import {
  calendarSlice,
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
  onSetActiveEvent,
  onUpdateEvent,
} from "../../../src/store/calendar/calendarSlice";
import {
  calendarWithActiveEventState,
  calendarWithEventsState,
  events,
  initialState,
} from "../../fixtures/calendarStates";

describe("Pruebas en calendarSlice", () => {
  test("Debe retornar el estado por defecto", () => {
    const state = calendarSlice.getInitialState();
    expect(state).toEqual(initialState);
  });

  test("onSetActiveEvent debe activar el evento", () => {
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onSetActiveEvent(events[0])
    );
    expect(state.activeEvent).toEqual(events[0]);
  });

  test("onAddNewEvent debe agregar el evento", () => {
    const newEvent = {
      id: "3",
      start: new Date("2022-12-12 18:00:00"),
      end: new Date("2022-12-12 20:00:00"),
      title: "Cumpleaños de Agus!!!",
      notes: "Comprar el vino favorito!!",
    };

    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onAddNewEvent(newEvent)
    );
    expect(state.events).toEqual([...events, newEvent]);
    expect(state.events.length).toBe(3);
    expect(state.events[2]).toEqual(newEvent);
  });

  test("onUpdateEvent debe actualizar el evento", () => {
    const updatedEvent = {
      id: "2",
      start: new Date("2022-12-12 20:00:00"),
      end: new Date("2022-12-12 22:00:00"),
      title: "Cumpleaños de Agus actualizado",
      notes: "Notas actualizadas",
    };

    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onUpdateEvent(updatedEvent)
    );
    expect(state.events).toContain(updatedEvent);
    expect(state.events).toEqual([events[0], updatedEvent]);
    expect(state.events.length).toBe(2);
    expect(state.events[1]).toEqual(updatedEvent);
  });

  test("onDeleteEvent debe borrar el evento activo", () => {
    const state = calendarSlice.reducer(
      calendarWithActiveEventState,
      onDeleteEvent()
    );
    expect(state.events).toEqual([events[1]]);
    expect(state.events.length).toBe(1);
    expect(state.activeEvent).toBeNull();
  });

  test("onLoadEvents debe cargar los eventos", () => {
    const state = calendarSlice.reducer(initialState, onLoadEvents(events));
    expect(state.events).toEqual(events);
    expect(state.events.length).toBe(2);
    expect(state.isLoadingEvents).toBe(false);

    const newState = calendarSlice.reducer(state, onLoadEvents(events));
    expect(newState.events).toEqual(events);
    expect(newState.events.length).toBe(2);
    expect(newState.isLoadingEvents).toBe(false);
  });

  test("onLogoutCalendar debe limpiar el estado", () => {
    const state = calendarSlice.reducer(
      calendarWithActiveEventState,
      onLogoutCalendar()
    );
    expect(state).toEqual(initialState);
  });
});
