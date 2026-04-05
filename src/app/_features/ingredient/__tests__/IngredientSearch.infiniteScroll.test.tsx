import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { mockIngredientApiFetch } from "@/../tests/mocks/ingredientApi";
import {
  createMockIngredients,
  mockIngredientsForIngredientFinder,
} from "@/../tests/mocks/ingredients";

import IngredientSearch from "../IngredientSearch";

await createMockIngredients();

const PAGE_1_RESULTS = mockIngredientsForIngredientFinder.slice(0, 2);
const PAGE_2_RESULTS = mockIngredientsForIngredientFinder.slice(2);

mockIngredientApiFetch({
  fuzzyResolver: (_term, page) => {
    if (page === 1) return PAGE_1_RESULTS;
    if (page === 2) return PAGE_2_RESULTS;
    return [];
  },
});

let observerCallback: IntersectionObserverCallback | null = null;

function setupIntersectionObserverMock() {
  observerCallback = null;

  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn((callback: IntersectionObserverCallback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      };
    }),
  );
}

function triggerBottomReached() {
  observerCallback?.(
    [{ isIntersecting: true }] as IntersectionObserverEntry[],
    {} as IntersectionObserver,
  );
}

async function setup() {
  setupIntersectionObserverMock();
  render(
    <IngredientSearch>
      <IngredientSearch.SearchTermInput />
      <IngredientSearch.SearchButton />
      <IngredientSearch.FoundIngredientsList />
    </IngredientSearch>,
  );

  const searchBar = screen.getByPlaceholderText(/ingred/i);
  const searchButton = screen.getByTestId("search-ingredient-button");

  await userEvent.type(searchBar, "c");
  await userEvent.click(searchButton);

  await screen.findByTestId("ingredient-list");

  return { searchButton };
}

describe("IngredientSearch — infinite scroll", () => {
  it("fetches next page when reaching the end of the list", async () => {
    await setup();
    const ingredientList = screen.getByTestId("ingredient-list");

    expect(ingredientList.children.length).toBe(2);

    triggerBottomReached();

    await waitFor(() => {
      expect(ingredientList.children.length).toBe(3);
    });
  });

  it("preserves the order of existing results when appending the next page", async () => {
    await setup();
    const ingredientList = screen.getByTestId("ingredient-list");

    expect(ingredientList.children[0]).toHaveTextContent("Carrot");
    expect(ingredientList.children[1]).toHaveTextContent("Cabbage");

    triggerBottomReached();

    await waitFor(() => expect(ingredientList.children.length).toBe(3));

    expect(ingredientList.children[0]).toHaveTextContent("Carrot");
    expect(ingredientList.children[1]).toHaveTextContent("Cabbage");
    expect(ingredientList.children[2]).toHaveTextContent("Celery");
  });

  it("stops fetching when the API returns no more results", async () => {
    await setup();
    const ingredientList = screen.getByTestId("ingredient-list");

    // page 2 → 1 more item
    triggerBottomReached();
    await waitFor(() => expect(ingredientList.children.length).toBe(3));

    // page 3 → empty → hasMoreResults becomes false
    triggerBottomReached();
    await waitFor(() => expect(ingredientList.children.length).toBe(3));

    // further triggers should not change anything
    triggerBottomReached();
    await waitFor(() => expect(ingredientList.children.length).toBe(3));
  });

  it("resets to page 1 when a new search is performed", async () => {
    const { searchButton } = await setup();
    const ingredientList = screen.getByTestId("ingredient-list");

    // Load page 2
    triggerBottomReached();
    await waitFor(() => expect(ingredientList.children.length).toBe(3));

    // New search → should unmount and remount the list with page 1 results only
    await userEvent.click(searchButton);

    await waitFor(() => {
      const refreshedList = screen.getByTestId("ingredient-list");
      expect(refreshedList.children.length).toBe(2);
    });

    const refreshedList = screen.getByTestId("ingredient-list");
    expect(refreshedList.children[0]).toHaveTextContent("Carrot");
    expect(refreshedList.children[1]).toHaveTextContent("Cabbage");
  });
});
