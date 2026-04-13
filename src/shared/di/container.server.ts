import 'server-only';

// Server-side DI container — singletons via Node.js module cache.

// --- Data Sources ---
import { CategoryDbDataSourceImpl } from '@/features/categories/data/data-sources/categories/CategoryDbDataSourceImpl';
import { TransactionDbDataSourceImpl } from '@/features/transactions/data/data-sources/transactions/TransactionDbDataSourceImpl';
import { BudgetSettingDbDataSourceImpl } from '@/features/budget-settings/data/data-sources/budget-settings/BudgetSettingDbDataSourceImpl';
import { BudgetDbDataSourceImpl } from '@/features/budget-settings/data/data-sources/budgets/BudgetDbDataSourceImpl';

// --- Repositories ---
import { CategoryRepositoryImpl } from '@/features/categories/data/repositories/CategoryRepositoryImpl';
import { TransactionRepositoryImpl } from '@/features/transactions/data/repositories/TransactionRepositoryImpl';
import { BudgetSettingRepositoryImpl } from '@/features/budget-settings/data/repositories/BudgetSettingRepositoryImpl';
import { BudgetRepositoryImpl } from '@/features/budget-settings/data/repositories/BudgetRepositoryImpl';

// --- Services ---
import { BudgetComputationServiceImpl } from '@/features/budget-settings/data/services/BudgetComputationServiceImpl';
import { BudgetProgressServiceImpl } from '@/features/dashboard/data/services/BudgetProgressServiceImpl';

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
import { GetBudgetSettingByIdUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/GetBudgetSettingByIdUseCase';
import { GetUserOnboardingStatusUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/GetUserOnboardingStatusUseCase';
import { CreateBudgetSettingUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/CreateBudgetSettingUseCase';
import { UpdateBudgetSettingUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/UpdateBudgetSettingUseCase';
import { ApplyBudgetSettingUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/ApplyBudgetSettingUseCase';
import { DeleteBudgetSettingUseCaseImpl } from '@/features/budget-settings/domain/use-cases/budget-settings/DeleteBudgetSettingUseCase';
import type { GetBudgetSettingsUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/GetBudgetSettingsUseCase';
import type { GetBudgetSettingByIdUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/GetBudgetSettingByIdUseCase';
import type { GetUserOnboardingStatusUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/GetUserOnboardingStatusUseCase';
import type { CreateBudgetSettingUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/CreateBudgetSettingUseCase';
import type { UpdateBudgetSettingUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/UpdateBudgetSettingUseCase';
import type { ApplyBudgetSettingUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/ApplyBudgetSettingUseCase';
import type { DeleteBudgetSettingUseCase } from '@/features/budget-settings/domain/use-cases/budget-settings/DeleteBudgetSettingUseCase';

// --- Use Cases: Transactions ---
import { GetTransactionsUseCaseImpl } from '@/features/transactions/domain/use-cases/transactions/GetTransactionsUseCase';
import { GetTransactionByIdUseCaseImpl } from '@/features/transactions/domain/use-cases/transactions/GetTransactionByIdUseCase';
import { CreateTransactionUseCaseImpl } from '@/features/transactions/domain/use-cases/transactions/CreateTransactionUseCase';
import { UpdateTransactionUseCaseImpl } from '@/features/transactions/domain/use-cases/transactions/UpdateTransactionUseCase';
import { DeleteTransactionUseCaseImpl } from '@/features/transactions/domain/use-cases/transactions/DeleteTransactionUseCase';
import type { GetTransactionsUseCase } from '@/features/transactions/domain/use-cases/transactions/GetTransactionsUseCase';
import type { GetTransactionByIdUseCase } from '@/features/transactions/domain/use-cases/transactions/GetTransactionByIdUseCase';
import type { CreateTransactionUseCase } from '@/features/transactions/domain/use-cases/transactions/CreateTransactionUseCase';
import type { UpdateTransactionUseCase } from '@/features/transactions/domain/use-cases/transactions/UpdateTransactionUseCase';
import type { DeleteTransactionUseCase } from '@/features/transactions/domain/use-cases/transactions/DeleteTransactionUseCase';

// --- Split Bill ---
import { SplitBillDbDataSourceImpl } from '@/features/split-bill/data/data-sources/SplitBillDbDataSourceImpl';
import { SplitBillRepositoryImpl } from '@/features/split-bill/data/repositories/SplitBillRepositoryImpl';
import { CreateSplitBillUseCaseImpl } from '@/features/split-bill/domain/use-cases/CreateSplitBillUseCase';
import { GetSplitBillUseCaseImpl } from '@/features/split-bill/domain/use-cases/GetSplitBillUseCase';
import { GetSplitBillsUseCaseImpl } from '@/features/split-bill/domain/use-cases/GetSplitBillsUseCase';
import { UpdateSplitBillUseCaseImpl } from '@/features/split-bill/domain/use-cases/UpdateSplitBillUseCase';
import { UploadPaymentProofUseCaseImpl } from '@/features/split-bill/domain/use-cases/UploadPaymentProofUseCase';
import { UpdateParticipantStatusUseCaseImpl } from '@/features/split-bill/domain/use-cases/UpdateParticipantStatusUseCase';
import { DeleteSplitBillUseCaseImpl } from '@/features/split-bill/domain/use-cases/DeleteSplitBillUseCase';
import type { CreateSplitBillUseCase } from '@/features/split-bill/domain/use-cases/CreateSplitBillUseCase';
import type { GetSplitBillUseCase } from '@/features/split-bill/domain/use-cases/GetSplitBillUseCase';
import type { GetSplitBillsUseCase } from '@/features/split-bill/domain/use-cases/GetSplitBillsUseCase';
import type { UpdateSplitBillUseCase } from '@/features/split-bill/domain/use-cases/UpdateSplitBillUseCase';
import type { UploadPaymentProofUseCase } from '@/features/split-bill/domain/use-cases/UploadPaymentProofUseCase';
import type { UpdateParticipantStatusUseCase } from '@/features/split-bill/domain/use-cases/UpdateParticipantStatusUseCase';
import type { DeleteSplitBillUseCase } from '@/features/split-bill/domain/use-cases/DeleteSplitBillUseCase';

// --- Auth Admin ---
import { AuthAdminRemoteDataSourceImpl } from '@/features/auth/data/data-sources/auth/AuthAdminRemoteDataSourceImpl';
import { AuthAdminRepositoryImpl } from '@/features/auth/data/repositories/AuthAdminRepositoryImpl';
import { DeleteAccountUseCaseImpl } from '@/features/auth/domain/use-cases/auth/DeleteAccountUseCase';
import type { DeleteAccountUseCase } from '@/features/auth/domain/use-cases/auth/DeleteAccountUseCase';
import { UserProfileDbDataSourceImpl } from '@/features/auth/data/data-sources/profile/UserProfileDbDataSourceImpl';
import { UserProfileRepositoryImpl } from '@/features/auth/data/repositories/UserProfileRepositoryImpl';
import { UpsertUserProfileUseCaseImpl } from '@/features/auth/domain/use-cases/auth/UpsertUserProfileUseCase';
import type { UpsertUserProfileUseCase } from '@/features/auth/domain/use-cases/auth/UpsertUserProfileUseCase';

// --- Use Cases: Dashboard ---
import { GetDashboardDataUseCaseImpl } from '@/features/dashboard/domain/use-cases/dashboard/GetDashboardDataUseCase';
import { SyncBudgetForPeriodUseCaseImpl } from '@/features/dashboard/domain/use-cases/dashboard/SyncBudgetForPeriodUseCase';
import type { GetDashboardDataUseCase } from '@/features/dashboard/domain/use-cases/dashboard/GetDashboardDataUseCase';
import type { SyncBudgetForPeriodUseCase } from '@/features/dashboard/domain/use-cases/dashboard/SyncBudgetForPeriodUseCase';

// --- Singleton instances (module-level, private) ---

// Data sources
const categoryDataSource = new CategoryDbDataSourceImpl();
const transactionDataSource = new TransactionDbDataSourceImpl();
const budgetSettingDataSource = new BudgetSettingDbDataSourceImpl();
const budgetDataSource = new BudgetDbDataSourceImpl();

// Repositories
const categoryRepository = new CategoryRepositoryImpl(categoryDataSource);
const transactionRepository = new TransactionRepositoryImpl(transactionDataSource);
const budgetSettingRepository = new BudgetSettingRepositoryImpl(budgetSettingDataSource);
const budgetRepository = new BudgetRepositoryImpl(budgetDataSource);

// Services
const budgetComputationService = new BudgetComputationServiceImpl();
const budgetProgressService = new BudgetProgressServiceImpl();

// Use cases: Categories
const getCategoriesUseCase = new GetCategoriesUseCaseImpl(categoryRepository);
const createCategoryUseCase = new CreateCategoryUseCaseImpl(categoryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCaseImpl(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCaseImpl(categoryRepository);

// Use cases: Budget Settings
const getBudgetSettingsUseCase = new GetBudgetSettingsUseCaseImpl(budgetSettingRepository);
const getBudgetSettingByIdUseCase = new GetBudgetSettingByIdUseCaseImpl(budgetSettingRepository);
const getUserOnboardingStatusUseCase = new GetUserOnboardingStatusUseCaseImpl(budgetSettingRepository);
const createBudgetSettingUseCase = new CreateBudgetSettingUseCaseImpl(budgetSettingRepository);
const updateBudgetSettingUseCase = new UpdateBudgetSettingUseCaseImpl(budgetSettingRepository);
const applyBudgetSettingUseCase = new ApplyBudgetSettingUseCaseImpl(
  budgetSettingRepository,
  budgetRepository
);
const deleteBudgetSettingUseCase = new DeleteBudgetSettingUseCaseImpl(budgetSettingRepository);

// Use cases: Transactions
const getTransactionsUseCase = new GetTransactionsUseCaseImpl(transactionRepository);
const getTransactionByIdUseCase = new GetTransactionByIdUseCaseImpl(transactionRepository);
const createTransactionUseCase = new CreateTransactionUseCaseImpl(transactionRepository);
const updateTransactionUseCase = new UpdateTransactionUseCaseImpl(transactionRepository);
const deleteTransactionUseCase = new DeleteTransactionUseCaseImpl(transactionRepository);

// Split Bill
const splitBillDataSource = new SplitBillDbDataSourceImpl();
const splitBillRepository = new SplitBillRepositoryImpl(splitBillDataSource);
const createSplitBillUseCase = new CreateSplitBillUseCaseImpl(splitBillRepository);
const getSplitBillUseCase = new GetSplitBillUseCaseImpl(splitBillRepository);
const getSplitBillsUseCase = new GetSplitBillsUseCaseImpl(splitBillRepository);
const updateSplitBillUseCase = new UpdateSplitBillUseCaseImpl(splitBillRepository);
const uploadPaymentProofUseCase = new UploadPaymentProofUseCaseImpl(splitBillRepository);
const updateParticipantStatusUseCase = new UpdateParticipantStatusUseCaseImpl(splitBillRepository);
const deleteSplitBillUseCase = new DeleteSplitBillUseCaseImpl(splitBillRepository);

// Auth admin
const authAdminDataSource = new AuthAdminRemoteDataSourceImpl();
const authAdminRepository = new AuthAdminRepositoryImpl(authAdminDataSource);
const deleteAccountUseCase = new DeleteAccountUseCaseImpl(authAdminRepository);

// User profile
const userProfileDataSource = new UserProfileDbDataSourceImpl();
const userProfileRepository = new UserProfileRepositoryImpl(userProfileDataSource);
const upsertUserProfileUseCase = new UpsertUserProfileUseCaseImpl(userProfileRepository);

// Use cases: Dashboard
const syncBudgetForPeriodUseCase = new SyncBudgetForPeriodUseCaseImpl(
  budgetRepository,
  budgetSettingRepository
);
const getDashboardDataUseCase = new GetDashboardDataUseCaseImpl(
  budgetRepository,
  transactionRepository,
  budgetComputationService,
  categoryRepository,
  budgetSettingRepository,
  budgetProgressService
);

// --- Container ---

export interface ServerContainer {
  // Use cases: Categories
  getCategoriesUseCase: GetCategoriesUseCase;
  createCategoryUseCase: CreateCategoryUseCase;
  updateCategoryUseCase: UpdateCategoryUseCase;
  deleteCategoryUseCase: DeleteCategoryUseCase;

  // Use cases: Budget Settings
  getBudgetSettingsUseCase: GetBudgetSettingsUseCase;
  getBudgetSettingByIdUseCase: GetBudgetSettingByIdUseCase;
  getUserOnboardingStatusUseCase: GetUserOnboardingStatusUseCase;
  createBudgetSettingUseCase: CreateBudgetSettingUseCase;
  updateBudgetSettingUseCase: UpdateBudgetSettingUseCase;
  applyBudgetSettingUseCase: ApplyBudgetSettingUseCase;
  deleteBudgetSettingUseCase: DeleteBudgetSettingUseCase;

  // Use cases: Transactions
  getTransactionsUseCase: GetTransactionsUseCase;
  getTransactionByIdUseCase: GetTransactionByIdUseCase;
  createTransactionUseCase: CreateTransactionUseCase;
  updateTransactionUseCase: UpdateTransactionUseCase;
  deleteTransactionUseCase: DeleteTransactionUseCase;

  // Use cases: Dashboard
  syncBudgetForPeriodUseCase: SyncBudgetForPeriodUseCase;
  getDashboardDataUseCase: GetDashboardDataUseCase;

  // Auth admin
  deleteAccountUseCase: DeleteAccountUseCase;

  // User profile
  upsertUserProfileUseCase: UpsertUserProfileUseCase;

  // Split Bill
  createSplitBillUseCase: CreateSplitBillUseCase;
  getSplitBillUseCase: GetSplitBillUseCase;
  getSplitBillsUseCase: GetSplitBillsUseCase;
  updateSplitBillUseCase: UpdateSplitBillUseCase;
  uploadPaymentProofUseCase: UploadPaymentProofUseCase;
  updateParticipantStatusUseCase: UpdateParticipantStatusUseCase;
  deleteSplitBillUseCase: DeleteSplitBillUseCase;
}

export function createServerContainer(): ServerContainer {
  return {
    // Use cases: Categories
    getCategoriesUseCase,
    createCategoryUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase,

    // Use cases: Budget Settings
    getBudgetSettingsUseCase,
    getBudgetSettingByIdUseCase,
    getUserOnboardingStatusUseCase,
    createBudgetSettingUseCase,
    updateBudgetSettingUseCase,
    applyBudgetSettingUseCase,
    deleteBudgetSettingUseCase,

    // Use cases: Transactions
    getTransactionsUseCase,
    getTransactionByIdUseCase,
    createTransactionUseCase,
    updateTransactionUseCase,
    deleteTransactionUseCase,

    // Use cases: Dashboard
    syncBudgetForPeriodUseCase,
    getDashboardDataUseCase,

    // Auth admin
    deleteAccountUseCase,

    // User profile
    upsertUserProfileUseCase,

    // Split Bill
    createSplitBillUseCase,
    getSplitBillUseCase,
    getSplitBillsUseCase,
    updateSplitBillUseCase,
    uploadPaymentProofUseCase,
    updateParticipantStatusUseCase,
    deleteSplitBillUseCase,
  };
}
