import { useRouter } from "next/navigation";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockInstance } from "vitest";

import RegisterForm from "../RegisterForm";

function setup() {
  render(<RegisterForm />);

  return {
    nameInput: screen.getByLabelText(/nombre/i),
    emailInput: screen.getByLabelText(/email/i),
    passwordInput: screen.getByLabelText(/contraseña/i),
    acceptTermsCheckbox: screen.getByLabelText(/acepto los/i),
    submitButton: screen.getByRole("button", { name: /registrarse/i }),
  };
}

async function fillValidForm({
  nameInput,
  emailInput,
  passwordInput,
  acceptTermsCheckbox,
}: Awaited<ReturnType<typeof setup>>) {
  await userEvent.type(nameInput, "Juan García");
  await userEvent.type(emailInput, "juan@example.com");
  await userEvent.type(passwordInput, "Contr@s3ña");
  await userEvent.click(acceptTermsCheckbox);
}

describe("RegisterForm", () => {
  it("renders name, email, password, terms checkbox and submit button", () => {
    const {
      nameInput,
      emailInput,
      passwordInput,
      acceptTermsCheckbox,
      submitButton,
    } = setup();

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(acceptTermsCheckbox).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("submit button is disabled when fields are empty", () => {
    const { submitButton } = setup();

    expect(submitButton).toBeDisabled();
  });

  it("submit button is disabled when terms are not accepted", async () => {
    const fields = setup();
    const { submitButton } = fields;

    await userEvent.type(fields.nameInput, "Juan García");
    await userEvent.type(fields.emailInput, "juan@example.com");
    await userEvent.type(fields.passwordInput, "Contr@s3ña");

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

    it("calls POST /api/auth/register with name, email, password and acceptTerms", async () => {
      const fields = setup();

      await fillValidForm(fields);
      await userEvent.click(fields.submitButton);

      expect(fetchSpy).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Juan García",
          email: "juan@example.com",
          plainPassword: "Contr@s3ña",
          acceptTerms: true,
        }),
      });
    });

    it("navigates to /app on success", async () => {
      const fields = setup();

      await fillValidForm(fields);
      await userEvent.click(fields.submitButton);

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
