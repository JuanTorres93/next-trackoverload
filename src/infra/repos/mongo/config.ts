import mongoose from 'mongoose';

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

export const MONGODB_URI_DEV = `mongodb+srv://${MONGODB_USERNAME_DEV}:${MONGODB_PASSWORD_DEV}@cluster0.pjn69gs.mongodb.net/?appName=Cluster0`;

export async function getMongooseInstance(uri: string) {
  await mongoose.connect(uri);

  // Init mongo models to avoid errors of creating collection in transaction
  await initMongoModels();
}

export async function getMongooseDevelopmentInstance() {
  if (process.env.NODE_ENV !== 'development')
    throw new InfrastructureError(
      'getMongooseDevelopmentInstance: Not in development environment',
    );

  await getMongooseInstance(MONGODB_URI_DEV);
}

export async function initMongoModels() {
  const models = [
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
