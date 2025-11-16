import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/ingredient/fuzzy/:term', (req, res) => {
    const { term } = req.params as { term: string };
    const ingredients = [
      {
        id: '1',
        name: 'Carrot',
        nutritionalInfoPer100g: { calories: 41, protein: 0.9 },
        imageUrl: 'https://example.com/carrot.jpg',
      },
      {
        id: '2',
        name: 'Cabbage',
        nutritionalInfoPer100g: { calories: 25, protein: 1.3 },
        imageUrl: 'https://example.com/cabbage.jpg',
      },
      {
        id: '3',
        name: 'Celery',

        nutritionalInfoPer100g: { calories: 16, protein: 0.7 },
        imageUrl: 'https://example.com/celery.jpg',
      },
    ];

    const filteredIngredients = ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(term.toLowerCase())
    );

    return HttpResponse.json(filteredIngredients);
  }),
];
