import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Coins, BarChart3 } from 'lucide-react';

interface TickerItem {
  code: string;
  name: string;
  value: string;
  change: string;
  isUp: boolean;
}

const DEFAULT_ITEMS: TickerItem[] = [
  { code: 'USD', name: 'Dolar', value: '48,78 ₺', change: '%0,08', isUp: true },
  { code: 'EUR', name: 'Euro', value: '56,11 ₺', change: '%-0,08', isUp: false },
  { code: 'BIST500', name: 'BIST 500', value: '10.842', change: '%1,23', isUp: true },
  { code: 'ALTIN', name: 'Gram Altın', value: '6.866 ₺', change: '%0,94', isUp: true },
];

export const FinanceTicker: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [items, setItems] = useState<TickerItem[]>(DEFAULT_ITEMS);
  const [lastUpdate, setLastUpdate] = useState<string>('Canlı');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://finans.truncgil.com/today.json');
      const data = await res.json();

      if (data) {
        const usdChange = data.USD?.Değişim || '%0.00';
        const eurChange = data.EUR?.Değişim || '%0.00';
        const goldChange = data['gram-altin']?.Değişim || '%0.00';

        setItems([
          {
            code: 'USD',
            name: 'Dolar',
            value: `${data.USD?.Satış?.slice(0, 5) || '48,78'} ₺`,
            change: usdChange,
            isUp: !usdChange.startsWith('%-'),
          },
          {
            code: 'EUR',
            name: 'Euro',
            value: `${data.EUR?.Satış?.slice(0, 5) || '56,11'} ₺`,
            change: eurChange,
            isUp: !eurChange.startsWith('%-'),
          },
          {
            code: 'BIST500',
            name: 'BIST 500',
            value: '10.842',
            change: '%1,23',
            isUp: true,
          },
          {
            code: 'ALTIN',
            name: 'Gram Altın',
            value: `${data['gram-altin']?.Satış?.split(',')[0] || '6.866'} ₺`,
            change: goldChange,
            isUp: !goldChange.startsWith('%-'),
          },
        ]);

        if (data.Update_Date) {
          const timePart = data.Update_Date.split(' ')[1]?.slice(0, 5);
          setLastUpdate(timePart || 'Yeni');
        }
      }
    } catch (err) {
      console.warn('Döviz verisi çekilemedi:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  const marqueeItems = [...items, ...items];

  const renderChip = (item: TickerItem, idx: number, size: 'sm' | 'md') => (
    <div
      key={`${item.code}-${idx}`}
      className={`flex items-center gap-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0 ${
        size === 'sm'
          ? 'px-2 py-1 text-[10px]'
          : 'px-2.5 py-1 text-[11px]'
      }`}
    >
      {item.code === 'BIST500' ? (
        <BarChart3 className="w-3 h-3 text-cyan-400 shrink-0" />
      ) : null}
      <span className="font-bold text-slate-300">{item.name}:</span>
      <span className="font-black text-white font-mono">{item.value}</span>
      <span
        className={`flex items-center font-bold px-1 rounded ${
          size === 'sm' ? 'text-[9px]' : 'text-[10px]'
        } ${
          item.isUp
            ? 'text-emerald-400 bg-emerald-950/60'
            : 'text-rose-400 bg-rose-950/60'
        }`}
      >
        {item.isUp ? (
          <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
        ) : (
          <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
        )}
        {item.change}
      </span>
    </div>
  );

  return (
    <div
      id="live-finance-ticker"
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#091224] via-[#070e1a] to-[#0a1529] border border-cyan-500/20 text-white shadow-md ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-slate-800/70 bg-[#060b16]/60">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
            <Coins className="w-3 h-3 text-cyan-300" />
            <span>CANLI PİYASA &amp; DÖVİZ</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 shrink-0">
          <span>Güncelleme: {lastUpdate}</span>
          <button
            onClick={fetchRates}
            disabled={loading}
            title="Kurları Yenile"
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Marquee runner — identical to SponsorMarquee pattern */}
      <div className="relative py-2.5 overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#091224] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#091224] to-transparent z-10" />

        {/* Mobile: tighter gap. Desktop: wider gap. Both use same infinite marquee. */}
        <div className="sm:hidden animate-marquee items-center gap-2 select-none">
          {marqueeItems.map((r, i) => renderChip(r, i, 'sm'))}
        </div>
        <div className="hidden sm:flex animate-marquee items-center gap-4 select-none">
          {marqueeItems.map((r, i) => renderChip(r, i, 'md'))}
        </div>
      </div>
    </div>
  );
};
