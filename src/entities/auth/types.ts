export type User = {
  id: string;
  email: string;
  name?: string | null;
};

export type AuthResponse = {
  token: string;
  user: User;
};
