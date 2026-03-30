import { renderHook, act } from '@testing-library/react';
import { useRecipeSearch } from '../useRecipeSearch';
import { createMockRecipes } from '../../../../../tests/mocks/recipes';

const { mockRecipes } = await createMockRecipes();

describe('useRecipeSearch', () => {
  it('returns all recipes when query is empty', () => {
    const { result } = renderHook(() => useRecipeSearch(mockRecipes));

    expect(result.current.filteredRecipes).toHaveLength(mockRecipes.length);
  });

  it('filters recipes by name', () => {
    const { result } = renderHook(() => useRecipeSearch(mockRecipes));
    const firstName = mockRecipes[0].name;

    act(() => {
      result.current.setQuery(firstName);
    });

    expect(result.current.filteredRecipes.length).toBeGreaterThan(0);
    expect(result.current.filteredRecipes[0].name).toBe(firstName);
  });

  it('returns empty array when no recipe matches', () => {
    const { result } = renderHook(() => useRecipeSearch(mockRecipes));

    act(() => {
      result.current.setQuery('xyzzy_no_match_12345');
    });

    expect(result.current.filteredRecipes).toHaveLength(0);
  });

  it('resets to all recipes when query is cleared', () => {
    const { result } = renderHook(() => useRecipeSearch(mockRecipes));

    act(() => {
      result.current.setQuery('car');
    });

    act(() => {
      result.current.setQuery('');
    });

    expect(result.current.filteredRecipes).toHaveLength(mockRecipes.length);
  });
});
