import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { mockExerciseApiFetch } from "@/../tests/mocks/exerciseApi";
import { mockExercisesForExerciseFinder } from "@/../tests/mocks/exercises";

import ExerciseSearch from "../ExerciseSearch";

const [BENCH_PRESS, INCLINE_BENCH_PRESS, SQUAT] =
  mockExercisesForExerciseFinder;

beforeEach(() => {
  mockExerciseApiFetch();
});

function renderExerciseSearch() {
  render(
    <ExerciseSearch>
      <ExerciseSearch.SearchTermInput />
      <ExerciseSearch.FoundExercisesList />
      <ExerciseSearch.SelectedExercisesList />
    </ExerciseSearch>,
  );

  return {
    searchInput: screen.getByPlaceholderText(/buscar ejercicios/i),
  };
}

async function searchFor(term: string) {
  const { searchInput } = renderExerciseSearch();
  await userEvent.type(searchInput, term);

  return { searchInput };
}

describe("ExerciseSearch — search", () => {
  it("shows matching exercises after searching", async () => {
    await searchFor("bench");

    await screen.findByTestId("exercise-list");

    expect(screen.getByText(BENCH_PRESS.exercise.name)).toBeInTheDocument();
    expect(
      screen.getByText(INCLINE_BENCH_PRESS.exercise.name),
    ).toBeInTheDocument();
  });

  it("does not fetch when the search term is blank", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    const { searchInput } = renderExerciseSearch();

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, " ");

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("ExerciseSearch — selection", () => {
  it("adds the exercise to the selected list with the default sets", async () => {
    await searchFor("squat");
    await screen.findByTestId("exercise-list");

    await userEvent.click(screen.getByText(SQUAT.exercise.name));

    const selectedList = await screen.findByTestId("selected-exercise-list");
    expect(selectedList).toHaveTextContent(SQUAT.exercise.name);

    const setsInput = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(Number(setsInput.value)).toBe(3);
  });

  it("removes the exercise from the selected list when clicked again", async () => {
    await searchFor("squat");
    await screen.findByTestId("exercise-list");

    const exerciseItem = screen.getByText(SQUAT.exercise.name);
    await userEvent.click(exerciseItem);
    await screen.findByTestId("selected-exercise-list");

    await userEvent.click(exerciseItem);

    await waitFor(() => {
      expect(
        screen.queryByTestId("selected-exercise-list"),
      ).not.toBeInTheDocument();
    });
  });

  it("removes the exercise via the remove button in the selected list", async () => {
    await searchFor("squat");
    await screen.findByTestId("exercise-list");

    await userEvent.click(screen.getByText(SQUAT.exercise.name));
    const selectedList = await screen.findByTestId("selected-exercise-list");
    await userEvent.click(within(selectedList).getByRole("button"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("selected-exercise-list"),
      ).not.toBeInTheDocument();
    });
  });

  it("calls onExerciseSelection with the current selection", async () => {
    const onExerciseSelection = vi.fn();

    render(
      <ExerciseSearch onExerciseSelection={onExerciseSelection}>
        <ExerciseSearch.SearchTermInput />
        <ExerciseSearch.FoundExercisesList />
        <ExerciseSearch.SelectedExercisesList />
      </ExerciseSearch>,
    );

    const searchInput = screen.getByPlaceholderText(/buscar ejercicios/i);

    await userEvent.type(searchInput, "squat");

    await screen.findByTestId("exercise-list");

    await userEvent.click(screen.getByText(SQUAT.exercise.name));

    await waitFor(() => {
      expect(onExerciseSelection).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            sets: 3,
            exerciseFinderResult: SQUAT,
          }),
        ]),
      );
    });
  });
});

describe("ExerciseSearch — sets", () => {
  it("updates sets for a selected exercise", async () => {
    await searchFor("squat");
    await screen.findByTestId("exercise-list");

    await userEvent.click(screen.getByText(SQUAT.exercise.name));
    await screen.findByTestId("selected-exercise-list");

    const setsInput = screen.getByRole("spinbutton") as HTMLInputElement;
    await userEvent.clear(setsInput);
    await userEvent.type(setsInput, "5");

    expect(Number(setsInput.value)).toBe(5);
  });
});

describe("ExerciseSearch — infinite scroll", () => {
  const PAGE_1 = mockExercisesForExerciseFinder.slice(0, 2);
  const PAGE_2 = mockExercisesForExerciseFinder.slice(2);

  let observerCallback: IntersectionObserverCallback | null = null;

  beforeEach(() => {
    observerCallback = null;
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback: IntersectionObserverCallback) => {
        observerCallback = callback;
        return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
      }),
    );

    mockExerciseApiFetch({
      fuzzyResolver: (_term, page) => {
        if (page === 1) return PAGE_1;
        if (page === 2) return PAGE_2;
        return [];
      },
    });
  });

  function triggerBottomReached() {
    observerCallback?.(
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
  }

  async function setupWithResults() {
    const { searchInput } = renderExerciseSearch();

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "press");

    await screen.findByTestId("exercise-list");
  }

  it("fetches the next page when reaching the end of the list", async () => {
    await setupWithResults();
    const list = screen.getByTestId("exercise-list");

    expect(list.children).toHaveLength(2);

    triggerBottomReached();

    await waitFor(() => expect(list.children).toHaveLength(3));
  });

  it("preserves existing results when appending the next page", async () => {
    await setupWithResults();
    const list = screen.getByTestId("exercise-list");

    triggerBottomReached();

    await waitFor(() => expect(list.children).toHaveLength(3));

    expect(list.children[0]).toHaveTextContent(PAGE_1[0].exercise.name);
    expect(list.children[1]).toHaveTextContent(PAGE_1[1].exercise.name);
    expect(list.children[2]).toHaveTextContent(PAGE_2[0].exercise.name);
  });

  it("stops fetching when the API returns no more results", async () => {
    await setupWithResults();
    const list = screen.getByTestId("exercise-list");

    triggerBottomReached();
    await waitFor(() => expect(list.children).toHaveLength(3));

    // page 3 → empty
    triggerBottomReached();
    await waitFor(() => expect(list.children).toHaveLength(3));

    // further triggers should not change anything
    triggerBottomReached();
    await waitFor(() => expect(list.children).toHaveLength(3));
  });
});
