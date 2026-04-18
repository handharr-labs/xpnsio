export default function SplitBillManageLoading() {
  return (
    <main className="min-h-screen">
      <div className="px-4 pt-4 pb-8 md:px-6 md:pt-6 max-w-lg mx-auto">
        <div className="h-8 w-48 bg-muted rounded-xl animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}
