import 'server-only';

// Server-side DI container — singletons via Node.js module cache.

// --- Data Sources ---
import { CategoryDataSourceImpl } from '@/data/data-sources/categories/CategoryDataSourceImpl';
import { TransactionDataSourceImpl } from '@/data/data-sources/transactions/TransactionDataSourceImpl';
import { BudgetSettingDataSourceImpl } from '@/data/data-sources/budget-settings/BudgetSettingDataSourceImpl';
import { BudgetDataSourceImpl } from '@/data/data-sources/budgets/BudgetDataSourceImpl';

// --- Repositories ---
import { CategoryRepositoryImpl } from '@/data/repositories/CategoryRepositoryImpl';
import { TransactionRepositoryImpl } from '@/data/repositories/TransactionRepositoryImpl';
import { BudgetSettingRepositoryImpl } from '@/data/repositories/BudgetSettingRepositoryImpl';
import { BudgetRepositoryImpl } from '@/data/repositories/BudgetRepositoryImpl';

// --- Services ---
import { BudgetComputationServiceImpl } from '@/domain/services/BudgetComputationService';

// --- Domain Interfaces ---
import type { CategoryDataSource } from '@/data/data-sources/categories/CategoryDataSource';
import type { TransactionDataSource } from '@/data/data-sources/transactions/TransactionDataSource';
import type { BudgetSettingDataSource } from '@/data/data-sources/budget-settings/BudgetSettingDataSource';
import type { BudgetDataSource } from '@/data/data-sources/budgets/BudgetDataSource';
import type { CategoryRepository } from '@/domain/repositories/CategoryRepository';
import type { TransactionRepository } from '@/domain/repositories/TransactionRepository';
import type { BudgetSettingRepository } from '@/domain/repositories/BudgetSettingRepository';
import type { BudgetRepository } from '@/domain/repositories/BudgetRepository';
import type { BudgetComputationService } from '@/domain/services/BudgetComputationService';

// --- Use Cases: Categories ---
import { GetCategoriesUseCaseImpl } from '@/domain/use-cases/categories/GetCategoriesUseCase';
import { CreateCategoryUseCaseImpl } from '@/domain/use-cases/categories/CreateCategoryUseCase';
import { UpdateCategoryUseCaseImpl } from '@/domain/use-cases/categories/UpdateCategoryUseCase';
import { DeleteCategoryUseCaseImpl } from '@/domain/use-cases/categories/DeleteCategoryUseCase';
import type { GetCategoriesUseCase } from '@/domain/use-cases/categories/GetCategoriesUseCase';
import type { CreateCategoryUseCase } from '@/domain/use-cases/categories/CreateCategoryUseCase';
import type { UpdateCategoryUseCase } from '@/domain/use-cases/categories/UpdateCategoryUseCase';
import type { DeleteCategoryUseCase } from '@/domain/use-cases/categories/DeleteCategoryUseCase';

// --- Use Cases: Budget Settings ---
import { GetBudgetSettingsUseCaseImpl } from '@/domain/use-cases/budget-settings/GetBudgetSettingsUseCase';
import { CreateBudgetSettingUseCaseImpl } from '@/domain/use-cases/budget-settings/CreateBudgetSettingUseCase';
import { UpdateBudgetSettingUseCaseImpl } from '@/domain/use-cases/budget-settings/UpdateBudgetSettingUseCase';
import { ApplyBudgetSettingUseCaseImpl } from '@/domain/use-cases/budget-settings/ApplyBudgetSettingUseCase';
import { DeleteBudgetSettingUseCaseImpl } from '@/domain/use-cases/budget-settings/DeleteBudgetSettingUseCase';
import type { GetBudgetSettingsUseCase } from '@/domain/use-cases/budget-settings/GetBudgetSettingsUseCase';
import type { CreateBudgetSettingUseCase } from '@/domain/use-cases/budget-settings/CreateBudgetSettingUseCase';
import type { UpdateBudgetSettingUseCase } from '@/domain/use-cases/budget-settings/UpdateBudgetSettingUseCase';
import type { ApplyBudgetSettingUseCase } from '@/domain/use-cases/budget-settings/ApplyBudgetSettingUseCase';
import type { DeleteBudgetSettingUseCase } from '@/domain/use-cases/budget-settings/DeleteBudgetSettingUseCase';

// --- Use Cases: Transactions ---
import { GetTransactionsUseCaseImpl } from '@/domain/use-cases/transactions/GetTransactionsUseCase';
import { CreateTransactionUseCaseImpl } from '@/domain/use-cases/transactions/CreateTransactionUseCase';
import { UpdateTransactionUseCaseImpl } from '@/domain/use-cases/transactions/UpdateTransactionUseCase';
import { DeleteTransactionUseCaseImpl } from '@/domain/use-cases/transactions/DeleteTransactionUseCase';
import type { GetTransactionsUseCase } from '@/domain/use-cases/transactions/GetTransactionsUseCase';
import type { CreateTransactionUseCase } from '@/domain/use-cases/transactions/CreateTransactionUseCase';
import type { UpdateTransactionUseCase } from '@/domain/use-cases/transactions/UpdateTransactionUseCase';
import type { DeleteTransactionUseCase } from '@/domain/use-cases/transactions/DeleteTransactionUseCase';

// --- Use Cases: Dashboard ---
import { GetDashboardDataUseCaseImpl } from '@/domain/use-cases/dashboard/GetDashboardDataUseCase';
import type { GetDashboardDataUseCase } from '@/domain/use-cases/dashboard/GetDashboardDataUseCase';

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
