import { useRouter } from "next/navigation";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockInstance } from "vitest";

import LoginForm from "../LoginForm";

function setup() {
  render(<LoginForm />);

  return {
    emailInput: screen.getByLabelText(/email/i),
    passwordInput: screen.getByLabelText(/contraseña/i),
    submitButton: screen.getByRole("button", { name: /iniciar sesión/i }),
  };
}

describe("LoginForm", () => {
  it("renders email, password and submit button", () => {
    const { emailInput, passwordInput, submitButton } = setup();

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("submit button is disabled when fields are empty", () => {
    const { submitButton } = setup();

    expect(submitButton).toBeDisabled();
  });

  it("submit button is disabled when only email is filled", async () => {
    const { emailInput, submitButton } = setup();

    await userEvent.type(emailInput, "test@example.com");

    expect(submitButton).toBeDisabled();
  });

  describe("on submit", () => {
    let fetchSpy: MockInstance;

    beforeEach(() => {
      fetchSpy = vi
        .spyOn(global, "fetch")
        .mockResolvedValue({ ok: true } as Response);
    });

    afterEach(() => {
      fetchSpy.mockRestore();
    });

    it("calls POST /api/auth/login with email and password", async () => {
      const { emailInput, passwordInput, submitButton } = setup();

      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);

      expect(fetchSpy).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          plainPassword: "password123",
        }),
      });
    });

    it("navigates to /app on success", async () => {
      const { emailInput, passwordInput, submitButton } = setup();

      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);

      await waitFor(
        () => {
          const pushedRoutes = vi
            .mocked(useRouter)
            .mock.results.flatMap((r) => r.value.push.mock.calls.flat());
          expect(pushedRoutes).toContain("/app");
        },
        { timeout: 2000 },
      );
    });
  });
});
