export const events = [
  {
    id: "1",
    start: new Date("2022-11-12 18:00:00"),
    end: new Date("2022-11-12 20:00:00"),
    title: "Cumpleaños de Joni",
    notes: "Comprar el pastel",
  },
  {
    id: "2",
    start: new Date("2022-12-12 18:00:00"),
    end: new Date("2022-12-12 20:00:00"),
    title: "Cumpleaños de Agus",
    notes: "Comprar el vino",
  },
];

export const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null,
};

export const calendarWithEventsState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: null,
};

export const calendarWithActiveEventState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: { ...events[0] },
};
