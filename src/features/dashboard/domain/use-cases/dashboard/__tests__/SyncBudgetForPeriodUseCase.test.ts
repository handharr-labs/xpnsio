import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncBudgetForPeriodUseCaseImpl } from '../SyncBudgetForPeriodUseCase';
import type { BudgetRepository } from '@/features/budget-settings/domain/repositories/BudgetRepository';
import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';
import type { MonthlyBudgetApplication } from '@/features/budget-settings/domain/entities/Budget';
import type { BudgetSetting } from '@/features/budget-settings/domain/entities/BudgetSetting';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const USER_ID = 'user-abc';
const YEAR = 2026;
const MONTH = 4;

const makeApplication = (overrides?: Partial<MonthlyBudgetApplication>): MonthlyBudgetApplication => ({
  id: 'app-1',
  userId: USER_ID,
  budgetSettingId: 'setting-1',
  year: YEAR,
  month: MONTH,
  ...overrides,
});

const makeSetting = (overrides?: Partial<BudgetSetting>): BudgetSetting => ({
  id: 'setting-1',
  userId: USER_ID,
  name: 'Default',
  totalMonthlyBudget: 5000000,
  currency: 'IDR',
  starterDay: 1,
  createdAt: new Date('2026-01-01'),
  items: [
    {
      id: 'item-1',
      budgetSettingId: 'setting-1',
      categoryId: 'cat-food',
      categoryName: 'Food',
      masterCategory: 'daily',
      monthlyAmount: 1500000,
    },
  ],
  ...overrides,
});

// ─── Mock factories ───────────────────────────────────────────────────────────

const makeBudgetRepository = (): BudgetRepository => ({
  getByMonth: vi.fn(),
  upsertMany: vi.fn(),
  getApplication: vi.fn(),
  getLastApplication: vi.fn(),
  applyBudgetSetting: vi.fn().mockResolvedValue(undefined),
});

const makeBudgetSettingRepository = (): BudgetSettingRepository => ({
  getByUser: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SyncBudgetForPeriodUseCaseImpl', () => {
  let budgetRepo: BudgetRepository;
  let budgetSettingRepo: BudgetSettingRepository;
  let useCase: SyncBudgetForPeriodUseCaseImpl;

  beforeEach(() => {
    budgetRepo = makeBudgetRepository();
    budgetSettingRepo = makeBudgetSettingRepository();
    useCase = new SyncBudgetForPeriodUseCaseImpl(budgetRepo, budgetSettingRepo);
  });

  // ── Case 1: period rolls over — no existing application ──────────────────

  describe('when no application exists for the current period', () => {
    it('carries forward budgets from the last application and writes a new application', async () => {
      const lastApp = makeApplication({ id: 'app-prev', year: YEAR, month: MONTH - 1 });
      const setting = makeSetting();

      vi.mocked(budgetRepo.getApplication).mockResolvedValue(null);
      vi.mocked(budgetRepo.getLastApplication).mockResolvedValue(lastApp);
      vi.mocked(budgetSettingRepo.getById).mockResolvedValue(setting);

      await useCase.execute({ userId: USER_ID, year: YEAR, month: MONTH });

      expect(budgetRepo.getApplication).toHaveBeenCalledWith(USER_ID, YEAR, MONTH);
      expect(budgetRepo.getLastApplication).toHaveBeenCalledWith(USER_ID);
      expect(budgetSettingRepo.getById).toHaveBeenCalledWith(lastApp.budgetSettingId);
      expect(budgetRepo.applyBudgetSetting).toHaveBeenCalledOnce();
      expect(budgetRepo.applyBudgetSetting).toHaveBeenCalledWith(
        USER_ID,
        lastApp.budgetSettingId,
        [{ categoryId: 'cat-food', monthlyAmount: '1500000' }],
        YEAR,
        MONTH
      );
    });
  });

  // ── Case 2: period already applied — budgets must not be touched ─────────

  describe('when an application already exists for the current period', () => {
    it('returns early without writing any budgets or a new application', async () => {
      vi.mocked(budgetRepo.getApplication).mockResolvedValue(makeApplication());

      await useCase.execute({ userId: USER_ID, year: YEAR, month: MONTH });

      expect(budgetRepo.getApplication).toHaveBeenCalledWith(USER_ID, YEAR, MONTH);
      expect(budgetRepo.getLastApplication).not.toHaveBeenCalled();
      expect(budgetSettingRepo.getById).not.toHaveBeenCalled();
      expect(budgetRepo.applyBudgetSetting).not.toHaveBeenCalled();
    });
  });

  // ── Edge case: first-time user, no last application ──────────────────────

  describe('when no application exists for this period and there is no last application', () => {
    it('does not crash and does not write anything', async () => {
      vi.mocked(budgetRepo.getApplication).mockResolvedValue(null);
      vi.mocked(budgetRepo.getLastApplication).mockResolvedValue(null);

      await expect(
        useCase.execute({ userId: USER_ID, year: YEAR, month: MONTH })
      ).resolves.toBeUndefined();

      expect(budgetRepo.applyBudgetSetting).not.toHaveBeenCalled();
      expect(budgetSettingRepo.getById).not.toHaveBeenCalled();
    });
  });

  // ── Edge case: last application references a missing budget setting ───────

  describe('when getLastApplication returns an application but getById returns null', () => {
    it('does not crash and does not write anything', async () => {
      const lastApp = makeApplication({ id: 'app-prev' });

      vi.mocked(budgetRepo.getApplication).mockResolvedValue(null);
      vi.mocked(budgetRepo.getLastApplication).mockResolvedValue(lastApp);
      vi.mocked(budgetSettingRepo.getById).mockResolvedValue(null);

      await expect(
        useCase.execute({ userId: USER_ID, year: YEAR, month: MONTH })
      ).resolves.toBeUndefined();

      expect(budgetRepo.applyBudgetSetting).not.toHaveBeenCalled();
    });
  });
});
