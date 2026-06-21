import type { SplitBill } from '@/features/split-bill/domain/entities/SplitBill';
import type { SplitBillDetail } from '@/features/split-bill/domain/entities/SplitBillDetail';
import type { SplitBillParticipant, ParticipantStatus } from '@/features/split-bill/domain/entities/SplitBillParticipant';
import type { SplitBillRepository, CreateSplitBillParams, UpdateSplitBillParams } from '@/features/split-bill/domain/repositories/SplitBillRepository';
import type { SplitBillDbDataSource } from '@/features/split-bill/data/data-sources/SplitBillDbDataSource';
import { SplitBillMapper } from '@/features/split-bill/data/mappers/SplitBillMapper';
import { UnexpectedError } from '@handharr-labs/core';

export class SplitBillRepositoryImpl implements SplitBillRepository {
  private readonly mapper = new SplitBillMapper();

  constructor(private readonly dataSource: SplitBillDbDataSource) {}

  async getById(id: string): Promise<SplitBillDetail | null> {
    try {
      const record = await this.dataSource.findById(id);
      return record ? this.mapper.toDetail(record) : null;
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async getByUserId(userId: string): Promise<SplitBill[]> {
    try {
      const rows = await this.dataSource.findByUserId(userId);
      return rows.map((r) => this.mapper.toBill(r));
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async getStandaloneByUserId(userId: string): Promise<SplitBill[]> {
    try {
      const rows = await this.dataSource.findStandaloneByUserId(userId);
      return rows.map((r) => this.mapper.toBill(r));
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async create(params: CreateSplitBillParams): Promise<SplitBillDetail> {
    try {
      const record = await this.dataSource.createBill({
        userId: params.userId,
        title: params.title,
        description: params.description,
        date: params.date,
        splitMode: params.splitMode,
        accounts: params.accounts,
        participants: params.participants,
        items: params.items,
        adjustments: params.adjustments,
        participantLocalIds: params.participantLocalIds,
      });
      return this.mapper.toDetail(record);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async update(params: UpdateSplitBillParams): Promise<void> {
    try {
      await this.dataSource.updateBill(params);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async delete(billId: string): Promise<void> {
    try {
      await this.dataSource.deleteBill(billId);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async uploadProof(participantId: string, imageUrl: string): Promise<SplitBillParticipant> {
    try {
      const row = await this.dataSource.updateParticipantProof(participantId, imageUrl);
      return this.mapper.toParticipant(row);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async updateParticipantStatus(
    participantId: string,
    status: Extract<ParticipantStatus, 'approved' | 'rejected'>
  ): Promise<SplitBillParticipant> {
    try {
      const row = await this.dataSource.updateParticipantStatus(participantId, status);
      return this.mapper.toParticipant(row);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }
}
