import { TripDbDataSourceImpl } from '@/features/trips/data/data-sources/TripDbDataSourceImpl';
import { TripRepositoryImpl } from '@/features/trips/data/repositories/TripRepositoryImpl';
import { CreateTripUseCaseImpl } from '@/features/trips/domain/use-cases/CreateTripUseCase';
import { GetTripDetailUseCaseImpl } from '@/features/trips/domain/use-cases/GetTripDetailUseCase';
import { ListTripsUseCaseImpl } from '@/features/trips/domain/use-cases/ListTripsUseCase';
import { DeleteTripUseCaseImpl } from '@/features/trips/domain/use-cases/DeleteTripUseCase';
import { AddBillsToTripUseCaseImpl } from '@/features/trips/domain/use-cases/AddBillsToTripUseCase';
import { UploadTripSettlementProofUseCaseImpl } from '@/features/trips/domain/use-cases/UploadTripSettlementProofUseCase';
import { UpdateTripSettlementStatusUseCaseImpl } from '@/features/trips/domain/use-cases/UpdateTripSettlementStatusUseCase';
import { GetPublicTripDetailUseCaseImpl } from '@/features/trips/domain/use-cases/GetPublicTripDetailUseCase';

import type { CreateTripUseCase } from '@/features/trips/domain/use-cases/CreateTripUseCase';
import type { GetTripDetailUseCase } from '@/features/trips/domain/use-cases/GetTripDetailUseCase';
import type { ListTripsUseCase } from '@/features/trips/domain/use-cases/ListTripsUseCase';
import type { DeleteTripUseCase } from '@/features/trips/domain/use-cases/DeleteTripUseCase';
import type { AddBillsToTripUseCase } from '@/features/trips/domain/use-cases/AddBillsToTripUseCase';
import type { UploadTripSettlementProofUseCase } from '@/features/trips/domain/use-cases/UploadTripSettlementProofUseCase';
import type { UpdateTripSettlementStatusUseCase } from '@/features/trips/domain/use-cases/UpdateTripSettlementStatusUseCase';
import type { GetPublicTripDetailUseCase } from '@/features/trips/domain/use-cases/GetPublicTripDetailUseCase';

import { SplitBillDbDataSourceImpl } from '@/features/split-bill/data/data-sources/SplitBillDbDataSourceImpl';

// --- Singleton instances (module-level, private) ---

// Data sources
const tripDataSource = new TripDbDataSourceImpl();
const splitBillDataSource = new SplitBillDbDataSourceImpl();

// Repository
const tripRepository = new TripRepositoryImpl(tripDataSource, splitBillDataSource);

// Use cases
const createTripUseCase = new CreateTripUseCaseImpl(tripRepository);
const getTripDetailUseCase = new GetTripDetailUseCaseImpl(tripRepository);
const listTripsUseCase = new ListTripsUseCaseImpl(tripRepository);
const deleteTripUseCase = new DeleteTripUseCaseImpl(tripRepository);
const addBillsToTripUseCase = new AddBillsToTripUseCaseImpl(tripRepository);
const uploadTripSettlementProofUseCase = new UploadTripSettlementProofUseCaseImpl(tripRepository);
const updateTripSettlementStatusUseCase = new UpdateTripSettlementStatusUseCaseImpl(tripRepository);
const getPublicTripDetailUseCase = new GetPublicTripDetailUseCaseImpl(tripRepository);

// --- Container interface ---

export interface TripsContainer {
  createTripUseCase: CreateTripUseCase;
  getTripDetailUseCase: GetTripDetailUseCase;
  getPublicTripDetailUseCase: GetPublicTripDetailUseCase;
  listTripsUseCase: ListTripsUseCase;
  deleteTripUseCase: DeleteTripUseCase;
  addBillsToTripUseCase: AddBillsToTripUseCase;
  uploadTripSettlementProofUseCase: UploadTripSettlementProofUseCase;
  updateTripSettlementStatusUseCase: UpdateTripSettlementStatusUseCase;
}

export function createTripsModule(): TripsContainer {
  return {
    createTripUseCase,
    getTripDetailUseCase,
    getPublicTripDetailUseCase,
    listTripsUseCase,
    deleteTripUseCase,
    addBillsToTripUseCase,
    uploadTripSettlementProofUseCase,
    updateTripSettlementStatusUseCase,
  };
}
