import { LOGO_BASE } from "../../services/tmdb";
import { SUPPORTED_COUNTRIES } from "../../hooks/useCountry";

function ProviderGroup({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-3">
      <p className="text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((p) => (
          <img
            key={p.provider_id}
            src={`${LOGO_BASE}${p.logo_path}`}
            alt={p.provider_name}
            title={p.provider_name}
            className="w-9 h-9 rounded-lg object-cover border border-zinc-700"
          />
        ))}
      </div>
    </div>
  );
}

const COUNTRY_LABELS = { US: "🇺🇸 US", MX: "🇲🇽 MX", CA: "🇨🇦 CA", AU: "🇦🇺 AU" };

export default function WatchProviders({ providers, country, onCountryChange, t }) {
  const countryData = providers?.[country] || null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
          {t("watchOn")}
        </h3>
        <div className="flex gap-1">
          {SUPPORTED_COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => onCountryChange(c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                c === country
                  ? "bg-violet-700 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {COUNTRY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {!countryData ? (
        <p className="text-zinc-500 text-sm">{t("noProviders")}</p>
      ) : (
        <>
          <ProviderGroup label={t("stream")} items={countryData.flatrate} />
          <ProviderGroup label={t("rent")} items={countryData.rent} />
          <ProviderGroup label={t("buy")} items={countryData.buy} />
        </>
      )}
    </div>
  );
}
