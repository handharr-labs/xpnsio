'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { createSplitBillAction } from './actions/split-bill';
import { BillAmountCalculationServiceImpl } from '@/features/split-bill/domain/services/BillAmountCalculationService';
import type { SplitMode } from '@/features/split-bill/domain/entities/SplitBill';
import type { AdjustmentType, AdjustmentDistribution } from '@/features/split-bill/domain/entities/SplitBillAdjustment';
import { ROUTES } from '@/shared/presentation/navigation/routes';

export type FormStep = 0 | 1 | 2 | 3 | 4;
// 0: bill info + mode
// 1: participants & amounts
// 2: adjustments (optional)
// 3: review
// 4: payment accounts → submit

export interface ParticipantForm {
  localId: string;
  name: string;
  email?: string;
}

export interface ItemForm {
  localId: string;
  name: string;
  price: number;
  assignedParticipantLocalIds: string[];
}

export interface AdjustmentForm {
  localId: string;
  label: string;
  type: AdjustmentType;
  value: number; // percentage × 100 or fixed IDR
  distribution: AdjustmentDistribution;
}

export interface AccountForm {
  localId: string;
  bankName: string;
  accountNumber: string;
}

const calcService = new BillAmountCalculationServiceImpl();

let _idCounter = 0;
const newId = () => `local-${++_idCounter}`;

export function useSplitBillNewViewModel() {
  const router = useRouter();
  const { executeAsync: createBill, isExecuting: isSubmitting } = useAction(createSplitBillAction);
  const [error, setError] = useState<string | null>(null);

  // Step
  const [step, setStep] = useState<FormStep>(0);

  // Step 0: bill info + mode
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');

  // Step 1: participants & amounts
  const [participants, setParticipants] = useState<ParticipantForm[]>([
    { localId: newId(), name: '' },
  ]);
  const [totalAmount, setTotalAmount] = useState(0); // equal mode
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({}); // custom mode
  const [items, setItems] = useState<ItemForm[]>([]); // itemized mode

  // Step 2: adjustments
  const [adjustments, setAdjustments] = useState<AdjustmentForm[]>([]);

  // Step 4: accounts
  const [accounts, setAccounts] = useState<AccountForm[]>([
    { localId: newId(), bankName: '', accountNumber: '' },
  ]);

  // --- Participants helpers ---
  const addParticipant = () =>
    setParticipants((p) => [...p, { localId: newId(), name: '' }]);
  const removeParticipant = (localId: string) =>
    setParticipants((p) => p.filter((x) => x.localId !== localId));
  const updateParticipant = (localId: string, patch: Partial<ParticipantForm>) =>
    setParticipants((p) => p.map((x) => (x.localId === localId ? { ...x, ...patch } : x)));

  // --- Items helpers ---
  const addItem = () =>
    setItems((prev) => [...prev, { localId: newId(), name: '', price: 0, assignedParticipantLocalIds: [] }]);
  const removeItem = (localId: string) =>
    setItems((prev) => prev.filter((x) => x.localId !== localId));
  const updateItem = (localId: string, patch: Partial<ItemForm>) =>
    setItems((prev) => prev.map((x) => (x.localId === localId ? { ...x, ...patch } : x)));
  const toggleItemAssignee = (itemLocalId: string, participantLocalId: string) =>
    setItems((prev) =>
      prev.map((item) => {
        if (item.localId !== itemLocalId) return item;
        const has = item.assignedParticipantLocalIds.includes(participantLocalId);
        return {
          ...item,
          assignedParticipantLocalIds: has
            ? item.assignedParticipantLocalIds.filter((id) => id !== participantLocalId)
            : [...item.assignedParticipantLocalIds, participantLocalId],
        };
      })
    );

  // --- Adjustments helpers ---
  const addAdjustment = () =>
    setAdjustments((a) => [...a, { localId: newId(), label: '', type: 'percentage', value: 0, distribution: 'proportional' }]);
  const removeAdjustment = (localId: string) =>
    setAdjustments((a) => a.filter((x) => x.localId !== localId));
  const updateAdjustment = (localId: string, patch: Partial<AdjustmentForm>) =>
    setAdjustments((a) => a.map((x) => (x.localId === localId ? { ...x, ...patch } : x)));

  // --- Accounts helpers ---
  const addAccount = () =>
    setAccounts((a) => [...a, { localId: newId(), bankName: '', accountNumber: '' }]);
  const removeAccount = (localId: string) =>
    setAccounts((a) => a.filter((x) => x.localId !== localId));
  const updateAccount = (localId: string, patch: Partial<AccountForm>) =>
    setAccounts((a) => a.map((x) => (x.localId === localId ? { ...x, ...patch } : x)));

  // --- Calculate final amounts ---
  const computedFinalAmounts = useCallback((): Record<string, number> => {
    const participantIds = participants.map((p) => p.localId);
    return calcService.calculate({
      splitMode,
      participantIds,
      totalAmount: splitMode === 'equal' ? totalAmount : undefined,
      customAmounts: splitMode === 'custom' ? customAmounts : undefined,
      items: splitMode === 'itemized'
        ? items.map((i) => ({ price: i.price, assignedParticipantIds: i.assignedParticipantLocalIds }))
        : undefined,
      adjustments: adjustments.map((a) => ({ type: a.type, value: a.value, distribution: a.distribution })),
    });
  }, [splitMode, participants, totalAmount, customAmounts, items, adjustments]);

  // --- Submit ---
  const submit = async () => {
    setError(null);
    const finalAmounts = computedFinalAmounts();
    const participantLocalIds = participants.map((p) => p.localId);

    try {
      const result = await createBill({
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        splitMode,
        accounts: accounts
          .filter((a) => a.bankName.trim() && a.accountNumber.trim())
          .map(({ bankName, accountNumber }) => ({ bankName, accountNumber })),
        participants: participants.map((p) => ({
          name: p.name.trim(),
          email: p.email,
          finalAmount: finalAmounts[p.localId] ?? 0,
        })),
        items: items.map((item, i) => ({
          name: item.name.trim(),
          price: item.price,
          orderIndex: i,
          assignedParticipantLocalIds: item.assignedParticipantLocalIds,
        })),
        adjustments: adjustments.map((a, i) => ({
          label: a.label.trim(),
          type: a.type,
          value: a.value,
          distribution: a.distribution,
          orderIndex: i,
        })),
        participantLocalIds,
      });

      if (result?.data?.id) {
        router.push(ROUTES.splitBillManage(result.data.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bill');
    }
  };

  return {
    // Step state
    step, setStep,
    // Bill info
    title, setTitle,
    date, setDate,
    description, setDescription,
    splitMode, setSplitMode,
    // Participants
    participants, addParticipant, removeParticipant, updateParticipant,
    // Amounts
    totalAmount, setTotalAmount,
    customAmounts, setCustomAmounts,
    // Items
    items, addItem, removeItem, updateItem, toggleItemAssignee,
    // Adjustments
    adjustments, addAdjustment, removeAdjustment, updateAdjustment,
    // Accounts
    accounts, addAccount, removeAccount, updateAccount,
    // Computed
    computedFinalAmounts,
    // Submit
    isSubmitting, error, submit,
  };
}
