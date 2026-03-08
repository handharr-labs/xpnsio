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

// --- Use Cases: Categories ---
import { GetCategoriesUseCaseImpl } from '@/domain/use-cases/categories/GetCategoriesUseCase';
import { CreateCategoryUseCaseImpl } from '@/domain/use-cases/categories/CreateCategoryUseCase';
import { UpdateCategoryUseCaseImpl } from '@/domain/use-cases/categories/UpdateCategoryUseCase';
import { DeleteCategoryUseCaseImpl } from '@/domain/use-cases/categories/DeleteCategoryUseCase';

// --- Use Cases: Budget Settings ---
import { GetBudgetSettingsUseCaseImpl } from '@/domain/use-cases/budget-settings/GetBudgetSettingsUseCase';
import { CreateBudgetSettingUseCaseImpl } from '@/domain/use-cases/budget-settings/CreateBudgetSettingUseCase';
import { UpdateBudgetSettingUseCaseImpl } from '@/domain/use-cases/budget-settings/UpdateBudgetSettingUseCase';
import { ApplyBudgetSettingUseCaseImpl } from '@/domain/use-cases/budget-settings/ApplyBudgetSettingUseCase';

// --- Use Cases: Transactions ---
import { GetTransactionsUseCaseImpl } from '@/domain/use-cases/transactions/GetTransactionsUseCase';
import { CreateTransactionUseCaseImpl } from '@/domain/use-cases/transactions/CreateTransactionUseCase';
import { UpdateTransactionUseCaseImpl } from '@/domain/use-cases/transactions/UpdateTransactionUseCase';
import { DeleteTransactionUseCaseImpl } from '@/domain/use-cases/transactions/DeleteTransactionUseCase';

// --- Use Cases: Dashboard ---
import { GetDashboardDataUseCaseImpl } from '@/domain/use-cases/dashboard/GetDashboardDataUseCase';

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
  categoryDataSource: CategoryDataSourceImpl;
  transactionDataSource: TransactionDataSourceImpl;
  budgetSettingDataSource: BudgetSettingDataSourceImpl;
  budgetDataSource: BudgetDataSourceImpl;

  // Repositories
  categoryRepository: CategoryRepositoryImpl;
  transactionRepository: TransactionRepositoryImpl;
  budgetSettingRepository: BudgetSettingRepositoryImpl;
  budgetRepository: BudgetRepositoryImpl;

  // Services
  budgetComputationService: BudgetComputationServiceImpl;

  // Use cases: Categories
  getCategoriesUseCase: GetCategoriesUseCaseImpl;
  createCategoryUseCase: CreateCategoryUseCaseImpl;
  updateCategoryUseCase: UpdateCategoryUseCaseImpl;
  deleteCategoryUseCase: DeleteCategoryUseCaseImpl;

  // Use cases: Budget Settings
  getBudgetSettingsUseCase: GetBudgetSettingsUseCaseImpl;
  createBudgetSettingUseCase: CreateBudgetSettingUseCaseImpl;
  updateBudgetSettingUseCase: UpdateBudgetSettingUseCaseImpl;
  applyBudgetSettingUseCase: ApplyBudgetSettingUseCaseImpl;

  // Use cases: Transactions
  getTransactionsUseCase: GetTransactionsUseCaseImpl;
  createTransactionUseCase: CreateTransactionUseCaseImpl;
  updateTransactionUseCase: UpdateTransactionUseCaseImpl;
  deleteTransactionUseCase: DeleteTransactionUseCaseImpl;

  // Use cases: Dashboard
  getDashboardDataUseCase: GetDashboardDataUseCaseImpl;
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

    // Use cases: Transactions
    getTransactionsUseCase,
    createTransactionUseCase,
    updateTransactionUseCase,
    deleteTransactionUseCase,

    // Use cases: Dashboard
    getDashboardDataUseCase,
  };
}
