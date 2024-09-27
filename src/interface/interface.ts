interface UserPayload {
  username: string;
  password: string;
}

interface LoginPayload extends UserPayload {
  admin: boolean;
}

interface SignupPayload extends UserPayload {
  email: string;
  name: String;
}

export { UserPayload, LoginPayload, SignupPayload };
