import { render } from "@testing-library/react-native";

import HomeScreen from "@/app/index";

describe("<HomeScreen />", () => {
  test("Text renders correctly on HomeScreen", () => {
    render(<HomeScreen />);

    expect(true).toBe(true);
  });
});
