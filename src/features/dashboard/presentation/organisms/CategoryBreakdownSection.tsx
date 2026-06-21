import { Card, CardContent } from '@handharr-labs/ui-xpnsio';
import { ChevronRight } from 'lucide-react';

type StatusVariant = 'on-track' | 'at-risk' | 'over';

const STATUS_COLOR: Record<StatusVariant, string> = {
  'on-track': 'bg-emerald-400',
  'at-risk':  'bg-yellow-400',
  'over':     'bg-red-400',
};

const STATUS_TEXT: Record<StatusVariant, string> = {
  'on-track': 'text-emerald-600 dark:text-emerald-300',
  'at-risk':  'text-yellow-600 dark:text-yellow-300',
  'over':     'text-red-600 dark:text-red-300',
};

interface ProgressBarProps {
  percent: number;
  status: StatusVariant;
  height?: 'sm' | 'md';
}

function ProgressBar({ percent, status, height = 'sm' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-muted rounded-full overflow-hidden ${height === 'md' ? 'h-2' : 'h-1.5'}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${STATUS_COLOR[status]}`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

function StatusBadge({ label, status }: { label: string; status: StatusVariant }) {
  return (
    <span className={`text-xs font-medium ${STATUS_TEXT[status]}`}>
      {label}
    </span>
  );
}

interface ProgressDisplay {
  percent: number;
  status: StatusVariant;
  label: string;
}

export interface DailyCategoryCardVM {
  type: 'daily';
  id: string;
  name: string;
  budgetBadge: string;
  todayLabel: string;
  todayProgress: ProgressDisplay;
  todaySpentLabel: string;
  pacingLabel: string;
  pacingProgress: ProgressDisplay;
  weekLabel: string;
  weekProgress: ProgressDisplay;
}

export interface WeeklyCategoryCardVM {
  type: 'weekly';
  id: string;
  name: string;
  budgetBadge: string;
  weekLabel: string;
  weekSubLabel: string;
  weekProgress: ProgressDisplay;
  weekSpentLabel: string;
  pacingLabel: string;
  pacingProgress: ProgressDisplay;
  monthlyProgress: ProgressDisplay;
}

export interface MonthlyCategoryCardVM {
  type: 'monthly';
  id: string;
  name: string;
  progress: ProgressDisplay;
  spentLabel: string;
}

export type CategoryCardVM = DailyCategoryCardVM | WeeklyCategoryCardVM | MonthlyCategoryCardVM;

export interface CategoryGroupVM {
  period: string;
  label: string;
  items: CategoryCardVM[];
}

interface CategoryBreakdownSectionProps {
  title: string;
  groups: CategoryGroupVM[];
}

function DailyCategoryCard({ vm }: { vm: DailyCategoryCardVM }) {
  return (
    <Card size="sm" className="hover:ring-foreground/20 transition-all cursor-pointer group">
      <CardContent className="pt-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{vm.name}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {vm.budgetBadge}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-3 rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{vm.todayLabel}</span>
            <StatusBadge label={vm.todayProgress.label} status={vm.todayProgress.status} />
          </div>
          <ProgressBar percent={vm.todayProgress.percent} status={vm.todayProgress.status} height="md" />
          <p className="text-xs text-muted-foreground">{vm.todaySpentLabel}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">{vm.pacingLabel}</p>
            <ProgressBar percent={vm.pacingProgress.percent} status={vm.pacingProgress.status} />
            <p className={`text-xs font-medium ${STATUS_TEXT[vm.pacingProgress.status]}`}>{vm.pacingProgress.label}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">{vm.weekLabel}</p>
            <ProgressBar percent={vm.weekProgress.percent} status={vm.weekProgress.status} />
            <p className={`text-xs font-medium ${STATUS_TEXT[vm.weekProgress.status]}`}>{vm.weekProgress.label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklyCategoryCard({ vm }: { vm: WeeklyCategoryCardVM }) {
  return (
    <Card size="sm" className="hover:ring-foreground/20 transition-all cursor-pointer group">
      <CardContent className="pt-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{vm.name}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {vm.budgetBadge}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-3 rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {vm.weekLabel}
              <span className="font-normal ml-1">({vm.weekSubLabel})</span>
            </span>
            <StatusBadge label={vm.weekProgress.label} status={vm.weekProgress.status} />
          </div>
          <ProgressBar percent={vm.weekProgress.percent} status={vm.weekProgress.status} height="md" />
          <p className="text-xs text-muted-foreground">{vm.weekSpentLabel}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">{vm.pacingLabel}</p>
            <ProgressBar percent={vm.pacingProgress.percent} status={vm.pacingProgress.status} />
            <p className={`text-xs font-medium ${STATUS_TEXT[vm.pacingProgress.status]}`}>{vm.pacingProgress.label}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Monthly</p>
            <ProgressBar percent={vm.monthlyProgress.percent} status={vm.monthlyProgress.status} />
            <p className={`text-xs font-medium ${STATUS_TEXT[vm.monthlyProgress.status]}`}>{vm.monthlyProgress.label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyCategoryCard({ vm }: { vm: MonthlyCategoryCardVM }) {
  return (
    <Card size="sm" className="hover:ring-foreground/20 transition-all cursor-pointer group">
      <CardContent className="pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{vm.name}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <ProgressBar percent={vm.progress.percent} status={vm.progress.status} height="md" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{vm.spentLabel}</span>
          <StatusBadge label={vm.progress.label} status={vm.progress.status} />
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryBreakdownSection({ title, groups }: CategoryBreakdownSectionProps) {
  if (groups.length === 0) return null;

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      {groups.map((group) => (
        <div key={group.period} className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {group.label}
            </h3>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {group.items.map((vm) => {
              if (vm.type === 'daily') return <DailyCategoryCard key={vm.id} vm={vm} />;
              if (vm.type === 'weekly') return <WeeklyCategoryCard key={vm.id} vm={vm} />;
              return <MonthlyCategoryCard key={vm.id} vm={vm} />;
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
