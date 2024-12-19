import { create, test, enforce } from "vest";

export const signupVal = create((data) => {
  test("email", "Email is required", () => {
    enforce(data.email).isNotEmpty();
  });
  test("email", "Email is invalid", () => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    enforce(data.email).condition((email) => isValidEmail.test(email));
  });
});

export default signupVal;