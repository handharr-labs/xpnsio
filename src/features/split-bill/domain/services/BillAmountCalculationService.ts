import type { SplitMode } from '../entities/SplitBill';
import type { AdjustmentType, AdjustmentDistribution } from '../entities/SplitBillAdjustment';

export interface AdjustmentInput {
  type: AdjustmentType;
  value: number; // percentage × 100 (e.g. 1100 = 11%) or fixed IDR
  distribution: AdjustmentDistribution;
}

export interface ItemInput {
  price: number;
  assignedParticipantIds: string[];
}

export interface CalculationInput {
  splitMode: SplitMode;
  participantIds: string[]; // ordered; last gets rounding remainder
  // equal mode
  totalAmount?: number;
  // custom mode
  customAmounts?: Record<string, number>; // participantId → amount
  // itemized mode
  items?: ItemInput[];
  // any mode
  adjustments?: AdjustmentInput[];
}

export interface BillAmountCalculationService {
  calculate(input: CalculationInput): Record<string, number>; // participantId → finalAmount
}

export class BillAmountCalculationServiceImpl implements BillAmountCalculationService {
  calculate(input: CalculationInput): Record<string, number> {
    const { splitMode, participantIds, adjustments = [] } = input;
    const N = participantIds.length;
    if (N === 0) return {};

    const amounts: Record<string, number> = {};

    // --- Base amounts ---
    if (splitMode === 'equal') {
      const total = input.totalAmount ?? 0;
      const share = Math.floor(total / N);
      const remainder = total - share * N;
      participantIds.forEach((id, i) => {
        amounts[id] = i === N - 1 ? share + remainder : share;
      });
    } else if (splitMode === 'custom') {
      const custom = input.customAmounts ?? {};
      participantIds.forEach((id) => {
        amounts[id] = custom[id] ?? 0;
      });
    } else {
      // itemized
      participantIds.forEach((id) => (amounts[id] = 0));
      for (const item of input.items ?? []) {
        const assignees = item.assignedParticipantIds;
        if (assignees.length === 0) continue;
        const share = Math.floor(item.price / assignees.length);
        const remainder = item.price - share * assignees.length;
        assignees.forEach((id, i) => {
          amounts[id] = (amounts[id] ?? 0) + share + (i === 0 ? remainder : 0);
        });
      }
    }

    // --- Adjustments (stacked in order) ---
    for (const adj of adjustments) {
      const currentAmounts = { ...amounts };
      const totalSubtotal = Object.values(currentAmounts).reduce((a, b) => a + b, 0);

      if (adj.type === 'percentage') {
        const factor = adj.value / 10000; // e.g. 1100 / 10000 = 0.11
        if (adj.distribution === 'proportional') {
          participantIds.forEach((id) => {
            amounts[id] += Math.round(currentAmounts[id] * factor);
          });
        } else {
          // equal distribution
          const totalTax = Math.round(totalSubtotal * factor);
          const perPerson = Math.floor(totalTax / N);
          const remainder = totalTax - perPerson * N;
          participantIds.forEach((id, i) => {
            amounts[id] += perPerson + (i === N - 1 ? remainder : 0);
          });
        }
      } else {
        // fixed
        if (adj.distribution === 'proportional') {
          if (totalSubtotal === 0) {
            // fallback to equal if subtotal is zero
            const perPerson = Math.floor(adj.value / N);
            const remainder = adj.value - perPerson * N;
            participantIds.forEach((id, i) => {
              amounts[id] += perPerson + (i === N - 1 ? remainder : 0);
            });
          } else {
            let distributed = 0;
            participantIds.forEach((id, i) => {
              if (i === N - 1) {
                amounts[id] += adj.value - distributed;
              } else {
                const share = Math.round((currentAmounts[id] / totalSubtotal) * adj.value);
                amounts[id] += share;
                distributed += share;
              }
            });
          }
        } else {
          const perPerson = Math.floor(adj.value / N);
          const remainder = adj.value - perPerson * N;
          participantIds.forEach((id, i) => {
            amounts[id] += perPerson + (i === N - 1 ? remainder : 0);
          });
        }
      }
    }

    return amounts;
  }
}
