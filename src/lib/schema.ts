import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  date,
  integer,
  boolean,
  pgEnum,
  unique,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';

// --- Enums ---

export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const masterCategoryEnum = pgEnum('master_category', ['daily', 'weekly', 'monthly']);
export const splitModeEnum = pgEnum('split_mode', ['equal', 'custom', 'itemized']);
export const participantStatusEnum = pgEnum('participant_status', ['pending', 'proof_uploaded', 'approved', 'rejected']);
export const adjustmentTypeEnum = pgEnum('adjustment_type', ['percentage', 'fixed']);
export const adjustmentDistributionEnum = pgEnum('adjustment_distribution', ['proportional', 'equal']);

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

export const budgets = pgTable(
  'budgets',
  {
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
  },
  (t) => [unique('uniq_budget_user_category_month_year').on(t.userId, t.categoryId, t.year, t.month)]
);

export const budgetSettings = pgTable('budget_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  totalMonthlyBudget: numeric('total_monthly_budget', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('IDR'),
  starterDay: integer('starter_day').notNull().default(1),
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

// --- Split Bill Tables ---

export const splitBills = pgTable('split_bills', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  tripId: uuid('trip_id').references(() => trips.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  date: date('date').notNull(),
  splitMode: splitModeEnum('split_mode').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const splitBillAccounts = pgTable('split_bill_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  billId: uuid('bill_id')
    .notNull()
    .references(() => splitBills.id, { onDelete: 'cascade' }),
  bankName: text('bank_name').notNull(),
  accountNumber: text('account_number').notNull(),
});

export const splitBillParticipants = pgTable('split_bill_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  billId: uuid('bill_id')
    .notNull()
    .references(() => splitBills.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email'),
  finalAmount: integer('final_amount').notNull(),
  status: participantStatusEnum('status').notNull().default('pending'),
  isCreator: boolean('is_creator').notNull().default(false),
  proofImageUrl: text('proof_image_url'),
  proofUploadedAt: timestamp('proof_uploaded_at'),
  approvedAt: timestamp('approved_at'),
});

export const splitBillItems = pgTable('split_bill_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  billId: uuid('bill_id')
    .notNull()
    .references(() => splitBills.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
});

export const splitBillItemAssignments = pgTable(
  'split_bill_item_assignments',
  {
    itemId: uuid('item_id')
      .notNull()
      .references(() => splitBillItems.id, { onDelete: 'cascade' }),
    participantId: uuid('participant_id')
      .notNull()
      .references(() => splitBillParticipants.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.itemId, t.participantId] })]
);

export const splitBillAdjustments = pgTable('split_bill_adjustments', {
  id: uuid('id').defaultRandom().primaryKey(),
  billId: uuid('bill_id')
    .notNull()
    .references(() => splitBills.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  type: adjustmentTypeEnum('type').notNull(),
  value: integer('value').notNull(),
  distribution: adjustmentDistributionEnum('distribution').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
});

// --- Payment Accounts Table ---

export const paymentAccounts = pgTable(
  'payment_accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    bankName: text('bank_name').notNull(),
    accountNumber: text('account_number').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [{ userIdIdx: index('idx_payment_accounts_user_id').on(t.userId) }]
);

// --- Trips Tables ---

export const trips = pgTable('trips', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tripParticipantSettlements = pgTable('trip_participant_settlements', {
  id: uuid('id').defaultRandom().primaryKey(),
  tripId: uuid('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  participantName: text('participant_name').notNull(),
  participantEmail: text('participant_email'),
  totalNetAmount: integer('total_net_amount').notNull(),
  proofImageUrl: text('proof_image_url'),
  status: text('status').notNull().default('pending'),
  proofUploadedAt: timestamp('proof_uploaded_at'),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

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

export type SplitBillRow = typeof splitBills.$inferSelect;
export type NewSplitBill = typeof splitBills.$inferInsert;
export type SplitBillAccountRow = typeof splitBillAccounts.$inferSelect;
export type SplitBillParticipantRow = typeof splitBillParticipants.$inferSelect;
export type SplitBillItemRow = typeof splitBillItems.$inferSelect;
export type SplitBillItemAssignmentRow = typeof splitBillItemAssignments.$inferSelect;
export type SplitBillAdjustmentRow = typeof splitBillAdjustments.$inferSelect;

export type PaymentAccountRow = typeof paymentAccounts.$inferSelect;
export type NewPaymentAccount = typeof paymentAccounts.$inferInsert;

export type TripRow = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
export type TripParticipantSettlementRow = typeof tripParticipantSettlements.$inferSelect;
export type NewTripParticipantSettlement = typeof tripParticipantSettlements.$inferInsert;
