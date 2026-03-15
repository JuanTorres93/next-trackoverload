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
import './models/WorkoutLineMongo';
import './models/WorkoutMongo';
import './models/WorkoutTemplateLineMongo';
import './models/WorkoutTemplateMongo';

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

export const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.pjn69gs.mongodb.net/${MONGODB_DB_NAME}?appName=Cluster0`;

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
