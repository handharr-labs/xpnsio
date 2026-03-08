# 013 · Currency Formatting on Amount Inputs

**Phase:** 2
**Status:** `ready`
**Affects:** All amount input fields across the app

---

## Problem

Amount inputs are plain `<input type="number">` fields. Users see raw numbers like `1500000` instead of formatted values like `Rp 1.500.000`. This is hard to read for large IDR amounts.

---

## Solution

Replace `<input type="number">` for currency amounts with a formatted text input:
- Display: formatted with thousand separators (e.g. `1.500.000`)
- Internal value: raw number for state/submission
- No currency symbol inside the input (show symbol as a prefix label)

### Behavior
```
User types: 1500000
Input shows: 1.500.000
Prefix label: Rp
```

- Format on blur (or on each keystroke, stripping non-numeric chars first)
- Accept only digits — strip dots, commas, spaces on input
- On blur: reformat to locale string
- On focus: show raw number or keep formatted (either is fine)

### Implementation

```ts
// Utility
function parseAmount(raw: string): number {
  return parseFloat(raw.replace(/\./g, '').replace(',', '.')) || 0;
}

function formatAmount(value: number, currency: string = 'IDR'): string {
  if (currency === 'IDR') {
    return value.toLocaleString('id-ID'); // no symbol, just separators
  }
  return value.toLocaleString('en-US');
}
```

```tsx
// Component
function CurrencyInput({ value, onChange, currency = 'IDR', placeholder }: ...) {
  const [display, setDisplay] = useState(value > 0 ? formatAmount(value, currency) : '');

  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      <span className="px-3 py-2 bg-muted text-sm border-r">{currency}</span>
      <input
        type="text"
        inputMode="numeric"
        className="flex-1 px-3 py-2 text-sm outline-none"
        value={display}
        placeholder={placeholder ?? '0'}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, '');
          setDisplay(raw ? Number(raw).toLocaleString('id-ID') : '');
          onChange(parseFloat(raw) || 0);
        }}
      />
    </div>
  );
}
```

---

## Inputs to Update

| View | Field |
|------|-------|
| `TransactionNewView` | Amount |
| `TransactionDetailView` | Amount (edit) |
| `BudgetSettingNewView` | Total monthly budget + per-category amounts |
| `BudgetSettingEditView` | Total monthly budget + per-category amounts |
| `SetupView` | Total budget + per-category amounts (step 2) |

---

## Files to Create/Change

| File | Change |
|------|--------|
| `src/presentation/common/CurrencyInput.tsx` | New shared component |
| All views listed above | Replace `<input type="number">` with `<CurrencyInput>` |

---

## Acceptance Criteria

- [ ] Typing `1500000` displays as `1.500.000` (IDR) or `1,500,000` (USD)
- [ ] Currency prefix shown as non-editable label
- [ ] Submitted value is a valid number (not formatted string)
- [ ] Works on mobile (inputMode="numeric" shows number keyboard)
- [ ] No `step` validation errors from browser
