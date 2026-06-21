import { BudgetSettingEditView } from '@/features/budget-settings/presentation/views/BudgetSettingEditView';

export default async function BudgetSettingEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BudgetSettingEditView id={id} />;
}
