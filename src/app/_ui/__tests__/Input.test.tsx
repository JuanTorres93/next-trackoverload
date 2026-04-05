import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Input from "../Input";

function setup(onChange: (value: string) => void) {
  render(<Input type="number" onChange={(e) => onChange(e.target.value)} />);
  return screen.getByRole("spinbutton");
}

describe("Input", () => {
  it('should process Spanish "," as decimal separator if is number input', async () => {
    const capturedValues: string[] = [];
    const input = setup((v) => capturedValues.push(v));

    await userEvent.type(input, "3,5");

    expect(capturedValues.at(-1)).toBe("3.5");
  });

  it('should process English "." as decimal separator if is number input', async () => {
    const capturedValues: string[] = [];
    const input = setup((v) => capturedValues.push(v));

    await userEvent.type(input, "3.5");

    expect(capturedValues.at(-1)).toBe("3.5");
  });
});
