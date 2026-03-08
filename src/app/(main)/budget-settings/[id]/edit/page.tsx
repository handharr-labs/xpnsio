import { BudgetSettingEditView } from '@/presentation/features/budget-settings/BudgetSettingEditView';

export default async function BudgetSettingEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BudgetSettingEditView id={id} />;
}
