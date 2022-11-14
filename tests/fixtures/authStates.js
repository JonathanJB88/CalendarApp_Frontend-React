export const initialState = {
  status: "checking",
  user: {},
  errorMessage: undefined,
};

export const authenticatedState = {
  status: "authenticated",
  user: {
    uid: "ABC123",
    name: "Joni",
  },
  errorMessage: undefined,
};

export const notAuthenticatedState = {
  status: "non-authenticated",
  user: {},
  errorMessage: undefined,
};
