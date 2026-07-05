'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Plus, Trash2, Check, Lock } from 'lucide-react';
import { Button, CurrencyInput, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@handharr-labs/forge-ui-uno';
import { formatCurrency } from '@handharr-labs/forge-core';
import type { SplitMode } from '../../domain/entities/SplitBill';
import type { ParticipantForm, ItemForm, AdjustmentForm, AccountForm, FormStep } from '../hooks/useSplitBillNewViewModel';

const STEPS = ['Bill Info', 'Participants', 'Adjustments', 'Review', 'Payment'];

export interface SplitBillFormVm {
  step: FormStep;
  setStep: (step: FormStep) => void;
  title: string;
  setTitle: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  splitMode: SplitMode;
  setSplitMode: (v: SplitMode) => void;
  participants: ParticipantForm[];
  addParticipant: () => void;
  removeParticipant: (localId: string) => void;
  updateParticipant: (localId: string, patch: Partial<ParticipantForm>) => void;
  totalAmount: number;
  setTotalAmount: (v: number) => void;
  customAmounts: Record<string, number>;
  setCustomAmounts: (updater: (prev: Record<string, number>) => Record<string, number>) => void;
  items: ItemForm[];
  addItem: () => void;
  removeItem: (localId: string) => void;
  updateItem: (localId: string, patch: Partial<ItemForm>) => void;
  toggleItemAssignee: (itemLocalId: string, participantLocalId: string) => void;
  adjustments: AdjustmentForm[];
  addAdjustment: () => void;
  removeAdjustment: (localId: string) => void;
  updateAdjustment: (localId: string, patch: Partial<AdjustmentForm>) => void;
  accounts: AccountForm[];
  addAccount: () => void;
  removeAccount: (localId: string) => void;
  updateAccount: (localId: string, patch: Partial<AccountForm>) => void;
  computedFinalAmounts: () => Record<string, number>;
  isSubmitting: boolean;
  isLoadingBill?: boolean;
  error: string | null;
  submit: () => void;
  submitLabel?: string;
}

export function SplitBillFormView({ vm }: { vm: SplitBillFormVm }) {
  const router = useRouter();
  const finalAmounts = vm.step >= 3 ? vm.computedFinalAmounts() : {};

  const canProceedStep0 = vm.title.trim().length > 0;
  const canProceedStep1 = (() => {
    if (vm.participants.some((p) => !p.name.trim())) return false;
    if (vm.splitMode === 'equal') return vm.totalAmount > 0;
    if (vm.splitMode === 'custom') {
      if (vm.totalAmount <= 0) return false;
      const sum = Object.values(vm.customAmounts).reduce((a, b) => a + b, 0);
      return sum === vm.totalAmount && vm.participants.every((p) => (vm.customAmounts[p.localId] ?? 0) > 0);
    }
    if (vm.splitMode === 'itemized')
      return vm.items.length > 0 && vm.items.every((i) => i.name.trim() && i.price > 0 && i.assignedParticipantLocalIds.length > 0);
    return false;
  })();
  const canSubmit = vm.accounts.some((a) => a.bankName.trim() && a.accountNumber.trim()) && !vm.isSubmitting;

  if (vm.isLoadingBill) {
    return (
      <main className="min-h-screen px-4 pt-4 max-w-lg mx-auto space-y-4">
        <div className="h-11 w-40 rounded-xl bg-muted animate-pulse" />
        <div className="h-2 w-full rounded-full bg-muted animate-pulse" />
        {[1, 2, 3].map((i) => <div key={i} className="h-14 w-full rounded-xl bg-muted animate-pulse" />)}
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="px-4 pt-4 pb-8 md:px-6 md:pt-6 max-w-lg mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <button
            onClick={() => (vm.step > 0 ? vm.setStep((vm.step - 1) as FormStep) : router.back())}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="typo-page-title">
              {vm.submitLabel === 'Save Changes' ? 'Edit Split Bill' : 'New Split Bill'}
            </h1>
            <p className="text-xs text-muted-foreground">{STEPS[vm.step]}</p>
          </div>
        </header>

        {/* Progress */}
        <div className="flex gap-1 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= vm.step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        {/* Error */}
        {vm.error && (
          <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-sm text-red-700 dark:text-red-400 mb-6">
            {vm.error}
          </div>
        )}

        {/* ── Step 0: Bill Info + Mode ── */}
        {vm.step === 0 && (
          <div className="space-y-6">
            <Field label="Title">
              <input
                className={inputCls}
                placeholder="e.g. Dinner with the gang"
                value={vm.title}
                onChange={(e) => vm.setTitle(e.target.value)}
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                className={inputCls}
                value={vm.date}
                onChange={(e) => vm.setDate(e.target.value)}
              />
            </Field>
            <Field label="Description (optional)">
              <input
                className={inputCls}
                placeholder="e.g. Post-game dinner"
                value={vm.description}
                onChange={(e) => vm.setDescription(e.target.value)}
              />
            </Field>
            <Field label="How to split?">
              <div className="grid grid-cols-3 gap-2">
                {(['equal', 'custom', 'itemized'] as SplitMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => vm.setSplitMode(mode)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium capitalize transition-all ring-1 ${
                      vm.splitMode === mode
                        ? 'bg-primary text-primary-foreground ring-primary'
                        : 'bg-muted ring-border hover:bg-muted/80'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {vm.splitMode === 'equal' && 'Total divided equally among all participants.'}
                {vm.splitMode === 'custom' && "Manually enter each person's share."}
                {vm.splitMode === 'itemized' && 'Add items and assign each to one or more people.'}
              </p>
            </Field>
            <Button className="w-full h-12 rounded-xl" disabled={!canProceedStep0} onClick={() => vm.setStep(1)}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── Step 1: Participants & Amounts ── */}
        {vm.step === 1 && (
          <div className="space-y-6">
            <Field label="Participants">
              <div className="space-y-2">
                {vm.participants.map((p) => {
                  const isLocked = !p.isCreator && p.status && p.status !== 'pending';
                  return (
                    <div key={p.localId} className="flex gap-2 items-center">
                      {p.isCreator ? (
                        <div className={`${inputCls} flex-1 flex items-center gap-2 cursor-default select-none`}>
                          <span className="font-medium">{p.name}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">Me</span>
                        </div>
                      ) : (
                        <input
                          className={`${inputCls} flex-1`}
                          placeholder="Name"
                          value={p.name}
                          onChange={(e) => vm.updateParticipant(p.localId, { name: e.target.value })}
                        />
                      )}
                      {vm.participants.length > 1 && (
                        isLocked ? (
                          <div
                            title="Cannot remove — participant has already submitted proof"
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-muted text-muted-foreground ring-1 ring-border opacity-50"
                          >
                            <Lock className="w-4 h-4" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => vm.removeParticipant(p.localId)}
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors ring-1 ring-border"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={vm.addParticipant}
                  className="w-full h-11 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add participant
                </button>
              </div>
            </Field>

            {/* Equal mode: total amount */}
            {vm.splitMode === 'equal' && (
              <Field label="Total amount (IDR)">
                <CurrencyInput
                  value={vm.totalAmount}
                  onChange={vm.setTotalAmount}
                  currencyLabel="IDR"
                  className="w-full h-11 rounded-xl bg-muted/50"
                />
                {vm.totalAmount > 0 && vm.participants.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(Math.floor(vm.totalAmount / vm.participants.length), 'IDR')} per person
                  </p>
                )}
              </Field>
            )}

            {/* Custom mode: total bill amount + per-person amounts */}
            {vm.splitMode === 'custom' && (
              <>
                <Field label="Total bill amount (IDR)">
                  <CurrencyInput
                    value={vm.totalAmount}
                    onChange={vm.setTotalAmount}
                    currencyLabel="IDR"
                    className="w-full h-11 rounded-xl bg-muted/50"
                  />
                </Field>
                <Field label="Amount per person (IDR)">
                  <div className="space-y-2">
                    {vm.participants.map((p) => (
                      <div key={p.localId} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-24 truncate">{p.name || 'Unnamed'}</span>
                        <CurrencyInput
                          value={vm.customAmounts[p.localId] ?? 0}
                          onChange={(v) => vm.setCustomAmounts((prev) => ({ ...prev, [p.localId]: v }))}
                          currencyLabel="IDR"
                          className="flex-1 min-w-0 h-11 rounded-xl bg-muted/50"
                        />
                      </div>
                    ))}
                    {(() => {
                      const customSum = Object.values(vm.customAmounts).reduce((a, b) => a + b, 0);
                      const remaining = vm.totalAmount - customSum;
                      const unsetParticipants = vm.participants.filter(
                        (p) => (vm.customAmounts[p.localId] ?? 0) === 0
                      );
                      const showSplitBtn =
                        vm.totalAmount > 0 && remaining > 0 && unsetParticipants.length > 0;
                      const remainingCls =
                        vm.totalAmount > 0 && remaining === 0
                          ? 'text-green-500'
                          : remaining < 0
                          ? 'text-red-500'
                          : 'text-muted-foreground';
                      return (
                        <>
                          {showSplitBtn && (
                            <button
                              type="button"
                              className="w-full h-9 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                              onClick={() => {
                                const share = Math.floor(remaining / unsetParticipants.length);
                                const leftover = remaining - share * unsetParticipants.length;
                                vm.setCustomAmounts((prev) => {
                                  const next = { ...prev };
                                  unsetParticipants.forEach((p, i) => {
                                    next[p.localId] = share + (i === unsetParticipants.length - 1 ? leftover : 0);
                                  });
                                  return next;
                                });
                              }}
                            >
                              Split remaining equally
                            </button>
                          )}
                          <div className={`text-sm pt-1 ${remainingCls}`}>
                            Remaining: {formatCurrency(remaining, 'IDR')}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </Field>
              </>
            )}

            {/* Itemized mode: items with assignees */}
            {vm.splitMode === 'itemized' && (
              <Field label="Items">
                <div className="space-y-4">
                  {vm.items.map((item) => (
                    <div key={item.localId} className="rounded-xl ring-1 ring-border p-3 space-y-3">
                      <div className="flex gap-2 items-center">
                        <input
                          className={`${inputCls} flex-1 min-w-0`}
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => vm.updateItem(item.localId, { name: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => vm.removeItem(item.localId)}
                          className="w-11 h-11 flex items-center justify-center rounded-xl bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors ring-1 ring-border flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <CurrencyInput
                        value={item.price}
                        onChange={(v) => vm.updateItem(item.localId, { price: v })}
                        currencyLabel="IDR"
                        className="w-full h-11 rounded-xl bg-muted/50"
                      />
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Assign to:</p>
                        <div className="flex flex-wrap gap-2">
                          {vm.participants.map((p) => {
                            const assigned = item.assignedParticipantLocalIds.includes(p.localId);
                            return (
                              <button
                                key={p.localId}
                                type="button"
                                onClick={() => vm.toggleItemAssignee(item.localId, p.localId)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ring-1 ${
                                  assigned
                                    ? 'bg-primary text-primary-foreground ring-primary'
                                    : 'bg-muted ring-border hover:bg-muted/80'
                                }`}
                              >
                                {assigned && <Check className="w-3 h-3" />}
                                {p.name || 'Unnamed'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={vm.addItem}
                    className="w-full h-11 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add item
                  </button>
                </div>
              </Field>
            )}

            <Button className="w-full h-12 rounded-xl" disabled={!canProceedStep1} onClick={() => vm.setStep(2)}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Adjustments ── */}
        {vm.step === 2 && (
          <div className="space-y-6">
            <div className="space-y-3">
              {vm.adjustments.map((adj) => (
                <div key={adj.localId} className="rounded-xl ring-1 ring-border p-3 space-y-3">
                  <div className="flex gap-2">
                    <input
                      className={`${inputCls} flex-1`}
                      placeholder="Label (e.g. Tax, Service)"
                      value={adj.label}
                      onChange={(e) => vm.updateAdjustment(adj.localId, { label: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => vm.removeAdjustment(adj.localId)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors ring-1 ring-border flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={adj.type}
                      onValueChange={(v) => vm.updateAdjustment(adj.localId, { type: v as AdjustmentForm['type'] })}
                    >
                      <SelectTrigger className="w-44 flex-none !h-11 rounded-xl bg-muted/50 ring-1 ring-border px-4 text-sm">
                        <SelectValue>{adj.type === 'percentage' ? 'Percentage (%)' : 'Fixed (IDR)'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed (IDR)</SelectItem>
                      </SelectContent>
                    </Select>
                    {adj.type === 'fixed' ? (
                      <CurrencyInput
                        value={adj.value}
                        onChange={(v) => vm.updateAdjustment(adj.localId, { value: v })}
                        currencyLabel="IDR"
                        className="flex-1 min-w-0 h-11 rounded-xl bg-muted/50"
                      />
                    ) : (
                      <input
                        type="number"
                        className={`${flexInputCls} flex-1`}
                        placeholder="11 (= 11%)"
                        value={adj.value / 100 || ''}
                        onChange={(e) => {
                          const raw = parseFloat(e.target.value) || 0;
                          vm.updateAdjustment(adj.localId, { value: Math.round(raw * 100) });
                        }}
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    {(['proportional', 'equal'] as const).map((dist) => (
                      <button
                        key={dist}
                        type="button"
                        onClick={() => vm.updateAdjustment(adj.localId, { distribution: dist })}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all ring-1 ${
                          adj.distribution === dist
                            ? 'bg-primary text-primary-foreground ring-primary'
                            : 'bg-muted ring-border hover:bg-muted/80'
                        }`}
                      >
                        {dist}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {adj.distribution === 'proportional'
                      ? "Distributed in proportion to each person's subtotal."
                      : 'Split equally among all participants.'}
                  </p>
                </div>
              ))}
              <button
                type="button"
                onClick={vm.addAdjustment}
                className="w-full h-11 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add tax / service / fee
              </button>
            </div>
            {vm.adjustments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No adjustments — skip if not needed.
              </p>
            )}
            <Button className="w-full h-12 rounded-xl" onClick={() => vm.setStep(3)}>
              {vm.adjustments.length === 0 ? 'Skip' : 'Next'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── Step 3: Review ── */}
        {vm.step === 3 && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-muted/50 ring-1 ring-border p-4 space-y-1">
              <p className="font-semibold text-base">{vm.title}</p>
              <p className="text-sm text-muted-foreground">{vm.date} · {vm.splitMode} split</p>
              {vm.description && <p className="text-sm text-muted-foreground">{vm.description}</p>}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Final amounts</p>
              {vm.participants.map((p) => (
                <div key={p.localId} className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/50 ring-1 ring-border">
                  <span className="font-medium flex items-center gap-2">
                    {p.name}
                    {p.isCreator && <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">Me</span>}
                  </span>
                  <span className="font-semibold">{formatCurrency(finalAmounts[p.localId] ?? 0, 'IDR')}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-primary/5 ring-1 ring-primary/20">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">
                  {formatCurrency(Object.values(finalAmounts).reduce((a, b) => a + b, 0), 'IDR')}
                </span>
              </div>
            </div>

            {vm.adjustments.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Adjustments applied</p>
                {vm.adjustments.map((a) => (
                  <div key={a.localId} className="text-sm text-muted-foreground flex justify-between py-1">
                    <span>{a.label}</span>
                    <span>{a.type === 'percentage' ? `${a.value / 100}%` : formatCurrency(a.value, 'IDR')} · {a.distribution}</span>
                  </div>
                ))}
              </div>
            )}

            <Button className="w-full h-12 rounded-xl" onClick={() => vm.setStep(4)}>
              Looks good <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── Step 4: Payment Accounts ── */}
        {vm.step === 4 && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Add at least one account where participants should transfer their payment.
            </p>
            <div className="space-y-3">
              {vm.accounts.map((acc) => (
                <div key={acc.localId} className="flex gap-2">
                  <input
                    className="w-28 shrink-0 h-11 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Bank (e.g. BCA)"
                    value={acc.bankName}
                    onChange={(e) => vm.updateAccount(acc.localId, { bankName: e.target.value })}
                  />
                  <input
                    className={`${inputCls} flex-1 min-w-0`}
                    placeholder="Account number"
                    value={acc.accountNumber}
                    onChange={(e) => vm.updateAccount(acc.localId, { accountNumber: e.target.value })}
                  />
                  {vm.accounts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => vm.removeAccount(acc.localId)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors ring-1 ring-border flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={vm.addAccount}
                className="w-full h-11 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add account
              </button>
            </div>
            <Button
              className="w-full h-12 rounded-xl"
              disabled={!canSubmit}
              onClick={vm.submit}
            >
              {vm.isSubmitting ? 'Saving...' : (vm.submitLabel ?? 'Create Bill')}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full h-11 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all';

// Same as inputCls but without w-full — safe to use inside flex rows with flex-1 or explicit widths
const flexInputCls =
  'h-11 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all';
