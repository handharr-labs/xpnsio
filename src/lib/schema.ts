import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  date,
  integer,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core';

// --- Enums ---

export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const masterCategoryEnum = pgEnum('master_category', ['daily', 'weekly', 'monthly']);

// --- Tables ---

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // references auth.users.id
  email: text('email').notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  currency: text('currency').notNull().default('IDR'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  masterCategory: masterCategoryEnum('master_category').notNull(),
  color: text('color').notNull().default('#6366f1'),
  icon: text('icon').notNull().default('circle'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  description: text('description'),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const budgets = pgTable('budgets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  month: integer('month').notNull(), // 1–12
  year: integer('year').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const budgetSettings = pgTable('budget_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  totalMonthlyBudget: numeric('total_monthly_budget', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('IDR'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const budgetSettingItems = pgTable('budget_setting_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  budgetSettingId: uuid('budget_setting_id')
    .notNull()
    .references(() => budgetSettings.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  monthlyAmount: numeric('monthly_amount', { precision: 12, scale: 2 }).notNull(),
});

export const monthlyBudgetApplications = pgTable(
  'monthly_budget_applications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    budgetSettingId: uuid('budget_setting_id')
      .notNull()
      .references(() => budgetSettings.id, { onDelete: 'cascade' }),
    month: integer('month').notNull(), // 1–12
    year: integer('year').notNull(),
  },
  (t) => [unique('uniq_user_month_year').on(t.userId, t.month, t.year)]
);

// --- Types ---

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
export type BudgetSetting = typeof budgetSettings.$inferSelect;
export type NewBudgetSetting = typeof budgetSettings.$inferInsert;
export type BudgetSettingItem = typeof budgetSettingItems.$inferSelect;
export type NewBudgetSettingItem = typeof budgetSettingItems.$inferInsert;
export type MonthlyBudgetApplication = typeof monthlyBudgetApplications.$inferSelect;
export type NewMonthlyBudgetApplication = typeof monthlyBudgetApplications.$inferInsert;
