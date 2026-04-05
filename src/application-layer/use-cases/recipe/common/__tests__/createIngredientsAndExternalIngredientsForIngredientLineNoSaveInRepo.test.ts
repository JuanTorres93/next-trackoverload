import { beforeEach, describe, expect, it } from "vitest";

import { MemoryExternalIngredientsRefRepo } from "@/infra/repos/memory/MemoryExternalIngredientsRefRepo";
import { MemoryIngredientsRepo } from "@/infra/repos/memory/MemoryIngredientsRepo";
import { Uuidv4IdGenerator } from "@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator";

import * as externalIngredientRefTestProps from "../../../../../../tests/createProps/externalIngredientRefTestProps";
import * as ingredientTestProps from "../../../../../../tests/createProps/ingredientTestProps";
import {
  CreateIngredientLineData,
  createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo,
} from "../createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo";

describe("createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo", () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let externalIngredientsRefRepo: MemoryExternalIngredientsRefRepo;

  const idGenerator = new Uuidv4IdGenerator();

  const newIngredientLineInfo: CreateIngredientLineData = {
    externalIngredientId: "ext-ing-new",
    source: "openfoodfacts",
    name: "Chicken Breast",
    caloriesPer100g: 165,
    proteinPer100g: 31,
    quantityInGrams: 250,
  };

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    externalIngredientsRefRepo = new MemoryExternalIngredientsRefRepo();
  });

  describe("when the ingredient does not exist yet", () => {
    it("should create a new ingredient and external ingredient ref", async () => {
      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [newIngredientLineInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      expect(Object.keys(result.createdIngredients)).toHaveLength(1);
      expect(Object.keys(result.createdExternalIngredients)).toHaveLength(1);
      expect(result.existingIngredients).toHaveLength(0);
      expect(result.fetchedExternalIngredients).toHaveLength(0);
    });

    it("should link the created ingredient and its external ref with the same ingredientId", async () => {
      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [newIngredientLineInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      const createdIngredient =
        result.createdIngredients[newIngredientLineInfo.externalIngredientId];
      const createdExternalRef =
        result.createdExternalIngredients[
          newIngredientLineInfo.externalIngredientId
        ];

      expect(createdIngredient.id).toBe(createdExternalRef.ingredientId);
      expect(createdIngredient.name).toBe(newIngredientLineInfo.name);
      expect(createdExternalRef.externalId).toBe(
        newIngredientLineInfo.externalIngredientId,
      );
      expect(createdExternalRef.source).toBe(newIngredientLineInfo.source);
    });

    it("should store nutritional info on the created ingredient", async () => {
      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [newIngredientLineInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      const createdIngredient =
        result.createdIngredients[newIngredientLineInfo.externalIngredientId];

      expect(createdIngredient.nutritionalInfoPer100g.calories).toBe(
        newIngredientLineInfo.caloriesPer100g,
      );
      expect(createdIngredient.nutritionalInfoPer100g.protein).toBe(
        newIngredientLineInfo.proteinPer100g,
      );
    });

    it("should populate quantitiesMapByExternalId for the created ingredient", async () => {
      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [newIngredientLineInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      const quantity =
        result.quantitiesMapByExternalId[
          newIngredientLineInfo.externalIngredientId
        ];

      expect(quantity).toBeDefined();
      expect(quantity.quantityInGrams).toBe(
        newIngredientLineInfo.quantityInGrams,
      );
    });

    it("should include the created ingredient in allIngredients", async () => {
      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [newIngredientLineInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      expect(result.allIngredients).toHaveLength(1);
      expect(result.allIngredients[0].name).toBe(newIngredientLineInfo.name);
    });

    it("should create multiple new ingredients when none exist", async () => {
      const secondIngredientLineInfo: CreateIngredientLineData = {
        externalIngredientId: "ext-ing-new-2",
        source: "openfoodfacts",
        name: "Brown Rice",
        caloriesPer100g: 130,
        proteinPer100g: 3,
        quantityInGrams: 100,
      };

      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [newIngredientLineInfo, secondIngredientLineInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      expect(Object.keys(result.createdIngredients)).toHaveLength(2);
      expect(Object.keys(result.createdExternalIngredients)).toHaveLength(2);
      expect(result.allIngredients).toHaveLength(2);
    });
  });

  describe("when the ingredient already exists", () => {
    beforeEach(async () => {
      const existingIngredient = ingredientTestProps.createTestIngredient();

      const existingExternalRef =
        externalIngredientRefTestProps.createTestExternalIngredientRef({
          ingredientId: existingIngredient.id,
        });

      await ingredientsRepo.saveIngredient(existingIngredient);
      await externalIngredientsRefRepo.save(existingExternalRef);
    });

    it("should return existing ingredient without creating new ones", async () => {
      const existingInfo: CreateIngredientLineData = {
        externalIngredientId:
          externalIngredientRefTestProps.validExternalIngredientRefProps
            .externalId,

        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,

        name: "Does not matter",
        caloriesPer100g: 0,
        proteinPer100g: 0,
        quantityInGrams: 100,
      };

      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [existingInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      expect(result.existingIngredients).toHaveLength(1);
      expect(result.fetchedExternalIngredients).toHaveLength(1);
      expect(Object.keys(result.createdIngredients)).toHaveLength(0);
      expect(Object.keys(result.createdExternalIngredients)).toHaveLength(0);
    });

    it("should populate quantitiesMapByExternalId for the existing ingredient", async () => {
      const existingInfo: CreateIngredientLineData = {
        externalIngredientId:
          externalIngredientRefTestProps.validExternalIngredientRefProps
            .externalId,

        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,

        name: "Does not matter",
        caloriesPer100g: 0,
        proteinPer100g: 0,
        quantityInGrams: 200,
      };

      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [existingInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      const quantity =
        result.quantitiesMapByExternalId[existingInfo.externalIngredientId];

      expect(quantity).toBeDefined();
      expect(quantity.quantityInGrams).toBe(200);
    });

    it("should include existing ingredient in allIngredients", async () => {
      const existingInfo: CreateIngredientLineData = {
        externalIngredientId:
          externalIngredientRefTestProps.validExternalIngredientRefProps
            .externalId,

        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,

        name: "Does not matter",
        caloriesPer100g: 0,
        proteinPer100g: 0,
        quantityInGrams: 100,
      };

      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [existingInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      expect(result.allIngredients).toHaveLength(1);
    });
  });

  describe("when mixing existing and new ingredients", () => {
    beforeEach(async () => {
      const existingIngredient = ingredientTestProps.createTestIngredient();
      const existingExternalRef =
        externalIngredientRefTestProps.createTestExternalIngredientRef({
          ingredientId: existingIngredient.id,
        });

      await ingredientsRepo.saveIngredient(existingIngredient);
      await externalIngredientsRefRepo.save(existingExternalRef);
    });

    it("should create only the missing ingredients and keep existing ones", async () => {
      const existingInfo: CreateIngredientLineData = {
        externalIngredientId:
          externalIngredientRefTestProps.validExternalIngredientRefProps
            .externalId,

        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,

        name: "Existing ingredient",
        caloriesPer100g: 0,
        proteinPer100g: 0,
        quantityInGrams: 100,
      };

      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [existingInfo, newIngredientLineInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      expect(result.existingIngredients).toHaveLength(1);
      expect(result.fetchedExternalIngredients).toHaveLength(1);
      expect(Object.keys(result.createdIngredients)).toHaveLength(1);
      expect(Object.keys(result.createdExternalIngredients)).toHaveLength(1);
      expect(result.allIngredients).toHaveLength(2);
    });

    it("should populate quantitiesMapByExternalId for both existing and new ingredients", async () => {
      const existingInfo: CreateIngredientLineData = {
        externalIngredientId:
          externalIngredientRefTestProps.validExternalIngredientRefProps
            .externalId,

        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,

        name: "Existing ingredient",
        caloriesPer100g: 0,
        proteinPer100g: 0,
        quantityInGrams: 150,
      };

      const result =
        await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
          [existingInfo, newIngredientLineInfo],
          ingredientsRepo,
          externalIngredientsRefRepo,
          idGenerator,
        );

      expect(
        result.quantitiesMapByExternalId[existingInfo.externalIngredientId]
          .quantityInGrams,
      ).toBe(150);
      expect(
        result.quantitiesMapByExternalId[
          newIngredientLineInfo.externalIngredientId
        ].quantityInGrams,
      ).toBe(newIngredientLineInfo.quantityInGrams);
    });
  });
});
