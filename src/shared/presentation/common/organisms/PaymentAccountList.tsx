import { PaymentAccountItem } from './PaymentAccountItem';

interface PaymentAccount {
  id: string;
  bankName: string;
  accountNumber: string;
}

interface PaymentAccountListProps {
  label?: string;
  accounts: PaymentAccount[];
}

export function PaymentAccountList({ label = 'Payment accounts', accounts }: PaymentAccountListProps) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      <div className="rounded-2xl bg-muted/50 ring-1 ring-border divide-y divide-border overflow-hidden">
        {accounts.map((acc) => (
          <PaymentAccountItem
            key={acc.id}
            id={acc.id}
            bankName={acc.bankName}
            accountNumber={acc.accountNumber}
          />
        ))}
      </div>
    </div>
  );
}
