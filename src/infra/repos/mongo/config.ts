import mongoose from 'mongoose';

import './models/DayMongo';
import './models/ExerciseMongo';
import './models/ExternalIngredientRefMongo';
import './models/FakeMealMongo';
import './models/IngredientMongo';
import './models/MealLineMongo';
import './models/MealMongo';
import './models/RecipeLineMongo';
import './models/RecipeMongo';
import './models/UserMongo';
import './models/WorkoutMongo';
import './models/WorkoutLineMongo';
import './models/WorkoutTemplateMongo';
import './models/WorkoutTemplateLineMongo';

import { InfrastructureError } from '../../../domain/common/errors';

const MONGODB_USERNAME_DEV = process.env.MONGODB_USERNAME_DEV;
const MONGODB_PASSWORD_DEV = process.env.MONGODB_PASSWORD_DEV;
const MONGODB_DB_NAME_DEV = process.env.MONGODB_DB_NAME_DEV;

export const MONGODB_URI_DEV = `mongodb+srv://${MONGODB_USERNAME_DEV}:${MONGODB_PASSWORD_DEV}@cluster0.pjn69gs.mongodb.net/${MONGODB_DB_NAME_DEV}?appName=Cluster0`;

// Prevent multiple connections in development when Next.js does hot reload
// Use global so the promise persists across recompilations
declare global {
  var mongooseConnectionPromise: Promise<void> | undefined;
}

export async function startMongooseConnection(uri: string) {
  // If a connection promise already exists in global, reuse it
  if (global.mongooseConnectionPromise) {
    return global.mongooseConnectionPromise;
  }

  // Create a new promise and store it in global
  global.mongooseConnectionPromise = (async () => {
    await mongoose.connect(uri);
    // Init mongo models to avoid errors of creating collection in transaction
    await initMongoModels();
  })();

  return global.mongooseConnectionPromise;
}

export async function getMongooseDevelopmentInstance() {
  if (process.env.NODE_ENV !== 'development')
    throw new InfrastructureError(
      'getMongooseDevelopmentInstance: Not in development environment',
    );

  await startMongooseConnection(MONGODB_URI_DEV);
}

export async function initMongoModels() {
  const models = [
    mongoose.model('Day'),
    mongoose.model('Exercise'),
    mongoose.model('ExternalIngredientRef'),
    mongoose.model('FakeMeal'),
    mongoose.model('Ingredient'),
    mongoose.model('MealLine'),
    mongoose.model('Meal'),
    mongoose.model('RecipeLine'),
    mongoose.model('Recipe'),
    mongoose.model('User'),
    mongoose.model('Workout'),
    mongoose.model('WorkoutLine'),
    mongoose.model('WorkoutTemplate'),
    mongoose.model('WorkoutTemplateLine'),
  ];

  for (const model of models) {
    await model.init();
  }
}
