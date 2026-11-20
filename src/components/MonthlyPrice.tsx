import { formatPrice, monthlyQuote } from "@/lib/coverage/pricing";

export default function MonthlyPrice({
  service,
  plan,
  locality,
}: {
  service: string;
  plan: string;
  locality: string;
}) {
  const quote = monthlyQuote({ service, plan, locality });
  if (!quote) return null;
  return (
    <aside
      role="status"
      className="rounded-xl bg-blue-50 px-4 py-3 text-sm"
      data-testid="request-monthly-price"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium text-brand-blue-dark">Abono mensual</p>
        <p className="text-xl font-bold text-brand-blue-dark">
          {formatPrice(quote.total)}{" "}
          <span className="text-xs font-normal text-slate-500">/ mes</span>
        </p>
      </div>
      {!!quote.internet && !!quote.tv && (
        <p className="mt-1 text-xs text-slate-500">
          Internet {formatPrice(quote.internet)} + TV Digital{" "}
          {formatPrice(quote.tv)}
        </p>
      )}
    </aside>
  );
}
