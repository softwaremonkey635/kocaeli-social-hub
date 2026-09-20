import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, Euro, TrendingUp, TrendingDown, RefreshCw, Coins } from 'lucide-react';

interface CurrencyItem {
  code: string;
  name: string;
  buying: string;
  selling: string;
  change: string;
  isUp: boolean;
}

export const FinanceTicker: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [rates, setRates] = useState<CurrencyItem[]>([
    { code: 'USD', name: 'Dolar', buying: '48,75', selling: '48,78', change: '%0,08', isUp: true },
    { code: 'EUR', name: 'Euro', buying: '56,00', selling: '56,11', change: '%-0,08', isUp: false },
    { code: 'ALTIN', name: 'Gram Altın', buying: '6.865', selling: '6.866', change: '%0,94', isUp: true }
  ]);
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

        setRates([
          {
            code: 'USD',
            name: 'Dolar',
            buying: data.USD?.Alış?.slice(0, 5) || '48,75',
            selling: data.USD?.Satış?.slice(0, 5) || '48,78',
            change: usdChange,
            isUp: !usdChange.startsWith('%-')
          },
          {
            code: 'EUR',
            name: 'Euro',
            buying: data.EUR?.Alış?.slice(0, 5) || '56,00',
            selling: data.EUR?.Satış?.slice(0, 5) || '56,11',
            change: eurChange,
            isUp: !eurChange.startsWith('%-')
          },
          {
            code: 'ALTIN',
            name: 'Gram Altın',
            buying: data['gram-altin']?.Alış?.split(',')[0] || '6.865',
            selling: data['gram-altin']?.Satış?.split(',')[0] || '6.866',
            change: goldChange,
            isUp: !goldChange.startsWith('%-')
          }
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

  return (
    <div
      id="live-finance-ticker"
      className={`p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#091224] via-[#070e1a] to-[#0a1529] border border-cyan-500/20 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-2.5 ${className}`}
    >
      <div className="flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
          <Coins className="w-3 h-3 text-cyan-300" />
          <span>CANLI PİYASA &amp; DÖVİZ</span>
        </span>
      </div>

      {/* Items Ticker */}
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto scrollbar-none justify-between sm:justify-start">
        {rates.map((r) => (
          <div
            key={r.code}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] shrink-0"
          >
            <span className="font-bold text-slate-300">{r.name}:</span>
            <span className="font-black text-white font-mono">{r.selling} ₺</span>
            <span
              className={`flex items-center text-[10px] font-bold px-1 rounded ${
                r.isUp
                  ? 'text-emerald-400 bg-emerald-950/60'
                  : 'text-rose-400 bg-rose-950/60'
              }`}
            >
              {r.isUp ? (
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
              )}
              {r.change}
            </span>
          </div>
        ))}
      </div>

      {/* Refresh and Timestamp */}
      <div className="flex items-center gap-2 text-[10px] text-slate-400 shrink-0 self-end sm:self-auto">
        <span className="hidden xs:inline">Güncelleme: {lastUpdate}</span>
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
  );
};
