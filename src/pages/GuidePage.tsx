import React, { useState, useMemo, useEffect } from 'react';
import { PageId } from '../types';
import { COMMUNITY_LINKS } from '../constants/links';
import type { GuideChartsProps } from '../components/GuideCharts';
import { WeatherWidget } from '../components/WeatherWidget';
import { FinanceTicker } from '../components/FinanceTicker';
import {
  Compass,
  Bus,
  CreditCard,
  Utensils,
  Home,
  Coffee,
  PiggyBank,
  BookOpen,
  MapPin,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Info,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Wind,
  Plus,
  Minus,
  Wallet,
  Receipt,
  Scale,
  Copy,
  Check,
  Share2,
  Shirt,
  Smartphone,
  Flame,
  Clock,
  Zap,
  BarChart3,
  PieChart,
  Lightbulb,
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  Building2,
  Users,
  User,
  Edit3,
  QrCode,
  Bike,
  Navigation,
  Moon,
  CloudSnow,
  MapPinOff,
  Route
} from 'lucide-react';

interface GuidePageProps {
  onNavigate: (page: PageId) => void;
}

// Yaşam / Barınma Tipleri
type LivingType = 'kyk' | 'shared_house' | 'single_house' | 'family';

export const GuidePage: React.FC<GuidePageProps> = ({ onNavigate }) => {
  // Navigation tabs for the interactive calculator
  const [calcTab, setCalcTab] = useState<'expenses' | 'income' | 'summary'>('expenses');

  // recharts kod bolmesi: GuideCharts modulu ilk mountta yuklenir, analiz
  // sekmesi acildiginda hazir olur. Suspense yok (React #185 dongusune karsi).
  const [Charts, setCharts] = useState<React.ComponentType<GuideChartsProps> | null>(null);
  useEffect(() => {
    let alive = true;
    import('../components/GuideCharts')
      .then((m) => {
        if (alive) setCharts(() => m.default);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Copy status
  const [copiedSummary, setCopiedSummary] = useState(false);

  // ==========================================
  // 1. YAŞAM & BARINMA PROFİLİ (GERÇEKÇİ & SEZGİSEL)
  // ==========================================
  const [livingType, setLivingType] = useState<LivingType>('shared_house');

  // Kira ve faturalar (kişi başı)
  const [rent, setRent] = useState<number>(7500); // Kişi başı kira
  const [bills, setBills] = useState<number>(1250); // Faturalar (doğalgaz, elektrik, su, internet, aidat)

  // Paylaşımlı ev hesaplama yardımcısı (isteğe bağlı)
  const [totalFlatRent, setTotalFlatRent] = useState<number>(22500);
  const [roommatesCount, setRoommatesCount] = useState<number>(3);

  // Yaşam profili değiştiğinde mantıklı varsayılanları yükle
  const handleSelectLivingType = (type: LivingType) => {
    setLivingType(type);
    if (type === 'kyk') {
      setRent(1350); // KYK 4. Tip (Umuttepe banyolu standart - 2026/2027 güncel)
      setBills(0); // KYK'da elektrik, su, internet, ısınma 0 TL
      setGroceries(1200); // KYK'da sabah & akşam yemek ücretsiz olduğundan market sadece atıştırmalık
    } else if (type === 'shared_house') {
      setRent(7500); // 22.500 TL ev kirası / 3 kişi
      setBills(1250); // Kış doğalgazı dahil kişi başı fatura payı
      setGroceries(3500); // Evde yemek pişirme & temel market
    } else if (type === 'single_house') {
      setRent(14000); // 1+1 tek kişi daire
      setBills(2200); // Tek başına tüm faturalar
      setGroceries(4000); // Tek kişi market
    } else if (type === 'family') {
      setRent(0); // Aile evi
      setBills(0);
      setGroceries(800); // Kişisel küçük atıştırmalıklar
    }
  };

  // ==========================================
  // 2. KAMPÜS YEMEKHANESİ (1. BASIM 40 ₺ / 2. BASIM 100 ₺)
  // 1. Basım: Sübvansiyonlu öğle/öğün (40 ₺), haftada max 7 gün
  // 2. Basım: Günün 2. öğünü/akşam (100 ₺), haftada max 7 gün
  // ==========================================
  const [weeklyFirstMeals, setWeeklyFirstMeals] = useState<number>(5); // 1. basım (sübvansiyonlu 40 ₺, maks. 7 gün)
  const [weeklySecondMeals, setWeeklySecondMeals] = useState<number>(0); // 2. basım (ikinci öğün 100 ₺, maks. 7 gün)

  const MEAL_FIRST_FARE = 40; // KOÜ SKS tek basım öğrenci tabldot ücreti (40 ₺)
  const MEAL_SECOND_FARE = 100; // KOÜ SKS günün ikinci basım öğrenci tabldot ücreti (100 ₺)

  // Aylık yemekhane öğün sayıları: Haftalık gün x 4.2 hafta
  const monthlyFirstMeals = useMemo(() => {
    return Math.round(weeklyFirstMeals * 4.2);
  }, [weeklyFirstMeals]);

  const monthlySecondMeals = useMemo(() => {
    return Math.round(weeklySecondMeals * 4.2);
  }, [weeklySecondMeals]);

  const totalMonthlyCampusMeals = monthlyFirstMeals + monthlySecondMeals;

  const firstMealsCost = useMemo(() => {
    return monthlyFirstMeals * MEAL_FIRST_FARE;
  }, [monthlyFirstMeals]);

  const secondMealsCost = useMemo(() => {
    return monthlySecondMeals * MEAL_SECOND_FARE;
  }, [monthlySecondMeals]);

  // Toplam Aylık Yemekhane Maliyeti (1. basım + 2. basım)
  const monthlyCampusMealCost = useMemo(() => {
    return firstMealsCost + secondMealsCost;
  }, [firstMealsCost, secondMealsCost]);

  // ==========================================
  // 3. ULAŞIM (HAFTALIK BİNİŞ FREKANSI, AKILLI ÖNERİ & TÜM MODÜLER SEÇENEKLER)
  // 25 Mayıs 2026 Tarihli UKOME Güncel Tarifesi:
  // Tam bilet 42,00 ₺, Öğrenci binişi (karttan düşen) 20,50 ₺ (Resmi 27,25 ₺, B.Şehir desteğiyle)
  // Abonman binişi 58 kontör (14,50 ₺). 1. Kademe 25 biniş, 2. Kademe 50 biniş, 3. Kademe 100 biniş
  // ==========================================
  const [weeklyTrips, setWeeklyTrips] = useState<number>(10); // Haftada kaç kez biniyor (varsayılan: 5 gün gidiş-dönüş = 10)
  const [transportChoice, setTransportChoice] = useState<'smart' | 'single' | 'abonman1' | 'abonman2' | 'abonman3' | 'none'>('smart');

  const SINGLE_BUS_FARE = 20.5; // UKOME Kocaeli Kart öğrenci tek biniş fiili tutarı (20,50 ₺)
  const ABONMAN_1_PRICE = 362.5; // 1. Kademe Abonman (1.450 kontör / 58 = 25 biniş)
  const ABONMAN_2_PRICE = 725.0; // 2. Kademe Abonman (2.900 kontör / 58 = 50 biniş)
  const ABONMAN_3_PRICE = 1450.0; // 3. Kademe Abonman (5.800 kontör / 58 = 100 biniş)

  // Aylık biniş adedi: Haftalık x 4.2 hafta
  const monthlyTripsCount = useMemo(() => {
    return Math.round(weeklyTrips * 4.2);
  }, [weeklyTrips]);

  // Her seçeneğin net aylık maliyeti:
  const payAsYouGoCost = useMemo(() => {
    return Math.round(monthlyTripsCount * SINGLE_BUS_FARE);
  }, [monthlyTripsCount]);

  const abonman1OptimizedCost = useMemo(() => {
    if (monthlyTripsCount <= 25) return Math.round(ABONMAN_1_PRICE);
    const extra = monthlyTripsCount - 25;
    return Math.round(ABONMAN_1_PRICE + extra * SINGLE_BUS_FARE);
  }, [monthlyTripsCount]);

  const abonman2OptimizedCost = useMemo(() => {
    if (monthlyTripsCount <= 50) return Math.round(ABONMAN_2_PRICE);
    const extra = monthlyTripsCount - 50;
    return Math.round(ABONMAN_2_PRICE + extra * SINGLE_BUS_FARE);
  }, [monthlyTripsCount]);

  const abonman3OptimizedCost = useMemo(() => {
    if (monthlyTripsCount <= 100) return Math.round(ABONMAN_3_PRICE);
    const extra = monthlyTripsCount - 100;
    return Math.round(ABONMAN_3_PRICE + extra * SINGLE_BUS_FARE);
  }, [monthlyTripsCount]);

  // Akıllı En Uygun Seçenek Tespiti (Matematiksel Karşılaştırma)
  const smartTransportRecommendation = useMemo(() => {
    if (weeklyTrips === 0) {
      return {
        bestMode: 'none' as const,
        cost: 0,
        title: 'Yürüme / Masrafsız',
        desc: 'Kampüste kaldığın veya yürüdüğün için aylık yol giderin 0 ₺.',
        savings: 0,
      };
    }

    const transitOptions = [
      { mode: 'single' as const, cost: payAsYouGoCost, title: 'Tekil Biniş (Karta TL Yükleme)', desc: `Ayda ~${monthlyTripsCount} biniş için tekil basım (20,50 ₺).` },
      { mode: 'abonman1' as const, cost: abonman1OptimizedCost, title: '1. Kademe Abonman (362,50 ₺)', desc: `25 biniş abonman${monthlyTripsCount > 25 ? ` + artan ${monthlyTripsCount - 25} biniş tekil kart` : ''}.` },
      { mode: 'abonman2' as const, cost: abonman2OptimizedCost, title: '2. Kademe Abonman (725,00 ₺)', desc: `50 biniş abonman${monthlyTripsCount > 50 ? ` + artan ${monthlyTripsCount - 50} biniş tekil kart` : ''}.` },
      { mode: 'abonman3' as const, cost: abonman3OptimizedCost, title: '3. Kademe Abonman (1.450,00 ₺)', desc: `100 biniş abonman (Uzak hatlar & yoğun seferler).` },
    ];

    let best = transitOptions[0];
    for (const opt of transitOptions) {
      if (opt.cost < best.cost) {
        best = opt;
      }
    }

    const savings = Math.max(0, Math.round(payAsYouGoCost - best.cost));

    return {
      bestMode: best.mode,
      cost: best.cost,
      title: best.title,
      desc: best.desc,
      savings,
    };
  }, [weeklyTrips, monthlyTripsCount, payAsYouGoCost, abonman1OptimizedCost, abonman2OptimizedCost, abonman3OptimizedCost]);

  // Efektif aylık ulaşım maliyeti (Seçilen moda göre)
  const monthlyTransportCost = useMemo(() => {
    if (transportChoice === 'smart') return Math.round(smartTransportRecommendation.cost);
    if (transportChoice === 'none') return 0;
    if (transportChoice === 'single') return payAsYouGoCost;
    if (transportChoice === 'abonman1') return abonman1OptimizedCost;
    if (transportChoice === 'abonman2') return abonman2OptimizedCost;
    if (transportChoice === 'abonman3') return abonman3OptimizedCost;
    return payAsYouGoCost;
  }, [transportChoice, smartTransportRecommendation, payAsYouGoCost, abonman1OptimizedCost, abonman2OptimizedCost, abonman3OptimizedCost]);

  // ==========================================
  // 4. MARKET, SOSYAL YAŞAM & DİĞER HARCAMALAR
  // ==========================================
  const [groceries, setGroceries] = useState<number>(3500); // Mutfak, market, kahvaltılık
  const [socialCoffee, setSocialCoffee] = useState<number>(2000); // Kafe, dışarıda sosyalleşme
  const [phoneBill, setPhoneBill] = useState<number>(350); // Kişisel GSM / Mobil hat faturası (Öğrenci paketi)
  const [stationeryEtc, setStationeryEtc] = useState<number>(500); // Fotokopi, ders, kitap
  const [showFlatmateCalc, setShowFlatmateCalc] = useState<boolean>(false); // Ev arkadaşı bölüşüm aracı

  // ==========================================
  // 5. GELİRLER & BURSLAR (GÜNCEL 4.000 ₺ KYK BURSU)
  // ==========================================
  const [kykBursary, setKykBursary] = useState<number>(4000); // Güncel KYK burs/kredi tutarı
  const [familySupport, setFamilySupport] = useState<number>(8000); // Aile desteği / harçlık
  const [otherBursary, setOtherBursary] = useState<number>(0); // Vakıf / kurum bursu
  const [partTimeIncome, setPartTimeIncome] = useState<number>(0); // Ek gelir

  // Toplam Aylık Gider
  const totalExpenses = useMemo(() => {
    return Math.round(
      rent +
        bills +
        phoneBill +
        monthlyCampusMealCost +
        monthlyTransportCost +
        groceries +
        socialCoffee +
        stationeryEtc
    );
  }, [
    rent,
    bills,
    phoneBill,
    monthlyCampusMealCost,
    monthlyTransportCost,
    groceries,
    socialCoffee,
    stationeryEtc,
  ]);

  // Toplam Aylık Gelir
  const totalIncome = useMemo(() => {
    return Math.round(kykBursary + familySupport + otherBursary + partTimeIncome);
  }, [kykBursary, familySupport, otherBursary, partTimeIncome]);

  // Net Bakiye ve Durum
  const netBalance = totalIncome - totalExpenses;
  const isSurplus = netBalance >= 0;

  // Harcama Dağılım Oranları
  const housingTotal = rent + bills;
  const foodTotal = monthlyCampusMealCost + groceries;
  const transportTotal = monthlyTransportCost;
  const socialTotal = socialCoffee + stationeryEtc + phoneBill;

  const housingPct = totalExpenses > 0 ? Math.round((housingTotal / totalExpenses) * 100) : 0;
  const foodPct = totalExpenses > 0 ? Math.round((foodTotal / totalExpenses) * 100) : 0;
  const transportPct = totalExpenses > 0 ? Math.round((transportTotal / totalExpenses) * 100) : 0;
  const socialPct = totalExpenses > 0 ? Math.max(0, 100 - (housingPct + foodPct + transportPct)) : 0;

  // Gelir vs Gider Oranı
  const expenseToIncomeRatio = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 100;

  // Akıllı Metrik: Zorunlu Giderler (Kira + Fatura + Telefon + Ulaşım + Kampüs Yemekhanesi) Çıktıktan Sonra
  // Günlük Serbest Harçlık
  const mandatoryExpenses = rent + bills + phoneBill + monthlyTransportCost + monthlyCampusMealCost;
  const remainingFreeMonthly = totalIncome - mandatoryExpenses;
  const dailyFreeAllowance = Math.round(Math.max(0, remainingFreeMonthly) / 30);

  // Finansal Sağlık Skoru
  const budgetHealthScore = useMemo(() => {
    if (totalIncome === 0) return 30;
    if (netBalance >= 2000) return 96;
    if (netBalance >= 500) return 85;
    if (netBalance >= 0) return 75;
    if (netBalance >= -1500) return 55;
    return 38;
  }, [totalIncome, netBalance]);

  // Detaylı Bütçe Analizi Alt Görünüm Sekmesi
  const [analysisView, setAnalysisView] = useState<'charts' | 'comparison' | 'insights' | 'table'>('charts');

  // Detaylı Grafik Veri Kümeleri
  const detailedExpenseData = useMemo(() => [
    { name: 'Kira / Barınma', value: rent, color: '#06b6d4', category: 'Zorunlu' },
    { name: 'Faturalar & Aidat', value: bills, color: '#38bdf8', category: 'Zorunlu' },
    { name: 'GSM / Telefon', value: phoneBill, color: '#a855f7', category: 'Zorunlu' },
    { name: 'Kampüs Yemekhanesi', value: monthlyCampusMealCost, color: '#10b981', category: 'Sübvansiyonlu' },
    { name: 'Market & Mutfak', value: groceries, color: '#f59e0b', category: 'Temel' },
    { name: 'Kocaeli Kart', value: monthlyTransportCost, color: '#ff7324', category: 'Ulaşım' },
    { name: 'Kafe & Sosyal', value: socialCoffee, color: '#ec4899', category: 'Sosyal' },
    { name: 'Diğer', value: stationeryEtc, color: '#94a3b8', category: 'Diğer' },
  ].filter(item => item.value > 0), [
    rent,
    bills,
    phoneBill,
    monthlyCampusMealCost,
    groceries,
    monthlyTransportCost,
    socialCoffee,
    stationeryEtc
  ]);

  const incomeVsExpenseData = useMemo(() => [
    {
      name: 'Aylık Akış',
      Gelir: totalIncome,
      Gider: totalExpenses,
    }
  ], [totalIncome, totalExpenses]);

  const categoryBarData = useMemo(() => [
    { name: 'Barınma', Tutar: housingTotal, color: '#06b6d4' },
    { name: 'Beslenme', Tutar: foodTotal, color: '#10b981' },
    { name: 'Toplu Taşıma', Tutar: transportTotal, color: '#ff7324' },
    { name: 'Sosyal & Diğer', Tutar: socialTotal, color: '#ec4899' },
  ], [housingTotal, foodTotal, transportTotal, socialTotal]);

  const kykCoveragePct = totalExpenses > 0 ? Math.round((kykBursary / totalExpenses) * 100) : 0;
  // Dışarıda ortalama bir tabldot 180 ₺ iken; 1. basım (40 ₺) 140 ₺ tasarruf, 2. basım (100 ₺) 80 ₺ tasarruf
  const tabldotMonthlySavings = Math.round(monthlyFirstMeals * 140 + monthlySecondMeals * 80);

  // Panoya Kopyalama Fonksiyonu
  const handleCopySummary = () => {
    const transportModeLabel =
      transportChoice === 'smart'
        ? `⚡ Akıllı Otomatik (${smartTransportRecommendation.title})`
        : transportChoice === 'single'
        ? 'Tekil Biniş (20,50 ₺)'
        : transportChoice === 'abonman1'
        ? '1. Kademe Abonman (362,50 ₺ / 25 Biniş)'
        : transportChoice === 'abonman2'
        ? '2. Kademe Abonman (725,00 ₺ / 50 Biniş)'
        : transportChoice === 'abonman3'
        ? '3. Kademe Abonman (1.450,00 ₺ / 100 Biniş)'
        : '0 ₺ (Kampüste / Yürüme)';

    const summaryText = `🎓 KOCAELİ ÜNİVERSİTESİ ÖĞRENCİ AYLIK BÜTÇE RAPORU
────────────────────────────────────────
💰 TOPLAM AYLIK GELİR: ${totalIncome.toLocaleString('tr-TR')} ₺
   • KYK Bursu / Kredisi: ${kykBursary.toLocaleString('tr-TR')} ₺ (Resmi 4.000 ₺)
   • Aile Harçlığı / Desteği: ${familySupport.toLocaleString('tr-TR')} ₺
   • Özel Kurum / Vakıf Bursu: ${otherBursary.toLocaleString('tr-TR')} ₺
   • Ek / Yarı Zamanlı Gelir: ${partTimeIncome.toLocaleString('tr-TR')} ₺

💸 TOPLAM AYLIK GİDER: ${totalExpenses.toLocaleString('tr-TR')} ₺
   • Barınma & Kira Payı: ${rent.toLocaleString('tr-TR')} ₺
   • Ev Faturaları & Aidat: ${bills.toLocaleString('tr-TR')} ₺
   • Kişisel GSM / Telefon Faturası: ${phoneBill.toLocaleString('tr-TR')} ₺
   • KOÜ Kampüs Yemekhanesi: ${monthlyCampusMealCost.toLocaleString('tr-TR')} ₺ (1. Basım: ${weeklyFirstMeals} gün/hf [40 ₺], 2. Basım: ${weeklySecondMeals} gün/hf [100 ₺] = Toplam ~${totalMonthlyCampusMeals} öğün/ay)
   • Kocaeli Kart Ulaşım: ${monthlyTransportCost.toLocaleString('tr-TR')} ₺ [${transportModeLabel}] (Haftada ${weeklyTrips} biniş = Ayda ~${monthlyTripsCount} biniş)
   • Market & Temel Mutfak: ${groceries.toLocaleString('tr-TR')} ₺
   • Kafe & Sosyal Yaşam: ${socialCoffee.toLocaleString('tr-TR')} ₺
   • Diğer: ${stationeryEtc.toLocaleString('tr-TR')} ₺
────────────────────────────────────────
⚖️ NET BAKİYE: ${isSurplus ? '+' : ''}${netBalance.toLocaleString('tr-TR')} ₺ (${isSurplus ? 'BÜTÇEN DENGEDE' : 'AYLIK BÜTÇE AÇIĞI'})
📊 GÜNLÜK SERBEST HARÇLIK LİMİTİ: ${dailyFreeAllowance.toLocaleString('tr-TR')} ₺ / Gün
💡 Kocaeli Sosyal Hub Speaking Club, Doğa Yürüyüşleri ve Atölyeleri %100 ÜCRETSİZDİR!
🔗 kocaeli-sosyal-hub.org/rehber`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = summaryText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-8 sm:space-y-12 text-slate-100">
      {/* 1. HERO BAŞLIK */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/15 text-[#00d2eb] border border-cyan-500/30">
          <Compass className="w-3.5 h-3.5" />
          <span>KOCAELİ ÜNİVERSİTELİ YAŞAM &amp; HAYATTA KALMA KİTİ</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Kocaeli Öğrenci Bütçe &amp; Yaşam Rehberi
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
          Kocaeli Üniversitesi öğrencileri için Umuttepe ve tüm yerleşkelere uyumlu barınma modelleri, KOÜ yemekhanesi sübvansiyonlu 1. basım (40 ₺) ve 2. basım (100 ₺) tarifeleri, UKOME Kocaeli Kart abonman ve tekil biniş karşılaştırmaları ile güncel <strong>4.000 ₺ KYK bursu</strong> üzerinden hesaplanan kapsamlı aylık geçinme ve finans simülatörü.
        </p>
      </div>

      {/* CANLI KAMPÜS & ŞEHİR HAVA DURUMU (ÖN BİLGİ BARI) */}
      <div className="max-w-4xl mx-auto space-y-3">
        <WeatherWidget badgeLabel="CANLI KAMPÜS MİKROKLİMA &amp; SAAT" showAllDistricts={false} />
        <FinanceTicker />
      </div>

      {/* 2. BÜTÇE HESAPLAYICISI VE SİMÜLATÖR */}
      <section className="bg-[#091222] p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-cyan-500/30 shadow-2xl space-y-3.5 sm:space-y-6">
        {/* Başlık ve Hızlı Durum Kartı */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3 sm:pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#ff7324]">
              <PiggyBank className="w-3.5 h-3.5" />
              <span>GERÇEKÇİ ÖĞRENCİ FİNANS SİMÜLATÖRÜ</span>
            </div>
            <h2 className="font-display text-lg sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">
              Aylık Gelir &amp; Geçinme Hesaplayıcısı
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              KOÜ yemekhane (1. basım 40 ₺ / 2. basım 100 ₺), UKOME Kocaeli Kart akıllı biniş ve güncel 4.000 ₺ KYK bursuyla finans simülasyonu.
            </p>
          </div>

          {/* Canlı Bakiye & Kopyalama (Mobilde Kompakt Tek Satır Şerit) */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#060b14] p-1.5 sm:p-2.5 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl border border-slate-800 self-stretch md:self-auto justify-between md:justify-start">
            <div className="text-left">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block leading-tight">Gelir</span>
              <span className="text-xs sm:text-sm font-black text-emerald-400 leading-tight">
                +{totalIncome.toLocaleString('tr-TR')} ₺
              </span>
            </div>
            <div className="w-px h-6 sm:h-7 bg-slate-800" />
            <div className="text-left">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block leading-tight">Gider</span>
              <span className="text-xs sm:text-sm font-black text-[#ff7324] leading-tight">
                -{totalExpenses.toLocaleString('tr-TR')} ₺
              </span>
            </div>
            <div className="w-px h-6 sm:h-7 bg-slate-800" />
            <div className="text-left">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block leading-tight">Net Durum</span>
              <span
                className={`text-xs sm:text-sm font-black leading-tight ${
                  isSurplus ? 'text-emerald-300' : 'text-rose-400'
                }`}
              >
                {isSurplus ? '+' : ''}
                {netBalance.toLocaleString('tr-TR')} ₺
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopySummary}
              title="Hesaplama sonucunu panoya kopyala"
              className={`ml-auto p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border shrink-0 ${
                copiedSummary
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-[#10345e] hover:bg-cyan-700/80 border-cyan-400/50 text-white'
              }`}
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-200" />
                  <span className="text-[10px] sm:text-[11px] font-bold">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#00d2eb]" />
                  <span className="text-[10px] sm:text-[11px] font-bold hidden sm:inline">Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Switcher (Mobile First Segmented Control - Kompakt & Kırılmasız) */}
        <div className="grid grid-cols-3 gap-1 bg-[#050a14] p-1 rounded-xl sm:rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setCalcTab('expenses')}
            className={`py-1.5 sm:py-2 px-1 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
              calcTab === 'expenses'
                ? 'bg-[#10345e] text-white shadow-sm border border-cyan-400/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff7324] shrink-0" />
            <span className="truncate">1. Gider ({totalExpenses.toLocaleString('tr-TR')} ₺)</span>
          </button>

          <button
            type="button"
            onClick={() => setCalcTab('income')}
            className={`py-1.5 sm:py-2 px-1 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
              calcTab === 'income'
                ? 'bg-[#10345e] text-white shadow-sm border border-cyan-400/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">2. Gelir ({totalIncome.toLocaleString('tr-TR')} ₺)</span>
          </button>

          <button
            type="button"
            onClick={() => setCalcTab('summary')}
            className={`py-1.5 sm:py-2 px-1 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
              calcTab === 'summary'
                ? 'bg-[#10345e] text-white shadow-sm border border-cyan-400/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00d2eb] shrink-0" />
            <span className="truncate">3. Analiz</span>
          </button>
        </div>

        {/* TAB 1: GİDERLER (EXPENSES) */}
        {calcTab === 'expenses' && (
          <div className="space-y-3.5 sm:space-y-6">
            {/* YAŞAM VE BARINMA MODELİ HIZLI SEÇİCİ */}
            <div className="space-y-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Nerede Kalıyorsun? (Hızlı Profil):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectLivingType('kyk')}
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    livingType === 'kyk'
                      ? 'bg-[#10345e] border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#00d2eb] shrink-0" />
                    <span className="text-[11px] sm:text-xs font-black truncate">KYK Yurdu</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold mt-0.5 truncate">
                    1.350 ₺ (Fatura 0 ₺)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectLivingType('shared_house')}
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    livingType === 'shared_house'
                      ? 'bg-[#10345e] border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#00d2eb] shrink-0" />
                    <span className="text-[11px] sm:text-xs font-black truncate">Paylaşımlı Ev</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-cyan-300 font-semibold mt-0.5 truncate">
                    7.500 ₺ (Kişi Başı)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectLivingType('single_house')}
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    livingType === 'single_house'
                      ? 'bg-[#10345e] border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#00d2eb] shrink-0" />
                    <span className="text-[11px] sm:text-xs font-black truncate">Tek Başına 1+1</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-pink-300 font-semibold mt-0.5 truncate">
                    14.000 ₺ (Müstakil)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectLivingType('family')}
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    livingType === 'family'
                      ? 'bg-[#10345e] border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#00d2eb] shrink-0" />
                    <span className="text-[11px] sm:text-xs font-black truncate">Aile Yanı</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold mt-0.5 truncate">
                    0 ₺ Kira/Fatura
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
              {/* =========================================================================
                  1. KİRA VE FATURALAR (PSİKOLOJİK OLARAK DİREKT DEĞİŞTİRİLEBİLİR ALAN)
                  ========================================================================= */}
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060c18] border border-cyan-500/40 space-y-2.5 sm:space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00d2eb]" />
                    <span>Aylık Kira Payın (Kişisel)</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/50 flex items-center gap-1">
                    <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Yaz / Ayarla</span>
                  </span>
                </div>

                {/* DOKUNMATİK SAYI GİRİŞİ (MOBİLDE KOMPAKT) */}
                <div className="bg-slate-900/95 border-2 border-cyan-500/50 hover:border-cyan-400 focus-within:border-cyan-400 rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center justify-between gap-2 shadow-inner transition-all">
                  <button
                    type="button"
                    onClick={() => setRent((prev) => Math.max(0, prev - 250))}
                    className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white flex items-center justify-center font-black text-lg sm:text-xl transition-all cursor-pointer shrink-0 border border-slate-700"
                    title="250 ₺ Azalt"
                  >
                    -
                  </button>

                  <div className="flex-1 text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={rent}
                        aria-label="Aylık kira payın, Türk lirası"
                        onChange={(e) => setRent(Math.max(0, Number(e.target.value)))}
                        className="w-28 sm:w-44 text-center text-2xl sm:text-4xl font-black text-white bg-transparent outline-hidden tracking-tight cursor-text"
                      />
                      <span className="text-xl sm:text-3xl font-black text-[#00d2eb] ml-0.5">₺</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                      Rakamı dokunup yazabilir veya +/- ile değiştirebilirsin
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRent((prev) => prev + 250)}
                    className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white flex items-center justify-center font-black text-lg sm:text-xl transition-all cursor-pointer shrink-0 border border-slate-700"
                    title="250 ₺ Artır"
                  >
                    +
                  </button>
                </div>

                {/* HIZLI AYAR BUTONLARI (MOBİLDE YATAY KAYDIRILABİLİR) */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 sm:flex-wrap sm:justify-center">
                  {[
                    { label: 'KYK Yurdu', val: 1350 },
                    { label: 'Dünya Bankası', val: 7500 },
                    { label: 'Bayındırlık', val: 8500 },
                    { label: 'Yahyakaptan', val: 10000 },
                    { label: '1+1 Tek', val: 14000 }
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setRent(item.val)}
                      className={`text-[10px] sm:text-[11px] px-2 py-0.5 sm:py-1 rounded-lg border font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        rent === item.val
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label} ({item.val.toLocaleString('tr-TR')} ₺)
                    </button>
                  ))}
                </div>

                {/* EV ARKADAŞI KİRA BÖLÜŞÜM ARACI (MODÜLER) */}
                <div className="pt-1.5 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setShowFlatmateCalc(!showFlatmateCalc)}
                    className="text-[10px] sm:text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-between w-full p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-950/30 border border-cyan-800/40 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Ev Arkadaşı Paylaşım Aracı (Toplam Kiradan Böl)</span>
                    </span>
                    <span>{showFlatmateCalc ? '▲ Kapat' : '▼ Aç & Hesapla'}</span>
                  </button>

                  {showFlatmateCalc && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-cyan-600/30 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[9px] sm:text-[10px] text-slate-400 block font-bold mb-0.5">Toplam Daire Kirası:</label>
                          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 sm:py-1">
                            <input
                              type="number"
                              min="0"
                              step="500"
                              value={totalFlatRent}
                              aria-label="Toplam daire kirası, Türk lirası"
                              onChange={(e) => setTotalFlatRent(Math.max(0, Number(e.target.value)))}
                              className="w-full text-xs font-bold text-white bg-transparent outline-hidden"
                            />
                            <span className="text-[10px] text-slate-400 font-bold ml-1">₺</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] sm:text-[10px] text-slate-400 block font-bold mb-0.5">Evdeki Kişi Sayısı:</label>
                          <div className="flex items-center gap-1">
                            {[2, 3, 4].map((count) => (
                              <button
                                key={count}
                                type="button"
                                onClick={() => setRoommatesCount(count)}
                                className={`flex-1 py-0.5 sm:py-1 text-xs rounded-lg font-bold border transition-all cursor-pointer ${
                                  roommatesCount === count
                                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                    : 'bg-slate-900 border-slate-700 text-slate-400'
                                }`}
                              >
                                {count} K
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-300">
                          Kişi Başı:{' '}
                          <strong className="text-cyan-400 font-black">
                            {Math.round(totalFlatRent / roommatesCount).toLocaleString('tr-TR')} ₺
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setRent(Math.round(totalFlatRent / roommatesCount))}
                          className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs"
                        >
                          Uygula
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* FATURALAR & AİDAT (KİŞİ BAŞI) */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-slate-200 font-bold block text-[11px] sm:text-xs">Kişi Başı Fatura &amp; Aidat:</span>
                    <span className="text-[9px] text-slate-400">Doğalgaz, elektrik, su, internet</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setBills((b) => Math.max(0, b - 100))}
                      aria-label="Fatura ve aidat tutarını 100 lira azalt"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-black text-sm sm:text-base cursor-pointer"
                    >
                      -
                    </button>
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 sm:py-1">
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={bills}
                        aria-label="Kişi başı fatura ve aidat, Türk lirası"
                        onChange={(e) => setBills(Math.max(0, Number(e.target.value)))}
                        className="w-14 sm:w-16 text-right text-xs font-bold text-white bg-transparent outline-hidden"
                      />
                      <span className="text-xs text-slate-400 font-bold ml-1">₺</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBills((b) => b + 100)}
                      aria-label="Fatura ve aidat tutarını 100 lira artır"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-black text-sm sm:text-base cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  2. KAMPÜS YEMEKHANESİ (1. BASIM 40 ₺ / 2. BASIM 100 ₺)
                  ========================================================================= */}
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060c18] border border-emerald-500/40 space-y-2.5 sm:space-y-4 shadow-lg">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 sm:pb-3">
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                      <span>KOÜ Yemekhanesi (1. &amp; 2. Basım)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Ayda ~{totalMonthlyCampusMeals} öğün (1. basım 40 ₺, 2. basım 100 ₺)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-800/50 shrink-0">
                    {monthlyCampusMealCost.toLocaleString('tr-TR')} ₺/ay
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
                  {/* 1. BASIM (SÜBVANSİYONLU - 40 ₺) */}
                  <div className="p-2.5 sm:p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">1. Basım (Öğle)</span>
                        <span className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold">40 ₺ (Maks. 7 gün)</span>
                      </div>
                      <span className="text-xs font-black text-emerald-300">
                        {firstMealsCost.toLocaleString('tr-TR')} ₺/ay
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-1.5 sm:p-2 flex items-center justify-between gap-2 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setWeeklyFirstMeals((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center font-black text-base sm:text-lg transition-all cursor-pointer border border-slate-700"
                        title="1 Gün Azalt"
                      >
                        -
                      </button>

                      <div className="text-center">
                        <div className="inline-flex items-center justify-center">
                          <input
                            type="number"
                            min="0"
                            max="7"
                            value={weeklyFirstMeals}
                            aria-label="Birinci basım haftalık öğün günü"
                            onChange={(e) => setWeeklyFirstMeals(Math.max(0, Math.min(7, Number(e.target.value))))}
                            className="w-10 sm:w-12 text-center text-xl sm:text-2xl font-black text-white bg-transparent outline-hidden tracking-tight cursor-text"
                          />
                          <span className="text-xs font-bold text-emerald-400 ml-0.5">Gün</span>
                        </div>
                        <p className="text-[9px] text-slate-400">
                          Ayda ~<strong className="text-white">{monthlyFirstMeals} öğün</strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setWeeklyFirstMeals((prev) => Math.min(7, prev + 1))}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center font-black text-base sm:text-lg transition-all cursor-pointer border border-slate-700"
                        title="1 Gün Artır"
                      >
                        +
                      </button>
                    </div>

                    {/* Hızlı Seçim Butonları */}
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { count: 0, label: '0 G' },
                        { count: 3, label: '3 G' },
                        { count: 5, label: '5 G' },
                        { count: 7, label: '7 G' }
                      ].map((item) => (
                        <button
                          key={item.count}
                          type="button"
                          onClick={() => setWeeklyFirstMeals(item.count)}
                          className={`py-1 px-1 rounded-lg text-center border text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                            weeklyFirstMeals === item.count
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. BASIM (İKİNCİ ÖĞÜN / AKŞAM - 100 ₺) */}
                  <div className="p-2.5 sm:p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">2. Basım (Akşam)</span>
                        <span className="text-[9px] sm:text-[10px] text-cyan-400 font-semibold">100 ₺ (Maks. 7 gün)</span>
                      </div>
                      <span className="text-xs font-black text-cyan-300">
                        {secondMealsCost.toLocaleString('tr-TR')} ₺/ay
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="bg-slate-950 border border-cyan-500/40 rounded-xl p-1.5 sm:p-2 flex items-center justify-between gap-2 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setWeeklySecondMeals((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center font-black text-base sm:text-lg transition-all cursor-pointer border border-slate-700"
                        title="1 Gün Azalt"
                      >
                        -
                      </button>

                      <div className="text-center">
                        <div className="inline-flex items-center justify-center">
                          <input
                            type="number"
                            min="0"
                            max="7"
                            value={weeklySecondMeals}
                            aria-label="İkinci basım haftalık öğün günü"
                            onChange={(e) => setWeeklySecondMeals(Math.max(0, Math.min(7, Number(e.target.value))))}
                            className="w-10 sm:w-12 text-center text-xl sm:text-2xl font-black text-white bg-transparent outline-hidden tracking-tight cursor-text"
                          />
                          <span className="text-xs font-bold text-cyan-400 ml-0.5">Gün</span>
                        </div>
                        <p className="text-[9px] text-slate-400">
                          Ayda ~<strong className="text-white">{monthlySecondMeals} öğün</strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setWeeklySecondMeals((prev) => Math.min(7, prev + 1))}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center font-black text-base sm:text-lg transition-all cursor-pointer border border-slate-700"
                        title="1 Gün Artır"
                      >
                        +
                      </button>
                    </div>

                    {/* Hızlı Seçim Butonları */}
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { count: 0, label: '0 G' },
                        { count: 2, label: '2 G' },
                        { count: 5, label: '5 G' },
                        { count: 7, label: '7 G' }
                      ].map((item) => (
                        <button
                          key={item.count}
                          type="button"
                          onClick={() => setWeeklySecondMeals(item.count)}
                          className={`py-1 px-1 rounded-lg text-center border text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                            weeklySecondMeals === item.count
                              ? 'bg-cyan-600 text-white border-cyan-400 shadow-xs'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ÖZET VE TASARRUF BİLGİSİ */}
                <div className="pt-1.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-400">
                  <span>Haftada {weeklyFirstMeals + weeklySecondMeals} öğün (~{totalMonthlyCampusMeals} tabldot/ay)</span>
                  <span className="text-emerald-400 font-bold">
                    Dışarıya göre tasarruf: +{tabldotMonthlySavings.toLocaleString('tr-TR')} ₺/ay
                  </span>
                </div>
              </div>

              {/* =========================================================================
                  3. TOPLU TAŞIMA (HEM AKILLI TAVSİYE HEM TÜM MODÜLER SEÇENEKLER)
                  ========================================================================= */}
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060c18] border border-orange-500/40 space-y-2.5 sm:space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff7324]" />
                    <span>Toplu Taşıma (Haftalık Sefer &amp; Kart)</span>
                  </span>
                  <span className="text-xs font-bold text-[#ff7324] bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-800/50">
                    {monthlyTransportCost.toLocaleString('tr-TR')} ₺/ay
                  </span>
                </div>

                {/* HAFTALIK BİNİŞ STEPPERI */}
                <div className="bg-slate-900/95 border-2 border-orange-500/50 hover:border-[#ff7324] focus-within:border-[#ff7324] rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center justify-between gap-2 transition-all shadow-inner">
                  <button
                    type="button"
                    onClick={() => setWeeklyTrips((prev) => Math.max(0, prev - 2))}
                    className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white flex items-center justify-center font-black text-lg sm:text-xl transition-all cursor-pointer shrink-0 border border-slate-700"
                    title="2 Biniş Azalt"
                  >
                    -
                  </button>

                  <div className="flex-1 text-center">
                    <div className="inline-flex items-center justify-center">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        value={weeklyTrips}
                        aria-label="Haftalık toplu taşıma biniş sayısı"
                        onChange={(e) => setWeeklyTrips(Math.max(0, Math.min(40, Number(e.target.value))))}
                        className="w-14 sm:w-16 text-center text-2xl sm:text-4xl font-black text-white bg-transparent outline-hidden tracking-tight cursor-text"
                      />
                      <span className="text-sm sm:text-lg font-bold text-[#ff7324] ml-1">Biniş / Hf</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                      Ayda ~<strong className="text-white">{monthlyTripsCount} sefer</strong> (Otobüs / Tramvay)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setWeeklyTrips((prev) => Math.min(40, prev + 2))}
                    className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white flex items-center justify-center font-black text-lg sm:text-xl transition-all cursor-pointer shrink-0 border border-slate-700"
                    title="2 Biniş Artır"
                  >
                    +
                  </button>
                </div>

                {/* HIZLI BİNİŞ BUTONLARI (MOBİLDE YATAY KAYDIRILABİLİR) */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 sm:flex-wrap sm:justify-center">
                  {[
                    { label: '0 (Yürüme)', count: 0 },
                    { label: '4 (2 Gün)', count: 4 },
                    { label: '10 (5 Gün G-D)', count: 10 },
                    { label: '14 (Hergün)', count: 14 },
                    { label: '20 (Aktarmalı)', count: 20 }
                  ].map((chip) => (
                    <button
                      key={chip.count}
                      type="button"
                      onClick={() => setWeeklyTrips(chip.count)}
                      className={`text-[10px] px-2 py-0.5 sm:py-1 rounded-lg border font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        weeklyTrips === chip.count
                          ? 'bg-orange-600 text-white border-orange-400 shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* AKILLI HESAPLANAN TAVSİYE & NET TASARRUF BANNERI */}
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-gradient-to-r from-orange-950/60 via-slate-900 to-[#10243e] border border-orange-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-white">
                        <Zap className="w-3 h-3 fill-[#ff7324] text-[#ff7324]" />
                        {smartTransportRecommendation.title}
                      </span>
                      {smartTransportRecommendation.savings > 0 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-600/70 whitespace-nowrap">
                          +{smartTransportRecommendation.savings} ₺/ay Tasarruf
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 leading-tight">
                      {smartTransportRecommendation.desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTransportChoice('smart')}
                    className={`px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer shrink-0 border self-end sm:self-auto ${
                      transportChoice === 'smart'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-sm ring-1 ring-cyan-400/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-cyan-800/60'
                    }`}
                  >
                    {transportChoice === 'smart' ? '✓ Akıllı Mod Aktif' : '⚡ Akıllı Seç'}
                  </button>
                </div>

                {/* TÜM MODÜLER SEÇENEKLER (KULLANICIDAN HİÇBİR SEÇENEK KALDIRILMADI - MOBİLDE KOMPAKT LİSTE) */}
                <div className="space-y-1.5">
                  <span className="text-[10px] sm:text-[11px] text-slate-300 font-bold block">
                    Veya Manuel Kart Tarifesi Seç:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {/* 1. Tekil Biniş */}
                    <button
                      type="button"
                      onClick={() => setTransportChoice('single')}
                      className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        transportChoice === 'single'
                          ? 'bg-[#10345e] border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">Tekil Kocaeli Kart</span>
                          {smartTransportRecommendation.bestMode === 'single' && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/70">
                              ⭐ En Karlı
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">{monthlyTripsCount} biniş × 20,50 ₺</span>
                      </div>
                      <span className="text-xs font-black text-cyan-300 whitespace-nowrap shrink-0">{payAsYouGoCost} ₺/ay</span>
                    </button>

                    {/* 2. 1. Kademe Abonman */}
                    <button
                      type="button"
                      onClick={() => setTransportChoice('abonman1')}
                      className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        transportChoice === 'abonman1'
                          ? 'bg-[#10345e] border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">1. Kademe Abonman</span>
                          {smartTransportRecommendation.bestMode === 'abonman1' && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/70">
                              ⭐ En Karlı
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">1.450 Kontör (~25 biniş)</span>
                      </div>
                      <span className="text-xs font-black text-cyan-300 whitespace-nowrap shrink-0">{abonman1OptimizedCost} ₺/ay</span>
                    </button>

                    {/* 3. 2. Kademe Abonman */}
                    <button
                      type="button"
                      onClick={() => setTransportChoice('abonman2')}
                      className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        transportChoice === 'abonman2'
                          ? 'bg-[#10345e] border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">2. Kademe Abonman</span>
                          {smartTransportRecommendation.bestMode === 'abonman2' && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/70">
                              ⭐ En Karlı
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">2.900 Kontör (~50 biniş)</span>
                      </div>
                      <span className="text-xs font-black text-cyan-300 whitespace-nowrap shrink-0">{abonman2OptimizedCost} ₺/ay</span>
                    </button>

                    {/* 4. 3. Kademe Abonman */}
                    <button
                      type="button"
                      onClick={() => setTransportChoice('abonman3')}
                      className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        transportChoice === 'abonman3'
                          ? 'bg-[#10345e] border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">3. Kademe Abonman</span>
                          {smartTransportRecommendation.bestMode === 'abonman3' && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/70">
                              ⭐ En Karlı
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">5.800 Kontör (~100 biniş)</span>
                      </div>
                      <span className="text-xs font-black text-cyan-300 whitespace-nowrap shrink-0">{abonman3OptimizedCost} ₺/ay</span>
                    </button>

                    {/* 5. Masrafsız / Yürüme (Tam genişlik) */}
                    <button
                      type="button"
                      onClick={() => setTransportChoice('none')}
                      className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer sm:col-span-2 flex items-center justify-between gap-2 ${
                        transportChoice === 'none'
                          ? 'bg-[#10345e] border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">Kampüste Kalıyorum / Yürüme</span>
                          {smartTransportRecommendation.bestMode === 'none' && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/70">
                              ⭐ En Karlı
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">Toplu taşıma masrafım yok</span>
                      </div>
                      <span className="text-xs font-black text-emerald-400 whitespace-nowrap shrink-0">0 ₺/ay</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  4. MARKET, TELEFON, SOSYAL YAŞAM & DİĞER
                  ========================================================================= */}
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#060c18] border border-slate-800 space-y-2.5 sm:space-y-4 shadow-lg">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  <span>Market, Telefon, Sosyal Yaşam &amp; Diğer</span>
                </span>

                {/* Market & Temel Mutfak */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-slate-300 text-[11px] sm:text-xs">Market &amp; Mutfak:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={groceries}
                        aria-label="Market ve mutfak harcaması, Türk lirası"
                        onChange={(e) => setGroceries(Math.max(0, Number(e.target.value)))}
                        className="w-20 sm:w-24 px-2 py-0.5 sm:py-1 text-right text-xs font-bold bg-slate-900 border border-slate-700 rounded-lg text-amber-300 outline-hidden"
                      />
                      <span className="text-slate-400 font-bold text-xs">₺</span>
                    </div>
                  </div>
                  <div className="flex gap-1 justify-end">
                    {[1200, 2500, 3500, 5000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setGroceries(v)}
                        className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded cursor-pointer ${
                          groceries === v ? 'bg-amber-700 text-white font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {v} ₺
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kişisel Telefon & Mobil İnternet Faturası (GSM) */}
                <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <div>
                      <span className="text-slate-300 font-bold text-[11px] sm:text-xs">Telefon &amp; GSM Paketi:</span>
                      <span className="text-[9px] text-slate-400 block">Öğrenci tarifesi</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={phoneBill}
                        aria-label="Telefon ve GSM paketi, Türk lirası"
                        onChange={(e) => setPhoneBill(Math.max(0, Number(e.target.value)))}
                        className="w-20 px-2 py-0.5 sm:py-1 text-right text-xs font-bold bg-slate-900 border border-slate-700 rounded-lg text-cyan-300 outline-hidden"
                      />
                      <span className="text-slate-400 font-bold text-xs">₺</span>
                    </div>
                  </div>
                  <div className="flex gap-1 justify-end">
                    {[250, 350, 500, 750].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setPhoneBill(v)}
                        className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded cursor-pointer ${
                          phoneBill === v ? 'bg-cyan-700 text-white font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {v} ₺
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kafe & Sosyal */}
                <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-slate-300 text-[11px] sm:text-xs">Kafe &amp; Sosyal Yaşam:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={socialCoffee}
                        aria-label="Kafe ve sosyal yaşam harcaması, Türk lirası"
                        onChange={(e) => setSocialCoffee(Math.max(0, Number(e.target.value)))}
                        className="w-20 sm:w-24 px-2 py-0.5 sm:py-1 text-right text-xs font-bold bg-slate-900 border border-slate-700 rounded-lg text-pink-400 outline-hidden"
                      />
                      <span className="text-slate-400 font-bold text-xs">₺</span>
                    </div>
                  </div>
                  <div className="flex gap-1 justify-end">
                    {[1000, 2000, 3500].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setSocialCoffee(v)}
                        className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded cursor-pointer ${
                          socialCoffee === v ? 'bg-pink-700 text-white font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {v} ₺
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diğer (Ders Notu, Kitap, Kırtasiye) */}
                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-xs gap-2">
                  <div>
                    <span className="text-slate-300 font-bold block text-[11px] sm:text-xs">Diğer &amp; Kırtasiye:</span>
                    <span className="text-[9px] text-slate-400 block">Ders materyali ve harcamalar</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={stationeryEtc}
                      aria-label="Diğer ve kırtasiye harcaması, Türk lirası"
                      onChange={(e) => setStationeryEtc(Math.max(0, Number(e.target.value)))}
                      className="w-20 px-2 py-0.5 sm:py-1 text-right text-xs font-bold bg-slate-900 border border-slate-700 rounded-lg text-slate-200 outline-hidden"
                    />
                    <span className="text-slate-400 font-bold text-xs">₺</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sonraki Adım Butonu (Mobilde Tam Genişlik) */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCalcTab('income')}
                className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#10345e] to-[#009cb4] hover:to-[#00d2eb] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Sonraki Adım: Gelir &amp; Bursları Düzenle</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: GELİRLER & BURSLAR (GÜNCEL 4.000 ₺ KYK BURSU) */}
        {calcTab === 'income' && (
          <div className="space-y-3 sm:space-y-5">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-950/30 border border-emerald-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  TOPLAM AYLIK GELİR &amp; DESTEKLER
                </span>
                <p className="text-xl sm:text-3xl font-black text-white">
                  +{totalIncome.toLocaleString('tr-TR')} ₺ / ay
                </p>
              </div>
              <span className="text-[10px] sm:text-xs text-emerald-300 bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-700/60 font-semibold self-start sm:self-auto">
                2026/2027 KYK Lisans Bursu: 4.000 ₺
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {/* KYK Lisans Bursu / Kredisi (4.000 ₺) */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#060c18] border border-cyan-500/30 space-y-2 sm:space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>KYK Bursu / Öğrenim Kredisi</span>
                  </label>
                  <span className="text-xs font-bold text-emerald-400">
                    {kykBursary.toLocaleString('tr-TR')} ₺
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    step="250"
                    value={kykBursary}
                    aria-label="KYK bursu veya öğrenim kredisi, Türk lirası"
                    onChange={(e) => setKykBursary(Math.max(0, Number(e.target.value)))}
                    className="w-full px-2.5 py-1 sm:py-1.5 text-xs sm:text-sm font-bold bg-slate-900 border border-slate-700 rounded-lg sm:rounded-xl text-white focus:border-emerald-400 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setKykBursary(4000)}
                    className={`px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer shrink-0 ${
                      kykBursary === 4000
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-800 hover:bg-slate-700 text-emerald-300'
                    }`}
                  >
                    4.000 ₺
                  </button>
                  <button
                    type="button"
                    onClick={() => setKykBursary(0)}
                    className={`px-2 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      kykBursary === 0
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    0 ₺
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Gençlik ve Spor Bakanlığı güncel lisans aylık burs/kredi ödemesidir.
                </p>
              </div>

              {/* Aile Harçlığı / Desteği */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#060c18] border border-slate-800 space-y-2 sm:space-y-2.5 shadow-md">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Aile Desteği / Düzenli Harçlık</span>
                  <span className="text-emerald-400 font-bold">
                    {familySupport.toLocaleString('tr-TR')} ₺
                  </span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={familySupport}
                    aria-label="Aile desteği ve düzenli harçlık, Türk lirası"
                    onChange={(e) => setFamilySupport(Math.max(0, Number(e.target.value)))}
                    className="w-full px-2.5 py-1 sm:py-1.5 text-xs sm:text-sm font-bold bg-slate-900 border border-slate-700 rounded-lg sm:rounded-xl text-white focus:border-emerald-400 outline-hidden"
                  />
                  <div className="flex gap-1 shrink-0">
                    {[5000, 8000, 12000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFamilySupport(val)}
                        className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 rounded-md cursor-pointer ${
                          familySupport === val ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {val / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Ailenin kira, fatura ve günlük yaşam için her ay gönderdiği destek tutarı.
                </p>
              </div>

              {/* Özel Kurum / Vakıf / Belediye Bursu */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#060c18] border border-slate-800 space-y-2 sm:space-y-2.5 shadow-md">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Özel Vakıf veya Belediye Bursu</span>
                  <span className="text-emerald-400 font-bold">
                    {otherBursary.toLocaleString('tr-TR')} ₺
                  </span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    step="250"
                    value={otherBursary}
                    aria-label="Özel vakıf veya belediye bursu, Türk lirası"
                    onChange={(e) => setOtherBursary(Math.max(0, Number(e.target.value)))}
                    className="w-full px-2.5 py-1 sm:py-1.5 text-xs sm:text-sm font-bold bg-slate-900 border border-slate-700 rounded-lg sm:rounded-xl text-white focus:border-emerald-400 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setOtherBursary(0)}
                    className="px-2 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer shrink-0"
                  >
                    Yok
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  TÜBİTAK, İBB/KBB gençlik bursu veya özel vakıf destekleri.
                </p>
              </div>

              {/* Part-time / Freelance / Ek Gelir */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#060c18] border border-slate-800 space-y-2 sm:space-y-2.5 shadow-md">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Part-Time / Freelance Gelir</span>
                  <span className="text-emerald-400 font-bold">
                    {partTimeIncome.toLocaleString('tr-TR')} ₺
                  </span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={partTimeIncome}
                    aria-label="Part time veya serbest çalışma geliri, Türk lirası"
                    onChange={(e) => setPartTimeIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full px-2.5 py-1 sm:py-1.5 text-xs sm:text-sm font-bold bg-slate-900 border border-slate-700 rounded-lg sm:rounded-xl text-white focus:border-emerald-400 outline-hidden"
                  />
                  <div className="flex gap-1 shrink-0">
                    {[0, 3000, 6000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPartTimeIncome(val)}
                        className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 rounded-md cursor-pointer ${
                          partTimeIncome === val ? 'bg-cyan-700 text-white font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {val === 0 ? 'Yok' : `${val / 1000}k`}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Kafe part-time, özel ders veya serbest çalışma gelirleri.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCalcTab('expenses')}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer text-center"
              >
                ← Giderleri Düzenle
              </button>
              <button
                type="button"
                onClick={() => setCalcTab('summary')}
                className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#10345e] to-[#009cb4] hover:to-[#00d2eb] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Detaylı Analiz &amp; Grafikleri Gör</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BÜTÇE ANALİZİ VE GRAFİKLER */}
        {calcTab === 'summary' && (
          <div className="space-y-3.5 sm:space-y-5">
            {/* Net Durum Özeti */}
            <div
              className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border ${
                isSurplus
                  ? 'bg-gradient-to-r from-emerald-950/50 via-[#072418] to-[#04160f] border-emerald-500/40'
                  : 'bg-gradient-to-r from-rose-950/50 via-[#270b13] to-[#17050a] border-rose-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    {isSurplus ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-300">
                      {isSurplus ? 'BÜTÇEN DENGEDE & FAZLALIK VAR' : 'AYLIK BÜTÇE AÇIĞI VAR'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-3xl font-black text-white">
                    {isSurplus ? '+' : ''}
                    {netBalance.toLocaleString('tr-TR')} ₺ / Ay
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 max-w-xl leading-relaxed">
                    {isSurplus
                      ? 'Tebrikler! Aylık gelirlerin giderlerini aşıyor. Ay sonunda artan bu miktarı birikime ayırabilirsin.'
                      : 'Mevcut gelirlerin aylık giderlerini karşılamakta zorlanıyor. Kampüs yemekhanesi tek basım (40 ₺) avantajını artırabilir ve paylaşımlı ev/abonman modellerini değerlendirebilirsin.'}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 space-y-1 text-right">
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                      Gelir: <strong className="text-emerald-400">+{totalIncome.toLocaleString('tr-TR')} ₺</strong>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                      Gider: <strong className="text-[#ff7324]">-{totalExpenses.toLocaleString('tr-TR')} ₺</strong>
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-300 pt-0.5 border-t border-slate-800">
                      Fark:{' '}
                      <strong className={isSurplus ? 'text-emerald-300' : 'text-rose-400'}>
                        {isSurplus ? '+' : ''}
                        {netBalance.toLocaleString('tr-TR')} ₺
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md border ${
                      copiedSummary
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-[#10345e] hover:bg-cyan-600/80 border-cyan-400/50 text-white'
                    }`}
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Panoya Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#00d2eb]" />
                        <span>Sonucu Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* DETAYLI BUTCE ANALIZI: recharts ayri chunk, Suspense yerine modul kapisi */}
            {Charts ? (
              <Charts
                analysisView={analysisView}
                setAnalysisView={setAnalysisView}
                totalExpenses={totalExpenses}
                totalIncome={totalIncome}
                netBalance={netBalance}
                isSurplus={isSurplus}
                detailedExpenseData={detailedExpenseData}
                incomeVsExpenseData={incomeVsExpenseData}
                categoryBarData={categoryBarData}
                housingPct={housingPct}
                foodPct={foodPct}
                transportPct={transportPct}
                socialPct={socialPct}
                expenseToIncomeRatio={expenseToIncomeRatio}
                kykBursary={kykBursary}
                kykCoveragePct={kykCoveragePct}
                familySupport={familySupport}
                otherBursary={otherBursary}
                partTimeIncome={partTimeIncome}
                tabldotMonthlySavings={tabldotMonthlySavings}
                weeklyFirstMeals={weeklyFirstMeals}
                weeklySecondMeals={weeklySecondMeals}
                weeklyTrips={weeklyTrips}
                monthlyTripsCount={monthlyTripsCount}
                smartTransportRecommendation={smartTransportRecommendation}
                mandatoryExpenses={mandatoryExpenses}
              />
            ) : (
              <div className="min-h-[280px] rounded-xl sm:rounded-2xl bg-[#060c18] border border-slate-800 animate-pulse" />
            )}

            {/* =========================================================================
                ZEKİ METRİKLER: GÜNLÜK SERBEST HARÇLIK & SAĞLIK SKORU
                ========================================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {/* Günlük Serbest Harçlık */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#060c18] border border-cyan-500/30 space-y-1.5 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Günlük Serbest Harçlık Limitin</span>
                  </span>
                  <span className="text-[9px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50 font-bold">
                    Akıllı Metrik
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {dailyFreeAllowance.toLocaleString('tr-TR')} ₺ <span className="text-xs font-medium text-slate-400">/ gün</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed">
                  Zorunlu giderlerin ödendikten sonra <strong className="text-white">günde serbestçe harcayabileceğin net tutar</strong>.
                </p>
              </div>

              {/* Finansal Sağlık Skoru */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#060c18] border border-slate-800 space-y-1.5 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Öğrenci Finansal Sağlık Skoru</span>
                  </span>
                  <span className="text-xs font-black text-cyan-400">{budgetHealthScore} / 100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      budgetHealthScore >= 80
                        ? 'bg-emerald-500'
                        : budgetHealthScore >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${budgetHealthScore}%` }}
                  />
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed">
                  {budgetHealthScore >= 80
                    ? 'Bütçen oldukça sağlıklı! Gelirlerin temel harcamaları karşılıyor.'
                    : budgetHealthScore >= 60
                    ? 'Bütçen dengede ancak beklenmedik masraflar için küçük bir tampon faydalı olabilir.'
                    : 'Aylık giderlerin gelirlerini aşıyor. Kampüs yemekhanesi ve abonman kullanımı tasarruf sağlar.'}
                </p>
              </div>
            </div>

            {/* Kocaeli Sosyal Hub Avantajı */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#072418]/60 to-[#04160f] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kocaeli Sosyal Hub İle Her Ay En Az 1.800 ₺ Cepte!</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-200">
                  Speaking Club, doğa hikingleri ve atölyeler <strong>%100 ücretsizdir</strong>. Ücretli kulüp aidatlarına gerek yok.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('events')}
                className="shrink-0 w-full sm:w-auto px-3.5 py-2 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-md text-center"
              >
                Ücretsiz Etkinlikleri Gör
              </button>
            </div>

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => setCalcTab('expenses')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                ← Giderleri Tekrar Düzenle
              </button>
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Metin Kopyala</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 3. RESMİ KOCAELİ KART & TOPLU TAŞIMA ABONMAN SİSTEMİ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#00d2eb]">
          <Bus className="w-4 h-4" />
          <span>UKOME RESMİ TARİFELERİ &amp; KONTÖR SİSTEMİ (25 MAYIS 2026 YÜRÜRLÜKLÜ)</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Kocaeli Kart Öğrenci Ulaşım &amp; Abonman Rehberi
        </h2>
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 text-xs text-slate-300 space-y-1.5 leading-relaxed">
          <p>
            <strong className="text-white">25 Mayıs 2026 UKOME &amp; KBB Meclis Güncellemesi:</strong> Kocaeli Büyükşehir Belediyesi Meclisi ve UKOME komisyonunun 14 Mayıs 2026 tarihli kararı (Valilik onayıyla 25 Mayıs 2026 yürürlüklü) uyarınca tarifeler güncellenmiştir.
          </p>
          <p>
            Abonman paket satış fiyatları sabit tutulmuş (1. Kademe 362,50 ₺, 2. Kademe 725,00 ₺, 3. Kademe 1.450,00 ₺; 1 kontör = 0,25 ₺), ancak biniş başına çekilen kontör adedi 48&apos;den <strong>58 kontöre (14,50 ₺)</strong> yükselmiştir. Bu nedenle 1. Kademe paket 25 biniş, 2. Kademe 50 biniş, 3. Kademe 100 biniş sağlamaktadır. Tekil binişte ise belediye sübvansiyonu ile öğrenci kartından fiilen <strong>20,50 ₺</strong> düşmektedir.
          </p>
        </div>

        {/* 3 Kademeli Abonman Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kademe 1 */}
          <div className="p-5 rounded-2xl bg-[#0a1222]/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                1. KADEME (EN POPÜLER)
              </span>
              <span className="text-xs font-semibold text-slate-400">1.450 Kontör</span>
            </div>
            <h3 className="font-display font-bold text-base text-white">
              Hafif / Standart Kampüs Ulaşımı
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">362,50 ₺</span>
              <span className="text-xs text-slate-400">/ 30 Gün</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>25 Şehir İçi Otobüs Seferi (58 kontör)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>25 Tramvay Seferi (58 kontör)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Sefer başı maliyet: <strong>14,50 ₺</strong></span>
              </li>
            </ul>
          </div>

          {/* Kademe 2 */}
          <div className="p-5 rounded-2xl bg-[#0a1222]/90 border border-cyan-500/50 shadow-lg space-y-2.5 relative">
            <div className="absolute -top-2.5 right-4 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Tam Zamanlı Öğrenci
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                2. KADEME
              </span>
              <span className="text-xs font-semibold text-slate-400">2.900 Kontör</span>
            </div>
            <h3 className="font-display font-bold text-base text-white">
              Günlük Gidiş-Dönüş Kampüs
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">725,00 ₺</span>
              <span className="text-xs text-slate-400">/ 30 Gün</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>50 Şehir İçi Otobüs Seferi (58 kontör)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>50 Tramvay Seferi (58 kontör)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Haftada 5 gün çift biniş için idealdir</span>
              </li>
            </ul>
          </div>

          {/* Kademe 3 */}
          <div className="p-5 rounded-2xl bg-[#0a1222]/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                3. KADEME (YOĞUN AKTARMA)
              </span>
              <span className="text-xs font-semibold text-slate-400">5.800 Kontör</span>
            </div>
            <h3 className="font-display font-bold text-base text-white">
              Aktarmalı &amp; İlçe Ulaşımı
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">1.450,00 ₺</span>
              <span className="text-xs text-slate-400">/ 30 Gün</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100 Şehir İçi Otobüs / Tramvay Seferi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Günde 3-4 biniş yapan veya stajyerler</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Gebze / Körfez / Gölcük aktarmalı hatlar</span>
              </li>
            </ul>
          </div>
        </div>

        {/* UKOME Resmi Tarife Tablosu */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#060c18]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Ulaşım Modu / Hat</th>
                <th className="p-3">Tam Bilet</th>
                <th className="p-3">Öğrenci İndirimli (Fiili)</th>
                <th className="p-3">Abonman Karşılığı</th>
                <th className="p-3">Düşen Kontör</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-white">Şehir İçi Belediye Otobüsü</td>
                <td className="p-3 text-slate-400">42,00 ₺</td>
                <td className="p-3 font-bold text-emerald-400">
                  20,50 ₺ <span className="text-[10px] text-slate-400 font-normal block sm:inline">(Resmi: 27,25 ₺, B.Şehir desteğiyle)</span>
                </td>
                <td className="p-3 font-bold text-cyan-300">14,50 ₺</td>
                <td className="p-3 text-slate-400">58 Kontör</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-white">Akçaray Tramvay Hatları (T1, T2)</td>
                <td className="p-3 text-slate-400">36,00 ₺</td>
                <td className="p-3 font-bold text-emerald-400">20,50 ₺</td>
                <td className="p-3 font-bold text-cyan-300">14,50 ₺</td>
                <td className="p-3 text-slate-400">58 Kontör</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-white">Şehir İçi Vapur (Deniz Ulaşımı)</td>
                <td className="p-3 text-slate-400">26,00 – 50,00 ₺</td>
                <td className="p-3 font-bold text-emerald-400">20,00 ₺</td>
                <td className="p-3 font-bold text-cyan-300">12,50 ₺</td>
                <td className="p-3 text-slate-400">50 Kontör</td>
              </tr>
              <tr className="hover:bg-slate-900/40 bg-cyan-950/20">
                <td className="p-3 font-semibold text-white">Hat 200 (İzmit Otogar – Kartal Metro)</td>
                <td className="p-3 text-slate-400">146,00 ₺</td>
                <td className="p-3 font-bold text-emerald-400">96,00 ₺</td>
                <td className="p-3 font-bold text-cyan-300">63,50 ₺</td>
                <td className="p-3 text-slate-400">254 Kontör (Özel Ekspres)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* EYLÜL 2026: DİJİTAL KOCAELİKART & MOBİL ULAŞIM REHBERİ */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c182d] via-[#091122] to-[#040812] border border-cyan-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs tracking-wider uppercase">
                <QrCode className="w-4 h-4 text-cyan-300" />
                <span>EYLÜL 2026 RESMİ YENİLİK: DİJİTAL SEYAHAT KARTI &amp; QR GEÇİŞ DÖNEMİ</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Fiziki Plastik Kart Zorunluluğu Kalktı — Cep Telefonuyla İndirimli Biniş
              </h3>
            </div>
            <a
              href="https://kocaelikart.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-colors shrink-0 self-start sm:self-auto"
            >
              <span>kocaelikart.com Başvuru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Kocaeli Büyükşehir Belediyesi&apos;nin Eylül 2026 itibarıyla başlattığı dijital kart reformu sayesinde öğrenciler artık Mimar Sinan Köprüsü altındaki veya ilçe merkezlerindeki seyahat kartı bürolarında sıra beklemek zorunda değildir. Tüm süreç uçtan uca dijitalleştirilmiştir.
          </p>

          {/* 3 Adımda Dijital Ulaşım */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-black flex items-center justify-center border border-cyan-400/30">1</span>
                <span className="text-xs font-bold text-white">Online Başvuru</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-cyan-300">kocaelikart.com</strong> üzerinden &quot;Online İndirimli Kart Başvurusu&quot; ekranından kimlik ve fotoğrafını yükle; onay dijital olarak tamamlansın.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-black flex items-center justify-center border border-cyan-400/30">2</span>
                <span className="text-xs font-bold text-white">KocaeliKart Mobil QR Kod</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                İndirim hakkın <strong className="text-cyan-300">KocaeliKart Mobil</strong> uygulamana tanımlanır. Validatöre telefon ekranındaki dinamik QR kodu okutarak indirimli geçebilirsin.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black flex items-center justify-center border border-emerald-400/30">3</span>
                <span className="text-xs font-bold text-white">YÖKSİS Otomatik Vizeleme</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Öğrenci vizeleri dolum ve dijital işlem sırasında <strong className="text-emerald-300">YÖKSİS</strong> üzerinden otomatik kontrol edilip yenilenir; evrak taşıma devri bitti.
              </p>
            </div>
          </div>

          {/* Kocaeli Ulaşımında Hayat Kurtaran Mobil Uygulamalar */}
          <div className="pt-2 space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kocaeli&apos;de Her Öğrencinin Telefonunda Olması Gereken 4 Ulaşım Uygulaması</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">KocaeliKart Mobil</span>
                  <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/50">Cüzdan &amp; QR</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Dijital indirimli biniş QR kodu üretimi, anlık bakiye yükleme, abonman kontör takibi ve geçmiş harcama dökümü.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">e-Komobil</span>
                  <span className="text-[9px] font-bold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/50">Canlı Hat &amp; NFC</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Duraklara yaklaşan otobüsleri canlı izleme, kalkış saatleri, hat güzergahları ve NFC destekli doğrudan temassız geçiş.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">KOBİS</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">Akıllı Bisiklet</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  İzmit sahil şeridi, Sekapark ve şehir içi istasyonlardan QR okutarak dakikalık uygun fiyatlı bisiklet kiralama.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">e-Kocaeli</span>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/50">Şehir Rehberi</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Nöbetçi eczaneler, kent etkinlikleri, gençlik merkezleri ve belediye resmi hizmet rehberi.
                </p>
              </div>
            </div>
          </div>

          {/* UMUTTEPE OTOBÜS HATLARI REHBERİ VE ÖĞRENCİ TAKTİKLERİ */}
          <div className="pt-3 border-t border-cyan-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Route className="w-4 h-4 text-cyan-400" />
                  <span>Umuttepe Kampüs Otobüs Hatları Rehberi &amp; Hayatta Kalma Taktikleri</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Hangi hat nereden kalkar, hangisi konforlu, gece dağdan nasıl dönülür ve aktarmasız ilçe hatları.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950/80 border border-cyan-700/50 px-2.5 py-1 rounded-full self-start sm:self-auto shrink-0">
                UlaşımPark &amp; Minibüs Hatları
              </span>
            </div>

            {/* 3 Temel Kategori Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. İzmit Merkez & Kampüs Ana Damarları */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-black text-cyan-400">
                  <Bus className="w-4 h-4" />
                  <span>İzmit Merkez &amp; Kampüs Ana Hatları</span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-300">
                  <li className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <div className="flex items-center justify-between font-bold text-white mb-0.5">
                      <span className="text-cyan-300">Hat 33</span>
                      <span className="text-[10px] text-amber-400">5-10 dk aralık</span>
                    </div>
                    <p className="text-slate-300 leading-tight">
                      <strong>Batı Terminali - Sekapark - Doğu Kışla - Umuttepe:</strong> Şehrin en sık çalışan hattı. Sabah 08:00 - 09:00 arası çok kalabalıktır.
                    </p>
                  </li>

                  <li className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <div className="flex items-center justify-between font-bold text-white mb-0.5">
                      <span className="text-cyan-300">Hat 10</span>
                      <span className="text-[10px] text-emerald-400">Geniş Belediye Otobüsü</span>
                    </div>
                    <p className="text-slate-300 leading-tight">
                      <strong>Otogar - Bayındırlık - Umuttepe:</strong> UlaşımPark&apos;ın büyük aracı. Dünya Bankası ve Bayındırlık KYK yurtlarında kalanların ana hattı; 33&apos;e göre daha konforlu.
                    </p>
                  </li>

                  <li className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <div className="flex items-center justify-between font-bold text-white mb-0.5">
                      <span className="text-cyan-300">Hat 24</span>
                      <span className="text-[10px] text-blue-400">Yahyakaptan Hattı</span>
                    </div>
                    <p className="text-slate-300 leading-tight">
                      <strong>Güney Terminali - Yahyakaptan - Otogar - Yeşilova - Umuttepe:</strong> Yahyakaptan&apos;da oturan veya kafelere takılan öğrencilerin ana can damarı.
                    </p>
                  </li>
                </ul>
              </div>

              {/* 2. Kampüs İçi Ring & Gece Kuşu */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                  <Moon className="w-4 h-4" />
                  <span>Kampüs İçi Ring &amp; Gece Kurtarıcıları</span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-300">
                  <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <div className="flex items-center justify-between font-bold text-white mb-0.5">
                      <span className="text-amber-300">Hat 14 (Kampüs Ring)</span>
                      <span className="text-[10px] text-emerald-400">15 dk aralık</span>
                    </div>
                    <p className="text-slate-300 leading-tight">
                      <strong>Umuttepe A Kapısı - BESYO - İlahiyat - Sağlık Fakültesi:</strong> Umuttepe&apos;nin dik rampasını ve kış rüzgarını yürümek istemeyenler için kampüs içi mekik seferi.
                    </p>
                  </li>

                  <li className="p-2.5 rounded-lg bg-slate-950/60 border border-amber-500/30 bg-amber-950/20">
                    <div className="flex items-center justify-between font-bold text-white mb-0.5">
                      <span className="text-amber-300">Hat N1 (Gece Kuşu)</span>
                      <span className="text-[10px] text-amber-300 font-black">02:00 / 03:00 / 05:00</span>
                    </div>
                    <p className="text-slate-300 leading-tight">
                      <strong>Batı Terminali - Tren Garı - Otogar - Şehir Hastanesi - Umuttepe:</strong> Sabaha kadar çalışır; merkezde veya barlarda gece geç saatte kalanları taksi masrafından kurtaran yegane araçtır.
                    </p>
                  </li>
                </ul>

                {/* Taktik Notu */}
                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[10px] text-cyan-200 leading-snug space-y-1">
                  <span className="font-bold flex items-center gap-1 text-cyan-300">
                    <Lightbulb className="w-3 h-3" />
                    Bavullu Dönüşler:
                  </span>
                  <span>Şehir dışından gelenler Otogar&apos;dan doğrudan <strong>Hat 10</strong> veya <strong>Hat 24</strong> ile merkeze inmeden Umuttepe&apos;ye çıkabilir.</span>
                </div>
              </div>

              {/* 3. İlçelerden Aktarmasız Dağa Çıkan Hatlar */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                  <Compass className="w-4 h-4" />
                  <span>İlçelerden Aktarmasız Umuttepe Hatları</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="font-bold text-emerald-300 block mb-0.5">Derince: Hat 133 &amp; Hat 145</span>
                    <span className="text-slate-400 block text-[10px] leading-tight">
                      133 Yenikent/Sopalı&apos;dan; 145 ise 60 Evler/Halkevi üzerinden aktarmasız dağa çıkar.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="font-bold text-emerald-300 block mb-0.5">Körfez: Hat 115 &amp; Hat 115Ç</span>
                    <span className="text-slate-400 block text-[10px] leading-tight">
                      Körfezkent ve Çenedağ yönünden uygun kirayla Körfez&apos;de oturanların sabah doğrudan hattıdır.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="font-bold text-emerald-300 block mb-0.5">Karamürsel &amp; Değirmendere: Hat 750 &amp; 755</span>
                    <span className="text-slate-400 block text-[10px] leading-tight">
                      Özellikle 755 numaralı hat Gölcük ve Değirmendere&apos;den merkeze uğramadan dağa ulaşır.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="font-bold text-emerald-300 block mb-0.5">Gebze &amp; Darıca: Hat 435 &amp; 530</span>
                    <span className="text-slate-400 block text-[10px] leading-tight">
                      GTÜ ve Darıca&apos;dan doğrudan Umuttepe&apos;ye (~1.5 saat). Uzundur ama aktarma çilesini bitirir.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Öğrenci Taktikleri Barı */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/40 to-slate-950 border border-rose-500/30 flex items-start gap-2.5">
                <MapPinOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-rose-200 block">Taktik 1: Sabah Halkevi Durağı Tuzağı</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    08.00-09.00 saatlerinde 33 numaraya Halkevi durağından binmek neredeyse imkansızdır; otobüs dolu olduğu için durmadan geçebilir. <strong>Tren Garı yönüne 1-2 durak geri yürüyüp</strong> binmek oturma şansı kazandırır.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-950 border border-cyan-500/30 flex items-start gap-2.5">
                <CloudSnow className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-cyan-200 block">Taktik 2: Merkez Havasına Asla Aldanma</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    İzmit merkezde günlük güneşlik hava varken Umuttepe zirvesinde tipi, sis veya şiddetli rüzgar olabilir. Sabah evden çıkmadan önce <strong>e-Komobil</strong> uygulamasından sefer akışını kontrol edip hazırlıklı giyinin.
                  </p>
                </div>
              </div>
            </div>

            {/* Canlı Mikroklimal Hava Durumu Widget'ı */}
            <div className="pt-2">
              <WeatherWidget id="campus-live-weather-detail" badgeLabel="ANLIK MİKROKLİMA FARKI" showAllDistricts={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. KAMPÜS BESLENME & SKS TABLDOT SİSTEMİ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400">
          <Utensils className="w-4 h-4" />
          <span>KOÜ SAĞLIK KÜLTÜR VE SPOR DAİRE BAŞKANLIĞI (SKS)</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Kampüs Yemekhanesi ve Sübvansiyon Gerçekleri
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          Kocaeli Üniversitesi Umuttepe Yerleşkesi ve ilçe meslek yüksekokullarında 4 kap dengeli tabldot menüsü servis edilir. Reel üretim maliyeti yaklaşık 200 ₺ olup 160 ₺'si rektörlük bütçesinden karşılanmaktadır.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#060c18] border border-emerald-500/40 space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
              TAM SÜBVANSİYONLU TEK BASIM TARİFESİ
            </span>
            <div className="text-3xl font-black text-white">40,00 ₺</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tüm lisans, ön lisans ve lisansüstü öğrencilerin standart tabldot ücretidir. Öğle veya akşam servisinde günde tek basım ile aylık 21 eğitim gününde sadece <strong>840 ₺</strong> tutar.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#060c18] border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              EKONOMİK KARŞILAŞTIRMA
            </span>
            <div className="text-sm font-bold text-slate-200">
              Dışarıda 1 Porsiyon Yemek ≈ Kampüste 10 Öğün Tabldot!
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              İzmit merkez veya Umuttepe kafeteryalarında ortalama 1 öğün yemek 300 - 450 ₺ bandındayken, kampüs yemekhanesinde 1 haftalık tüm öğle yemeklerini (5 gün x 40 ₺ = <strong>200 ₺</strong>) karşılayabilirsin.
            </p>
          </div>
        </div>
      </section>

      {/* 5. KAMUSAL BARINMA: KYK YURTLARI VE ODA TİPLERİ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#00d2eb]">
          <Home className="w-4 h-4" />
          <span>GSB KREDİ VE YURTLAR GENEL MÜDÜRLÜĞÜ (2026-2027 EĞİTİM YILI)</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          KYK Yurt Tipleri &amp; Umuttepe Yerleşke Yurtları
        </h2>
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 text-xs text-slate-300 space-y-1.5 leading-relaxed">
          <p>
            <strong className="text-white">2026-2027 GSB Resmi Yurt Tarifesi:</strong> Gençlik ve Spor Bakanlığı (GSB) Kredi ve Yurtlar Genel Müdürlüğü tarafından 2026-2027 akademik yılı için yürürlüğe konan güncel tarifedir. KYK yurt ücretleri bina yaşı, oda metrekaresi ve bağımsız banyo/tuvalet donanımına göre kademelendirilmiştir.
          </p>
          <p>
            Tüm yurt tiplerinde her gün sabah kahvaltısı ve akşam yemeğinde ayni beslenme desteği eksiksiz ve ücretsiz olarak verilmektedir. Elektrik, su, ısınma ve sınırsız internet (GSB WiFi) için ek fatura ödenmez.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#060c18]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">KYK Yurt Tipi</th>
                <th className="p-3">Aylık Ücret (2026/27)</th>
                <th className="p-3">Güvence Bedeli (Depozito)</th>
                <th className="p-3">Oda Donanımı &amp; Nitelikler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-bold text-white">1. Tip Yurt</td>
                <td className="p-3 font-bold text-emerald-400">980,00 ₺</td>
                <td className="p-3 text-slate-400">~1.100 ₺</td>
                <td className="p-3 text-slate-300">6-8 kişilik ranzalı odalar, kat koridorunda ortak ıslak hacimler.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-bold text-white">2. ve 3. Tip Yurt</td>
                <td className="p-3 font-bold text-emerald-400">1.100,00 ₺</td>
                <td className="p-3 text-slate-400">~1.300 ₺</td>
                <td className="p-3 text-slate-300">3-6 kişilik odalar, standart çalışma masaları ve dolaplar.</td>
              </tr>
              <tr className="hover:bg-slate-900/40 bg-cyan-950/20">
                <td className="p-3 font-bold text-white">4. Tip Yurt (Umuttepe)</td>
                <td className="p-3 font-bold text-cyan-300">1.350,00 ₺</td>
                <td className="p-3 text-slate-400">~1.450 ₺</td>
                <td className="p-3 text-slate-300">2-4 kişilik bazalı odalar, bağımsız oda içi banyo, tuvalet ve buzdolabı.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-bold text-white">5. Tip Yurt</td>
                <td className="p-3 font-bold text-cyan-300">1.480,00 ₺</td>
                <td className="p-3 text-slate-400">~1.550 ₺</td>
                <td className="p-3 text-slate-300">2-3 kişilik odalar, genişletilmiş bireysel çalışma istasyonları.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-bold text-white">6. Tip Yurt</td>
                <td className="p-3 font-bold text-cyan-300">1.590,00 ₺</td>
                <td className="p-3 text-slate-400">~1.750 ₺</td>
                <td className="p-3 text-slate-300">1-2 kişilik otel konseptli odalar, yüksek mahremiyet ve bağımsız tefrişat.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. ÖZEL KONUT PİYASASI VE MAHALLE KİRA DİNAMİKLERİ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-pink-400">
          <MapPin className="w-4 h-4" />
          <span>BÖLGESEL KİRA ANALİZİ</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Dünya Bankası, Yahyakaptan ve İzmit Merkez Karşılaştırması
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#060c18] border border-cyan-500/40 space-y-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
              EN PRAGMATİK ÖĞRENCİ LOKASYONU
            </span>
            <h3 className="font-bold text-base text-white">Dünya Bankası &amp; Bayındırlık</h3>
            <p className="text-xs text-slate-300">
              Ortalama Kira: <strong>18.000 – 24.500 ₺</strong> (Kişi başı 3 pay: <strong>7.000 – 9.500 ₺</strong>)
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Umuttepe&apos;ye belediye otobüsüyle 5-10 dk mesafe. 1999 depremi sonrası tünel kalıp dayanıklı bloklar. Kış aylarında dik yokuş trafiğinden kaçış için en ideal bölgedir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#060c18] border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded">
              SOSYAL &amp; DÜZENLİ SİTE HAYATI
            </span>
            <h3 className="font-bold text-base text-white">Yahyakaptan Mahallesi</h3>
            <p className="text-xs text-slate-300">
              Ortalama Kira: <strong>27.500 – 40.000 ₺</strong> (Kişi başı 3 pay: <strong>10.000 – 14.000 ₺</strong>)
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tramvay hattı omurgasından geçer. Arasta Park çevresinde kafe kültürü zengin. Yüksek site aidatları ve merkezi sistem payı sebebiyle tekil kiralama zordur, 3 kişi paylaşılır.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#060c18] border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded">
              ÇARŞI VE GECE SOSYAL YAŞAMI
            </span>
            <h3 className="font-bold text-base text-white">İzmit Kent Merkezi (Çarşı / Bekirdere)</h3>
            <p className="text-xs text-slate-300">
              Ortalama Kira: <strong>15.000 – 22.000 ₺</strong> (Kişi başı pay: <strong>7.500 – 11.000 ₺</strong>)
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Yürüyüş Yolu, sahaf ve kütüphanelere yürüme mesafesinde. Ancak Umuttepe&apos;ye dik rampalardan 30-40 dakikalık otobüs yolculuğu gerektirir.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BELEDİYE SÜBVANSİYONLARI: KENT ÇAMAŞIRHANESİ & SICAK ÇORBA */}
      <section className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-cyan-950/30 via-[#07192f]/60 to-[#041224] border border-cyan-500/30 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Shirt className="w-4 h-4" />
          <span>KOCAELİ BÜYÜKŞEHİR BELEDİYESİ ÜCRETSİZ DESTEKLERİ</span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-black text-white">
          Umuttepe Yerleşkesi Kent Çamaşırhanesi &amp; Sıcak Çorba Çeşmeleri
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Tüm üniversite öğrencilerine açık olan tesis; 10 endüstriyel yıkama, 5 kurutma ve 2 ütü ünitesiyle haftanın 6 günü (Pzt-Cmt 09.00-18.00) tamamen <strong>ücretsiz</strong> hizmet verir. Deterjan ve yumuşatıcı belediyece karşılanır, bekleme salonunda çay, kahve ve internet ücretsizdir. Randevu:{' '}
          <span className="text-cyan-300 font-mono">ebelediye.kocaeli.bel.tr/Camasirhane</span>
        </p>
        <p className="text-xs text-slate-400">
          Ayrıca kış aylarında sabah saatlerinde Umuttepe peronlarında sıcak çorba çeşmeleri öğrencilere kesintisiz hizmet vermektedir.
        </p>
      </section>

      {/* 8. 7/24 AÇIK KÜTÜPHANELER VE ÇALIŞMA ALANLARI */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
          <BookOpen className="w-4 h-4" />
          <span>7/24 AKADEMİK ÇALIŞMA ALANLARI</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Kocaeli&apos;de Vize &amp; Final Çalışma Mekanları
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#060c18] border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">7/24 KESİNTİSİZ</span>
            <h3 className="font-bold text-white text-sm">İzmit Millet Kütüphanesi</h3>
            <p className="text-[11px] text-slate-400">Milli İrade Meydanı. Bireysel çalışma kabinleri, prizli masalar ve gece sıcak ikramlar.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#060c18] border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">7/24 KESİNTİSİZ</span>
            <h3 className="font-bold text-white text-sm">Kartepe İlçe Halk Kütüphanesi</h3>
            <p className="text-[11px] text-slate-400">Kartepe Kent Meydanı. Sessiz etüt salonları ve ücretsiz sıcak kahve ikramı.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#060c18] border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">2.200 M² KAPALI ALAN</span>
            <h3 className="font-bold text-white text-sm">Alev Alatlı Kütüphanesi</h3>
            <p className="text-[11px] text-slate-400">İzmit Millet Bahçesi (Eski Fuar). 500 kişilik ferah araştırma laboratuvarı.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#060c18] border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-pink-400 uppercase">09.00 - 22.00</span>
            <h3 className="font-bold text-white text-sm">SEKA Kütüphanesi</h3>
            <p className="text-[11px] text-slate-400">Sekapark içi restore endüstriyel miras binası. Deniz kıyısında dingin çalışma ortamı.</p>
          </div>
        </div>
      </section>

      {/* 9. ÖNEMLİ KORİDORLAR VE OTOBÜS HATLARI */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#ff7324]">
          <Bus className="w-4 h-4" />
          <span>HAYATİ TOPLU TAŞIMA KORİDORLARI</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Umuttepe&apos;ye Çıkan Ana Otobüs Hatları
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-[#060c18] border border-slate-800">
            <span className="text-xs font-black text-cyan-400">Hat 10</span>
            <p className="text-xs font-bold text-white mt-1">İzmit Otogar ↔ Umuttepe</p>
            <p className="text-[10px] text-slate-400 mt-1">Şehre gelen öğrencilerin doğrudan kampüse çıkış ana hattı.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060c18] border border-slate-800">
            <span className="text-xs font-black text-emerald-400">Hat 14</span>
            <p className="text-xs font-bold text-white mt-1">Yerleşke Ring Seferi</p>
            <p className="text-[10px] text-slate-400 mt-1">A Kapısı ile fakülteler arası 15 dakikada bir ring atar.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060c18] border border-slate-800">
            <span className="text-xs font-black text-amber-400">Hat 43</span>
            <p className="text-xs font-bold text-white mt-1">İzmit Çarşı ↔ Umuttepe</p>
            <p className="text-[10px] text-slate-400 mt-1">Çarşı merkezinden dik rampayı tırmanan en hızlı ekspres rota.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060c18] border border-slate-800">
            <span className="text-xs font-black text-purple-400">Hat N1</span>
            <p className="text-xs font-bold text-white mt-1">Gece Nöbetçi Hattı</p>
            <p className="text-[10px] text-slate-400 mt-1">Batı Terminali - Tren Garı - Otogar - Umuttepe kesintisiz gece seferi.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#060c18] border border-cyan-500/40">
            <span className="text-xs font-black text-[#00d2eb]">Hat 200</span>
            <p className="text-xs font-bold text-white mt-1">İzmit ↔ Kartal Metro</p>
            <p className="text-[10px] text-slate-400 mt-1">İstanbul M4 metrosu ve Marmaray'a öğrenci indirimiyle ekspres erişim.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
