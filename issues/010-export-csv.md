# 010 · Export to CSV

**Phase:** 3 — Extended Features
**Status:** `planned`
**GitHub:** [#10](https://github.com/handharr-labs/xpnsio/issues/10)
**Route:** Button on `/transactions` or `/summary`
**Depends on:** 007

---

## Goal

Let users download their transaction history as a CSV file. Client-side generation (no server needed after data fetch).

---

## UI

- "Export CSV" button on transaction list page
- Date range picker (default: current month)
- Click → fetches transactions for range → generates CSV → triggers download

---

## CSV Format

```
Date,Category,Master Type,Amount,Type,Description
2026-03-01,Coffee,Daily,8500,expense,Morning latte
2026-03-01,,, 5000000,income,Salary
```

Columns:
| Column | Source |
|--------|--------|
| Date | transaction.date |
| Category | category.name (or empty) |
| Master Type | category.masterCategory (or empty) |
| Amount | transaction.amount |
| Type | transaction.type |
| Description | transaction.description (or empty) |

---

## Implementation

Client-side generation using native browser APIs:
```ts
const csv = rows.map(r => [r.date, r.categoryName, r.masterCategory, r.amount, r.type, r.description].join(',')).join('\n');
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
// create <a> and click
```

---

## Files

| File | Action |
|------|--------|
| `src/presentation/features/transactions/useExportCsv.ts` | Hook (client-side) |
| Update `TransactionsView.tsx` | Add export button |

---

## Acceptance Criteria

- [ ] Export button on transaction list
- [ ] Date range selector
- [ ] Downloaded file named `xpnsio-YYYY-MM.csv`
- [ ] All columns present and correct
- [ ] Works in Chrome, Safari, Firefox
