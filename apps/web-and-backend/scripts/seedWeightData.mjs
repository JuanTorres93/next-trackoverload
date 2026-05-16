/**
 * Seed script: 90 days of realistic weight data for a user in a healthy cutting phase.
 * Loses ≤ 1% body mass per week (using ~0.5%/week average).
 * Includes ~14 missed days (forgot to track).
 *
 * Run:  node scripts/seedWeightData.mjs
 */

import mongoose from 'mongoose';
import { readFileSync } from 'fs';

// ─── Load .env ────────────────────────────────────────────────────────────────
const envContent = readFileSync('/workspaces/next-trackoverload/.env', 'utf-8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_DB_NAME } = env;
const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.pjn69gs.mongodb.net/${MONGODB_DB_NAME}?appName=Cluster0`;

// ─── Constants ────────────────────────────────────────────────────────────────
const USER_ID = '3a33f6aa-4405-4268-bdcb-eb9174a6243d';
const START_WEIGHT_KG = 85.0; // Starting body weight
const DAYS = 74;

// End date = March 20 2026 (today). Start date = December 20 2025.
const END_DATE = new Date(2026, 2, 20); // month 0-indexed
const START_DATE = new Date(END_DATE);
START_DATE.setDate(END_DATE.getDate() - DAYS + 1);

// ─── PRNG (Mulberry32) — random seed each run ───────────────────────────────
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box–Muller transform: two uniform → one standard-normal sample
function boxMuller(rand) {
  const u1 = Math.max(rand(), 1e-10); // avoid log(0)
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// ─── Generate skipped day indices (realistic clusters) ────────────────────────
function generateSkippedDays(rand, total, skipCount) {
  const skipped = new Set();

  // Add a couple of 2-3 day stretches (holiday weekend, busy week, etc.)
  const clusterStarts = [
    Math.floor(rand() * (total - 3)), // first cluster
    Math.floor(rand() * (total - 3)), // second cluster
  ];
  for (const start of clusterStarts) {
    const len = 2 + Math.floor(rand() * 2); // 2 or 3 days
    for (let j = 0; j < len; j++) skipped.add(start + j);
  }

  // Fill the rest with random individual days
  let attempts = 0;
  while (skipped.size < skipCount && attempts < 1000) {
    skipped.add(Math.floor(rand() * total));
    attempts++;
  }

  return skipped;
}

// ─── Mongoose schema (mirrors DayMongo.ts) ───────────────────────────────────
const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  userId: { type: String, required: true },
  mealIds: { type: [String], required: true, default: [] },
  fakeMealIds: { type: [String], required: true, default: [] },
  userWeightInKg: { type: Number, required: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});
daySchema.index({ userId: 1 });
daySchema.index({ userId: 1, year: 1, month: 1, day: 1 }, { unique: true });

const DayModel = mongoose.models?.Day ?? mongoose.model('Day', daySchema);

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const rand = mulberry32(Date.now());

  // ~15 % missed days (scales with DAYS)
  const skipCount = Math.max(0, Math.floor(DAYS * 0.15));
  const skipped = generateSkippedDays(rand, DAYS, skipCount);

  // 0.5 %/week weekly loss rate → daily rate
  const WEEKLY_LOSS_RATE = 0.005;
  const DAILY_LOSS_RATE = WEEKLY_LOSS_RATE / 7;

  const records = [];

  for (let i = 0; i < DAYS; i++) {
    if (skipped.has(i)) continue; // simulate forgotten day

    const date = new Date(START_DATE);
    date.setDate(START_DATE.getDate() + i);

    // Trend weight: exponential decay at daily rate
    const trend = START_WEIGHT_KG * Math.pow(1 - DAILY_LOSS_RATE, i);

    // Day-of-week effect: slightly heavier after weekends (water retention)
    const dow = date.getDay(); // 0 = Sunday
    const dowBias =
      dow === 1
        ? 0.35 // Monday (post-weekend)
        : dow === 0
          ? 0.2 // Sunday (relaxed eating)
          : 0;

    // Random daily fluctuation ~N(0, 0.7 kg) — hydration, digestion, etc.
    const noise = boxMuller(rand) * 0.7;

    // Small momentum: consecutive high/low days aren't fully independent
    // (already captured by noise being seeded, good enough)

    const rawWeight = trend + noise + dowBias;
    const weight = Math.round(Math.max(rawWeight, 55) * 10) / 10; // 1 decimal, floor 55 kg

    // Simulate the entry being made roughly at 7–9 AM on that day
    const hour = 7 + Math.floor(rand() * 2);
    const minute = Math.floor(rand() * 60);
    const entryDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hour,
      minute,
    );

    records.push({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      userId: USER_ID,
      mealIds: [],
      fakeMealIds: [],
      userWeightInKg: weight,
      createdAt: entryDate,
      updatedAt: entryDate,
    });
  }

  // ── Connect ────────────────────────────────────────────────────────────────
  console.log('Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  // ── Delete all existing Day docs for this user ────────────────────────────
  const { deletedCount } = await DayModel.deleteMany({ userId: USER_ID });
  console.log(`Deleted ${deletedCount} existing documents for user.`);

  // ── Insert fresh records ──────────────────────────────────────────────────
  await DayModel.insertMany(records);

  console.log(`\nDone!`);
  console.log(
    `  Days recorded : ${records.length}  (${DAYS - records.length} skipped/forgotten)`,
  );
  console.log(`  New documents : ${records.length}`);
  console.log(
    `\n  Weight range  : ${Math.min(...records.map((r) => r.userWeightInKg))} – ${Math.max(...records.map((r) => r.userWeightInKg))} kg`,
  );
  console.log(
    `  First entry   : ${records[0].year}-${String(records[0].month).padStart(2, '0')}-${String(records[0].day).padStart(2, '0')} → ${records[0].userWeightInKg} kg`,
  );
  console.log(
    `  Last  entry   : ${records.at(-1).year}-${String(records.at(-1).month).padStart(2, '0')}-${String(records.at(-1).day).padStart(2, '0')} → ${records.at(-1).userWeightInKg} kg`,
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
