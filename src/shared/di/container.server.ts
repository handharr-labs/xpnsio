import 'server-only';

// Server-side DI container — singletons via Node.js module cache.

// --- Data Sources ---
import { CategoryDataSourceImpl } from '@/features/categories/data/data-sources/categories/CategoryDataSourceImpl';
import { TransactionDataSourceImpl } from '@/features/transactions/data/data-sources/transactions/TransactionDataSourceImpl';
import { BudgetSettingDataSourceImpl } from '@/features/budget-settings/data/data-sources/budget-settings/BudgetSettingDataSourceImpl';
import { BudgetDataSourceImpl } from '@/features/budget-settings/data/data-sources/budgets/BudgetDataSourceImpl';

// --- Repositories ---
import { CategoryRepositoryImpl } from '@/features/categories/data/repositories/CategoryRepositoryImpl';
import { TransactionRepositoryImpl } from '@/features/transactions/data/repositories/TransactionRepositoryImpl';
import { BudgetSettingRepositoryImpl } from '@/features/budget-settings/data/repositories/BudgetSettingRepositoryImpl';
import { BudgetRepositoryImpl } from '@/features/budget-settings/data/repositories/BudgetRepositoryImpl';

// --- Services ---
import { BudgetComputationServiceImpl } from '@/features/budget-settings/domain/services/BudgetComputationService';

// --- Domain Interfaces ---
import type { CategoryDataSource } from '@/features/categories/data/data-sources/categories/CategoryDataSource';
import type { TransactionDataSource } from '@/features/transactions/data/data-sources/transactions/TransactionDataSource';
import type { BudgetSettingDataSource } from '@/features/budget-settings/data/data-sources/budget-settings/BudgetSettingDataSource';
import type { BudgetDataSource } from '@/features/budget-settings/data/data-sources/budgets/BudgetDataSource';
import type { CategoryRepository } from '@/features/categories/domain/repositories/CategoryRepository';
import type { TransactionRepository } from '@/features/transactions/domain/repositories/TransactionRepository';
import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';
import type { BudgetRepository } from '@/features/budget-settings/domain/repositories/BudgetRepository';
import type { BudgetComputationService } from '@/features/budget-settings/domain/services/BudgetComputationService';

// --- Use Cases: Categories ---
import { GetCategoriesUseCaseImpl } from '@/features/categories/domain/use-cases/categories/GetCategoriesUseCase';
import { CreateCategoryUseCaseImpl } from '@/features/categories/domain/use-cases/categories/CreateCategoryUseCase';
import { UpdateCategoryUseCaseImpl } from '@/features/categories/domain/use-cases/categories/UpdateCategoryUseCase';
import { DeleteCategoryUseCaseImpl } from '@/features/categories/domain/use-cases/categories/DeleteCategoryUseCase';
import type { GetCategoriesUseCase } from '@/features/categories/domain/use-cases/categories/GetCategoriesUseCase';
import type { CreateCategoryUseCase } from '@/features/categories/domain/use-cases/categories/CreateCategoryUseCase';
import type { UpdateCategoryUseCase } from '@/features/categories/domain/use-cases/categories/UpdateCategoryUseCase';
import type { DeleteCategoryUseCase } from '@/features/categories/domain/use-cases/categories/DeleteCategoryUseCase';

// --- Use Cases: Budget Settings ---
import { GetBudgetSettingsUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/GetBudgetSettingsUseCase';
import { CreateBudgetSettingUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/CreateBudgetSettingUseCase';
import { UpdateBudgetSettingUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/UpdateBudgetSettingUseCase';
import { ApplyBudgetSettingUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/ApplyBudgetSettingUseCase';
import { DeleteBudgetSettingUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/DeleteBudgetSettingUseCase';
import type { GetBudgetSettingsUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/GetBudgetSettingsUseCase';
import type { CreateBudgetSettingUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/CreateBudgetSettingUseCase';
import type { UpdateBudgetSettingUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/UpdateBudgetSettingUseCase';
import type { ApplyBudgetSettingUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/ApplyBudgetSettingUseCase';
import type { DeleteBudgetSettingUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/DeleteBudgetSettingUseCase';

// --- Use Cases: Transactions ---
import { GetTransactionsUseCaseImpl } from '@/features/transactions/domain/use-cases/transactions/GetTransactionsUseCase';
import { CreateTransactionUseCaseImpl } from '@/features/transactions/domain/use-cases/transactions/CreateTransactionUseCase';
import { UpdateTransactionUseCaseImpl } from '@/features/transactions/domain/use-cases/transactions/UpdateTransactionUseCase';
import { DeleteTransactionUseCaseImpl } from '@/features/transactions/domain/use-cases/transactions/DeleteTransactionUseCase';
import type { GetTransactionsUseCase } from '@/features/transactions/domain/use-cases/transactions/GetTransactionsUseCase';
import type { CreateTransactionUseCase } from '@/features/transactions/domain/use-cases/transactions/CreateTransactionUseCase';
import type { UpdateTransactionUseCase } from '@/features/transactions/domain/use-cases/transactions/UpdateTransactionUseCase';
import type { DeleteTransactionUseCase } from '@/features/transactions/domain/use-cases/transactions/DeleteTransactionUseCase';

// --- Use Cases: Dashboard ---
import { GetDashboardDataUseCaseImpl } from '@/features/dashboard/domain/use-cases/dashboard/GetDashboardDataUseCase';
import type { GetDashboardDataUseCase } from '@/features/dashboard/domain/use-cases/dashboard/GetDashboardDataUseCase';

// --- Singleton instances (module-level) ---

// Data sources
const categoryDataSource = new CategoryDataSourceImpl();
const transactionDataSource = new TransactionDataSourceImpl();
const budgetSettingDataSource = new BudgetSettingDataSourceImpl();
const budgetDataSource = new BudgetDataSourceImpl();

// Repositories
const categoryRepository = new CategoryRepositoryImpl(categoryDataSource);
const transactionRepository = new TransactionRepositoryImpl(transactionDataSource);
const budgetSettingRepository = new BudgetSettingRepositoryImpl(budgetSettingDataSource);
const budgetRepository = new BudgetRepositoryImpl(budgetDataSource, budgetSettingDataSource);

// Services
const budgetComputationService = new BudgetComputationServiceImpl();

// Use cases: Categories
const getCategoriesUseCase = new GetCategoriesUseCaseImpl(categoryRepository);
const createCategoryUseCase = new CreateCategoryUseCaseImpl(categoryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCaseImpl(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCaseImpl(categoryRepository);

// Use cases: Budget Settings
const getBudgetSettingsUseCase = new GetBudgetSettingsUseCaseImpl(budgetSettingRepository);
const createBudgetSettingUseCase = new CreateBudgetSettingUseCaseImpl(budgetSettingRepository);
const updateBudgetSettingUseCase = new UpdateBudgetSettingUseCaseImpl(budgetSettingRepository);
const applyBudgetSettingUseCase = new ApplyBudgetSettingUseCaseImpl(
  budgetSettingRepository,
  budgetRepository
);
const deleteBudgetSettingUseCase = new DeleteBudgetSettingUseCaseImpl(budgetSettingRepository);

// Use cases: Transactions
const getTransactionsUseCase = new GetTransactionsUseCaseImpl(transactionRepository);
const createTransactionUseCase = new CreateTransactionUseCaseImpl(transactionRepository);
const updateTransactionUseCase = new UpdateTransactionUseCaseImpl(transactionRepository);
const deleteTransactionUseCase = new DeleteTransactionUseCaseImpl(transactionRepository);

// Use cases: Dashboard
const getDashboardDataUseCase = new GetDashboardDataUseCaseImpl(
  budgetRepository,
  transactionRepository,
  budgetComputationService,
  categoryRepository
);

// --- Container ---

export interface ServerContainer {
  // Data sources
  categoryDataSource: CategoryDataSource;
  transactionDataSource: TransactionDataSource;
  budgetSettingDataSource: BudgetSettingDataSource;
  budgetDataSource: BudgetDataSource;

  // Repositories
  categoryRepository: CategoryRepository;
  transactionRepository: TransactionRepository;
  budgetSettingRepository: BudgetSettingRepository;
  budgetRepository: BudgetRepository;

  // Services
  budgetComputationService: BudgetComputationService;

  // Use cases: Categories
  getCategoriesUseCase: GetCategoriesUseCase;
  createCategoryUseCase: CreateCategoryUseCase;
  updateCategoryUseCase: UpdateCategoryUseCase;
  deleteCategoryUseCase: DeleteCategoryUseCase;

  // Use cases: Budget Settings
  getBudgetSettingsUseCase: GetBudgetSettingsUseCase;
  createBudgetSettingUseCase: CreateBudgetSettingUseCase;
  updateBudgetSettingUseCase: UpdateBudgetSettingUseCase;
  applyBudgetSettingUseCase: ApplyBudgetSettingUseCase;
  deleteBudgetSettingUseCase: DeleteBudgetSettingUseCase;

  // Use cases: Transactions
  getTransactionsUseCase: GetTransactionsUseCase;
  createTransactionUseCase: CreateTransactionUseCase;
  updateTransactionUseCase: UpdateTransactionUseCase;
  deleteTransactionUseCase: DeleteTransactionUseCase;

  // Use cases: Dashboard
  getDashboardDataUseCase: GetDashboardDataUseCase;
}

export function createServerContainer(): ServerContainer {
  return {
    // Data sources
    categoryDataSource,
    transactionDataSource,
    budgetSettingDataSource,
    budgetDataSource,

    // Repositories
    categoryRepository,
    transactionRepository,
    budgetSettingRepository,
    budgetRepository,

    // Services
    budgetComputationService,

    // Use cases: Categories
    getCategoriesUseCase,
    createCategoryUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase,

    // Use cases: Budget Settings
    getBudgetSettingsUseCase,
    createBudgetSettingUseCase,
    updateBudgetSettingUseCase,
    applyBudgetSettingUseCase,
    deleteBudgetSettingUseCase,

    // Use cases: Transactions
    getTransactionsUseCase,
    createTransactionUseCase,
    updateTransactionUseCase,
    deleteTransactionUseCase,

    // Use cases: Dashboard
    getDashboardDataUseCase,
  };
}
