import React from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid
} from 'recharts';
import {
  PieChart,
  BarChart3,
  Sparkles,
  Receipt,
  Utensils,
  Bus,
  Calendar,
  ShieldAlert
} from 'lucide-react';

export interface GuideChartsProps {
  analysisView: 'charts' | 'comparison' | 'insights' | 'table';
  setAnalysisView: React.Dispatch<React.SetStateAction<'charts' | 'comparison' | 'insights' | 'table'>>;
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
  isSurplus: boolean;
  detailedExpenseData: Array<{ name: string; value: number; color: string; category: string }>;
  incomeVsExpenseData: Array<{ name: string; Gelir: number; Gider: number }>;
  categoryBarData: Array<{ name: string; Tutar: number; color: string }>;
  housingPct: number;
  foodPct: number;
  transportPct: number;
  socialPct: number;
  expenseToIncomeRatio: number;
  kykBursary: number;
  kykCoveragePct: number;
  familySupport: number;
  otherBursary: number;
  partTimeIncome: number;
  tabldotMonthlySavings: number;
  weeklyFirstMeals: number;
  weeklySecondMeals: number;
  weeklyTrips: number;
  monthlyTripsCount: number;
  smartTransportRecommendation: { bestMode: string; cost: number; title: string; desc: string; savings: number };
  mandatoryExpenses: number;
}

export const GuideCharts: React.FC<GuideChartsProps> = ({
  analysisView, setAnalysisView, totalExpenses, totalIncome, netBalance, isSurplus, detailedExpenseData, incomeVsExpenseData, categoryBarData, housingPct, foodPct, transportPct, socialPct, expenseToIncomeRatio, kykBursary, kykCoveragePct, familySupport, otherBursary, partTimeIncome, tabldotMonthlySavings, weeklyFirstMeals, weeklySecondMeals, weeklyTrips, monthlyTripsCount, smartTransportRecommendation, mandatoryExpenses
}) => {
  return (
            <div className="space-y-3 sm:space-y-4">
              {/* ALT GÖRÜNÜM SEÇİCİ SUB-TABS (MOBİLDE YATAY KAYDIRILABİLİR) */}
              <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl sm:rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
                {[
                  { id: 'charts', label: '🍰 Gider Dağılımı', icon: PieChart },
                  { id: 'comparison', label: '📊 Gelir vs. Gider', icon: BarChart3 },
                  { id: 'insights', label: '💡 Akıllı Tasarruf', icon: Sparkles },
                  { id: 'table', label: '📋 Detaylı Bilanço', icon: Receipt },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAnalysisView(tab.id as any)}
                      className={`flex-1 min-w-[115px] sm:min-w-[140px] py-1.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border whitespace-nowrap shrink-0 ${
                        analysisView === tab.id
                          ? 'bg-[#10345e] text-white border-cyan-400 shadow-sm ring-1 ring-cyan-400/50'
                          : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* GÖRÜNÜM 1: GİDER DAĞILIMI (RECHARTS DONUT/PIE & RENKLİ KARTLAR) */}
              {analysisView === 'charts' && (
                <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060c18] border border-slate-800 space-y-4 sm:space-y-5 shadow-xl">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <PieChart className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Aylık Giderlerin Kategori Dağılımı</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Toplam {totalExpenses.toLocaleString('tr-TR')} ₺ harcamanın dağılımı
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/60 shrink-0">
                      8 Gider Kalemi
                    </span>
                  </div>

                  {/* GRAFİK VE MERKEZ BİLGİ */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
                    {/* Donut Chart */}
                    <div className="md:col-span-6 relative h-[210px] sm:h-[240px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={210}>
                        <RechartsPieChart>
                          <RechartsTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const d = payload[0];
                                const val = Number(d.value);
                                const pct = totalExpenses > 0 ? Math.round((val / totalExpenses) * 100) : 0;
                                return (
                                  <div className="bg-slate-900/95 border border-slate-700 p-2 rounded-xl shadow-2xl text-xs space-y-0.5 backdrop-blur-md">
                                    <p className="font-bold text-white flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.payload.color }} />
                                      {d.name}
                                    </p>
                                    <p className="text-cyan-300 font-black text-xs">
                                      {val.toLocaleString('tr-TR')} ₺
                                      <span className="text-slate-400 font-normal text-[10px] ml-1">(%{pct})</span>
                                    </p>
                                    <span className="text-[9px] text-slate-400 block">{d.payload.category}</span>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Pie
                            data={detailedExpenseData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={76}
                            paddingAngle={3}
                          >
                            {detailedExpenseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="#091222" strokeWidth={2} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>

                      {/* Donut Merkez Metni */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">TOPLAM</span>
                        <span className="text-base sm:text-lg font-black text-white">
                          {totalExpenses.toLocaleString('tr-TR')} ₺
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">/ Ay</span>
                      </div>
                    </div>

                    {/* Dağılım Çipleri */}
                    <div className="md:col-span-6 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-300 block mb-1">Harcama Ağırlıkları:</span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {detailedExpenseData.map((item) => {
                          const pct = totalExpenses > 0 ? Math.round((item.value / totalExpenses) * 100) : 0;
                          return (
                            <div
                              key={item.name}
                              className="p-1.5 sm:p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate">{item.name}</span>
                              </div>
                              <div className="text-right shrink-0 ml-1">
                                <span className="text-[10px] sm:text-[11px] font-black text-white block">
                                  {item.value.toLocaleString('tr-TR')} ₺
                                </span>
                                <span className="text-[8px] sm:text-[9px] text-slate-400">%{pct}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Kategori Yüzde Çubuğu */}
                  <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-300">
                      <span>4 Ana Sektör Özeti:</span>
                      <span className="text-[9px] sm:text-[11px] text-slate-400">
                        Barınma %{housingPct} | Beslenme %{foodPct} | Ulaşım %{transportPct} | Sosyal %{socialPct}
                      </span>
                    </div>
                    <div className="w-full h-2.5 sm:h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                      <div style={{ width: `${housingPct}%` }} className="bg-cyan-500 h-full" title={`Barınma: %${housingPct}`} />
                      <div style={{ width: `${foodPct}%` }} className="bg-emerald-500 h-full" title={`Beslenme: %${foodPct}`} />
                      <div style={{ width: `${transportPct}%` }} className="bg-[#ff7324] h-full" title={`Ulaşım: %${transportPct}`} />
                      <div style={{ width: `${socialPct}%` }} className="bg-pink-500 h-full" title={`Sosyal: %${socialPct}`} />
                    </div>
                  </div>
                </div>
              )}

              {/* GÖRÜNÜM 2: GELİR VS. GİDER GRAFİKLERİ (BAR CHART) */}
              {analysisView === 'comparison' && (
                <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060c18] border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-[#ff7324]" />
                        <span>Gelir vs. Gider Grafikleri</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Aylık nakit akış dengesi
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-300">
                      Gelirin{' '}
                      <strong className={expenseToIncomeRatio > 100 ? 'text-rose-400' : 'text-emerald-400'}>
                        %{expenseToIncomeRatio}
                      </strong>
                      'i harcanıyor
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
                    {/* Bar Chart 1: Gelir vs Gider */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white text-[11px]">Toplam Gelir vs. Toplam Gider</span>
                        <span className={`text-[10px] font-black ${isSurplus ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isSurplus ? `+${netBalance.toLocaleString('tr-TR')} ₺` : `${netBalance.toLocaleString('tr-TR')} ₺`}
                        </span>
                      </div>

                      <div className="h-[180px] w-full">
                        <ResponsiveContainer width="100%" height={180}>
                          <RechartsBarChart data={incomeVsExpenseData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                            <RechartsTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-slate-900 border border-slate-700 p-2 rounded-xl shadow-xl text-xs space-y-0.5">
                                      {payload.map((p: any) => (
                                        <div key={p.name} className="flex items-center justify-between gap-2">
                                          <span className="text-slate-300 text-[10px]">{p.name}:</span>
                                          <strong className="font-bold text-white text-xs">
                                            {Number(p.value).toLocaleString('tr-TR')} ₺
                                          </strong>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="Gelir" fill="#10b981" radius={[6, 6, 0, 0]} name="Aylık Gelir" />
                            <Bar dataKey="Gider" fill="#ff7324" radius={[6, 6, 0, 0]} name="Aylık Gider" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex items-center justify-around text-[10px] sm:text-xs pt-1 border-t border-slate-800">
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                          <span className="text-slate-300">Gelir:</span>
                          <strong className="text-emerald-400">+{totalIncome.toLocaleString('tr-TR')} ₺</strong>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded bg-[#ff7324]" />
                          <span className="text-slate-300">Gider:</span>
                          <strong className="text-[#ff7324]">-{totalExpenses.toLocaleString('tr-TR')} ₺</strong>
                        </div>
                      </div>
                    </div>

                    {/* Bar Chart 2: Kategori Harcamaları */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white text-[11px]">Kategori Harcama Tutarları</span>
                        <span className="text-[10px] text-slate-400">Net Maliyet</span>
                      </div>

                      <div className="h-[180px] w-full">
                        <ResponsiveContainer width="100%" height={180}>
                          <RechartsBarChart data={categoryBarData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                            <RechartsTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0];
                                  return (
                                    <div className="bg-slate-900 border border-slate-700 p-2 rounded-xl text-xs space-y-0.5">
                                      <p className="font-bold text-white">{d.payload.name}</p>
                                      <p className="text-cyan-300 font-black">
                                        {Number(d.value).toLocaleString('tr-TR')} ₺
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="Tutar" fill="#00d2eb" radius={[5, 5, 0, 0]}>
                              {categoryBarData.map((entry, index) => (
                                <Cell key={`cell-cat-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[10px] pt-1 border-t border-slate-800">
                        {categoryBarData.map((c) => (
                          <div key={c.name} className="flex items-center justify-between text-slate-300 px-1">
                            <span className="flex items-center gap-1 truncate">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                              {c.name}:
                            </span>
                            <strong className="text-white shrink-0 ml-1">{c.Tutar.toLocaleString('tr-TR')} ₺</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gelir Kaynakları ve KYK Bursu Analizi */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-200 block">Gelir Kaynakları Analizi:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-xs">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-950/40 border border-emerald-700/50">
                        <span className="text-[9px] text-emerald-400 font-bold block">KYK BURSU</span>
                        <span className="text-xs sm:text-sm font-black text-white">{kykBursary.toLocaleString('tr-TR')} ₺</span>
                        <span className="text-[8px] sm:text-[9px] text-emerald-300 block truncate">
                          Giderin %{kykCoveragePct}'i
                        </span>
                      </div>
                      <div className="p-1.5 sm:p-2 rounded-lg bg-slate-900 border border-slate-700">
                        <span className="text-[9px] text-slate-400 font-bold block">AİLE DESTEĞİ</span>
                        <span className="text-xs sm:text-sm font-black text-white">{familySupport.toLocaleString('tr-TR')} ₺</span>
                        <span className="text-[8px] sm:text-[9px] text-slate-400 block truncate">Aylık harçlık</span>
                      </div>
                      <div className="p-1.5 sm:p-2 rounded-lg bg-slate-900 border border-slate-700">
                        <span className="text-[9px] text-slate-400 font-bold block">DİĞER BURS</span>
                        <span className="text-xs sm:text-sm font-black text-white">{otherBursary.toLocaleString('tr-TR')} ₺</span>
                        <span className="text-[8px] sm:text-[9px] text-slate-400 block truncate">Vakıf vb.</span>
                      </div>
                      <div className="p-1.5 sm:p-2 rounded-lg bg-slate-900 border border-slate-700">
                        <span className="text-[9px] text-slate-400 font-bold block">PART-TIME</span>
                        <span className="text-xs sm:text-sm font-black text-white">{partTimeIncome.toLocaleString('tr-TR')} ₺</span>
                        <span className="text-[8px] sm:text-[9px] text-slate-400 block truncate">Serbest kazanç</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GÖRÜNÜM 3: AKILLI TASARRUF & OPTİMİZASYON SİMÜLATÖRÜ */}
              {analysisView === 'insights' && (
                <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060c18] border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Kocaeli Öğrenci Tasarruf &amp; Optimizasyon Motoru</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Giderleri düşürecek ve bütçeni dengeleyecek tavsiyeler
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
                    {/* Fırsat 1: Kampüs Yemekhanesi Avantajı */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-600/40 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 min-w-0">
                            <Utensils className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Kampüs Tabldot Tasarrufu</span>
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 whitespace-nowrap shrink-0">
                            +{tabldotMonthlySavings.toLocaleString('tr-TR')} ₺/ay
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-1.5">
                          Dışarıda bir öğün ortalama <strong>180 ₺</strong> iken, kampüste 1. basım <strong>40 ₺</strong>'dir.
                          Haftalık {weeklyFirstMeals + weeklySecondMeals} öğünün sağladığı aylık net tasarruf yaklaşık{' '}
                          <strong className="text-emerald-300">+{tabldotMonthlySavings.toLocaleString('tr-TR')} ₺</strong>'dir.
                        </p>
                      </div>
                    </div>

                    {/* Fırsat 2: Kocaeli Kart Akıllı Biniş Optimizasyonu */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-950/40 via-slate-900 to-slate-950 border border-orange-600/40 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#ff7324] flex items-center gap-1.5 min-w-0">
                            <Bus className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Toplu Taşıma Tasarrufu</span>
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-orange-950/90 text-orange-300 border border-orange-700/60 whitespace-nowrap shrink-0">
                            {smartTransportRecommendation.savings > 0
                              ? `+${smartTransportRecommendation.savings} ₺/ay`
                              : '⭐ En Karlı'}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-1.5">
                          Haftalık <strong>{weeklyTrips} biniş</strong> (ayda ~{monthlyTripsCount} sefer) yapıyorsun.
                          {smartTransportRecommendation.savings > 0 ? (
                            <>
                              {' '}Önerilen tarife ile tekil binişe göre ayda{' '}
                              <strong className="text-emerald-400">+{smartTransportRecommendation.savings} ₺</strong> net tasarruf edersin.
                            </>
                          ) : (
                            <> Mevcut seçimin biniş sayına göre en ekonomik olanıdır.</>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Fırsat 3: 8 Aylık Üniversite Dönemi Projeksiyonu */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#0b1b36] via-slate-900 to-slate-950 border border-cyan-600/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>8 Aylık Akademik Yıl Maliyeti</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-300">Güz + Bahar</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg sm:text-xl font-black text-white">
                          {(totalExpenses * 8).toLocaleString('tr-TR')} ₺
                        </span>
                        <span className="text-[10px] text-slate-400">/ 8 ay toplam gider</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-300">
                        8 aylık gelir: <strong>{(totalIncome * 8).toLocaleString('tr-TR')} ₺</strong>.{' '}
                        Dönem sonu net:{' '}
                        <strong className={isSurplus ? 'text-emerald-400' : 'text-rose-400'}>
                          {isSurplus ? '+' : ''}
                          {(netBalance * 8).toLocaleString('tr-TR')} ₺
                        </strong>
                      </p>
                    </div>

                    {/* Fırsat 4: Güvenlik Tamponu (Acil Durum Fonu) */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-600/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Tavsiye Edilen Acil Durum Fonu</span>
                        </span>
                        <span className="text-[10px] font-bold text-purple-300">1 Aylık Tampon</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg sm:text-xl font-black text-purple-300">
                          {mandatoryExpenses.toLocaleString('tr-TR')} ₺
                        </span>
                        <span className="text-[10px] text-slate-400">Hedef Birikim</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-300">
                        Kira, faturalar, telefon, yemekhane ve ulaşım gibi zorunlu masrafların toplamıdır.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* GÖRÜNÜM 4: DETAYLI MALİ BİLANÇO TABLOSU */}
              {analysisView === 'table' && (
                <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060c18] border border-slate-800 space-y-3 shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <Receipt className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Mali Bilanço Tablosu</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Günlük karşılıklar ve bütçe oranları
                      </span>
                    </div>
                    <span className="text-xs font-black text-white">
                      Toplam: {totalExpenses.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[10px] sm:text-[11px]">
                          <th className="py-2 px-2.5 font-bold">Harcama Kalemi</th>
                          <th className="py-2 px-1.5 font-bold">Statü</th>
                          <th className="py-2 px-2 font-bold text-right">Aylık</th>
                          <th className="py-2 px-2 font-bold text-right">Günlük</th>
                          <th className="py-2 px-2 font-bold text-right">Pay</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-[11px]">
                        {detailedExpenseData.map((item) => {
                          const pct = totalExpenses > 0 ? Math.round((item.value / totalExpenses) * 100) : 0;
                          const daily = Math.round(item.value / 30);
                          return (
                            <tr key={item.name} className="hover:bg-slate-900/50 transition-colors">
                              <td className="py-1.5 sm:py-2 px-2.5 font-medium text-white flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="truncate">{item.name}</span>
                              </td>
                              <td className="py-1.5 sm:py-2 px-1.5">
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                                  {item.category}
                                </span>
                              </td>
                              <td className="py-1.5 sm:py-2 px-2 text-right font-black text-white whitespace-nowrap">
                                {item.value.toLocaleString('tr-TR')} ₺
                              </td>
                              <td className="py-1.5 sm:py-2 px-2 text-right text-slate-300 font-medium whitespace-nowrap">
                                ~{daily.toLocaleString('tr-TR')} ₺
                              </td>
                              <td className="py-1.5 sm:py-2 px-2 text-right font-bold text-cyan-300 whitespace-nowrap">
                                %{pct}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-slate-900/80 font-black text-white text-xs">
                          <td className="py-2 px-2.5">TOPLAM</td>
                          <td className="py-2 px-1.5 text-[9px] text-cyan-300">8 Kalem</td>
                          <td className="py-2 px-2 text-right text-[#ff7324] whitespace-nowrap">
                            -{totalExpenses.toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="py-2 px-2 text-right text-slate-300 whitespace-nowrap">
                            ~{Math.round(totalExpenses / 30).toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="py-2 px-2 text-right text-cyan-300">%100</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

  );
};

export default GuideCharts;
