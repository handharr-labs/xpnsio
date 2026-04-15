'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { getSplitBillAction, updateSplitBillAction, getPaymentAccountsAction } from './actions/split-bill';
import { BillAmountCalculationServiceImpl } from '@/features/split-bill/domain/services/BillAmountCalculationService';
import type { SplitMode } from '@/features/split-bill/domain/entities/SplitBill';
import type { AdjustmentType, AdjustmentDistribution } from '@/features/split-bill/domain/entities/SplitBillAdjustment';
import type { ParticipantForm, ItemForm, AdjustmentForm, AccountForm, FormStep } from './useSplitBillNewViewModel';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

const calcService = new BillAmountCalculationServiceImpl();

let _idCounter = 1000; // different range from new vm to avoid collisions
const newId = () => `edit-local-${++_idCounter}`;

export function useSplitBillEditViewModel(billId: string) {
  const router = useRouter();
  const { executeAsync: updateBill, isExecuting: isSubmitting } = useAction(updateSplitBillAction);
  const { executeAsync: fetchBill } = useAction(getSplitBillAction);
  const { executeAsync: fetchPaymentAccounts } = useAction(getPaymentAccountsAction);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingBill, setIsLoadingBill] = useState(true);
  const [currentUserName, setCurrentUserName] = useState<string>('You');

  // Step
  const [step, setStep] = useState<FormStep>(0);

  // Step 0
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');

  // Step 1
  const [participants, setParticipants] = useState<ParticipantForm[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const [items, setItems] = useState<ItemForm[]>([]);

  // Step 2
  const [adjustments, setAdjustments] = useState<AdjustmentForm[]>([]);

  // Step 4
  const [accounts, setAccounts] = useState<AccountForm[]>([]);

  // Load current user on mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name ?? user.email ?? 'You';
        setCurrentUserName(fullName);
      }
    };
    loadCurrentUser();
  }, []);

  // Load existing bill on mount
  useEffect(() => {
    fetchBill({ id: billId })
      .then((result) => {
        const bill = result?.data;
        if (!bill) return;

        setTitle(bill.title);
        setDate(bill.date);
        setDescription(bill.description ?? '');
        setSplitMode(bill.splitMode);

        // Participants: use DB id as localId so item assignment mapping works
        const mappedParticipants: ParticipantForm[] = bill.participants.map((p) => ({
          localId: p.id,
          dbId: p.id,
          name: p.name,
          email: p.email ?? undefined,
          status: p.status,
          isCreator: p.isCreator,
        }));
        setParticipants(mappedParticipants);

        // Derive split-mode-specific state
        if (bill.splitMode === 'equal') {
          setTotalAmount(bill.participants.reduce((sum, p) => sum + p.finalAmount, 0));
        } else if (bill.splitMode === 'custom') {
          const amounts: Record<string, number> = {};
          bill.participants.forEach((p) => { amounts[p.id] = p.finalAmount; });
          setCustomAmounts(amounts);
        } else if (bill.splitMode === 'itemized') {
          setItems(
            bill.items.map((item) => ({
              localId: item.id,
              name: item.name,
              price: item.price,
              // assignedParticipantIds are DB ids, which match participant localIds
              assignedParticipantLocalIds: item.assignedParticipantIds,
            }))
          );
        }

        setAdjustments(
          bill.adjustments.map((a) => ({
            localId: a.id,
            label: a.label,
            type: a.type as AdjustmentType,
            value: a.value,
            distribution: a.distribution as AdjustmentDistribution,
          }))
        );

        setAccounts(
          bill.accounts.map((a) => ({
            localId: a.id,
            bankName: a.bankName,
            accountNumber: a.accountNumber,
          }))
        );
      })
      .finally(() => setIsLoadingBill(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billId]);

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

    try {
      const result = await updateBill({
        billId,
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        splitMode,
        accounts: accounts
          .filter((a) => a.bankName.trim() && a.accountNumber.trim())
          .map(({ bankName, accountNumber }) => ({ bankName, accountNumber })),
        participants: participants.map((p) => ({
          dbId: p.dbId,
          formId: p.localId,
          name: p.isCreator ? 'You' : p.name.trim(),
          email: p.email,
          finalAmount: finalAmounts[p.localId] ?? 0,
          isCreator: p.isCreator,
        })),
        items: items.map((item, i) => ({
          name: item.name.trim(),
          price: item.price,
          orderIndex: i,
          assignedParticipantFormIds: item.assignedParticipantLocalIds,
        })),
        adjustments: adjustments.map((a, i) => ({
          label: a.label.trim(),
          type: a.type,
          value: a.value,
          distribution: a.distribution,
          orderIndex: i,
        })),
      });

      if (result?.data?.billId) {
        router.push(ROUTES.splitBillManage(result.data.billId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };

  return {
    step, setStep,
    title, setTitle,
    date, setDate,
    description, setDescription,
    splitMode, setSplitMode,
    participants, addParticipant, removeParticipant, updateParticipant,
    totalAmount, setTotalAmount,
    customAmounts, setCustomAmounts,
    items, addItem, removeItem, updateItem, toggleItemAssignee,
    adjustments, addAdjustment, removeAdjustment, updateAdjustment,
    accounts, addAccount, removeAccount, updateAccount,
    computedFinalAmounts,
    isSubmitting, isLoadingBill, error, submit,
    submitLabel: 'Save Changes',
  };
}
