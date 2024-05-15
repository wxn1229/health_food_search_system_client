export type LoginInputType = {
  email: string;
  password: string;
};

export type SignupInputType = {
  name: string;
  email: string;
  password: string;
  checkPassword: string;
  gender: boolean;
  age: number | number[];
};

export type ForgetInputType = {
  email: string;
};
