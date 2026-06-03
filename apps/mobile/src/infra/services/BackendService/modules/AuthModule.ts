import { JSENDResponse, UserDTO } from "shared";

export class AuthModule {
  constructor(private baseUrl: string) {}

  async createUser(
    name: string,
    plainPassword: string,
    email: string,
  ): Promise<JSENDResponse<UserDTO>> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, plainPassword, email }),
    });

    const jsend = await response.json();

    return jsend;
  }
  async loginUser(
    email: string,
    plainPassword: string,
  ): Promise<JSENDResponse<string>> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, plainPassword }),
    });

    const jsend = await response.json();

    return jsend;
  }
  async logoutUser(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsend = await response.json();

    return jsend.message;
  }
}
