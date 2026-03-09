import { BudgetSettingEditView } from '@/features/budget-settings/presentation/BudgetSettingEditView';

export default async function BudgetSettingEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BudgetSettingEditView id={id} />;
}
