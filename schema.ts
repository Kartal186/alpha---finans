import { pgTable, serial, varchar, timestamp, numeric } from "drizzle-orm/pg-core";

export const watchlistTable = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  assetId: varchar("asset_id", { length: 50 }).notNull().unique(),
  assetName: varchar("asset_name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioTable = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  assetId: varchar("asset_id", { length: 50 }).notNull(),
  assetName: varchar("asset_name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  buyPrice: numeric("buy_price", { precision: 20, scale: 6 }).notNull(),
  amount: numeric("amount", { precision: 20, scale: 6 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cosmicSignalsTable = pgTable("cosmic_signals", {
  id: serial("id").primaryKey(),
  assetId: varchar("asset_id", { length: 50 }).notNull(),
  assetName: varchar("asset_name", { length: 100 }).notNull(),
  signalType: varchar("signal_type", { length: 10 }).notNull(), // 'AL' or 'SAT'
  strength: varchar("strength", { length: 10 }).notNull(), // '94%'
  dimension: varchar("dimension", { length: 100 }).notNull(), // 'Kuantum Boyutu' etc
  price: varchar("price", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedbackTable = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userName: varchar("user_name", { length: 100 }),
  message: varchar("message", { length: 1000 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
