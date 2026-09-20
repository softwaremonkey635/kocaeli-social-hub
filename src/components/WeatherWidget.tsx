import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  RefreshCw,
  Clock,
  Mountain,
  Waves,
  MapPin
} from 'lucide-react';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
  time: string;
}

export interface DistrictWeather {
  id: string;
  name: string;
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  isCampus?: boolean;
}

// 12 Kocaeli Districts + KOÜ Umuttepe
const KOCAELI_LOCATIONS = [
  { id: 'umuttepe', name: 'KOÜ Umuttepe', lat: 40.8228, lon: 29.9238, isCampus: true },
  { id: 'izmit', name: 'İzmit (Merkez)', lat: 40.7654, lon: 29.9408 },
  { id: 'gebze', name: 'Gebze', lat: 40.8028, lon: 29.4307 },
  { id: 'darica', name: 'Darıca', lat: 40.7744, lon: 29.4058 },
  { id: 'korfez', name: 'Körfez', lat: 40.7797, lon: 29.7369 },
  { id: 'golcuk', name: 'Gölcük', lat: 40.7172, lon: 29.8189 },
  { id: 'derince', name: 'Derince', lat: 40.7561, lon: 29.8319 },
  { id: 'cayirova', name: 'Çayırova', lat: 40.8286, lon: 29.3739 },
  { id: 'kartepe', name: 'Kartepe', lat: 40.7533, lon: 30.0242 },
  { id: 'basiskele', name: 'Başiskele', lat: 40.7119, lon: 29.9308 },
  { id: 'karamursel', name: 'Karamürsel', lat: 40.6922, lon: 29.6158 },
  { id: 'kandira', name: 'Kandıra', lat: 41.0711, lon: 30.1500 },
  { id: 'dilovasi', name: 'Dilovası', lat: 40.7856, lon: 29.5444 }
];

// WMO Weather interpretation
function getWeatherDetails(code: number, isDay: boolean = true) {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Açık & Güneşli' : 'Açık Gece',
        Icon: isDay ? Sun : Moon,
        color: isDay ? 'text-amber-400' : 'text-blue-300'
      };
    case 1:
      return {
        label: isDay ? 'Az Bulutlu' : 'Az Bulutlu Gece',
        Icon: isDay ? CloudSun : CloudMoon,
        color: isDay ? 'text-amber-300' : 'text-indigo-300'
      };
    case 2:
      return {
        label: 'Parçalı Bulutlu',
        Icon: isDay ? CloudSun : CloudMoon,
        color: isDay ? 'text-cyan-300' : 'text-slate-300'
      };
    case 3:
      return {
        label: 'Çok Bulutlu',
        Icon: Cloud,
        color: 'text-slate-300'
      };
    case 45:
    case 48:
      return {
        label: 'Sisli & Puslu',
        Icon: CloudFog,
        color: 'text-teal-300'
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Çiseleyen Yağmur',
        Icon: CloudDrizzle,
        color: 'text-blue-300'
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Yağmurlu',
        Icon: CloudRain,
        color: 'text-blue-400'
      };
    case 71:
    case 73:
    case 75:
      return {
        label: 'Kar Yağışlı',
        Icon: CloudSnow,
        color: 'text-sky-200'
      };
    case 77:
      return {
        label: 'Kar Taneleri',
        Icon: Snowflake,
        color: 'text-sky-100'
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Sağanak Yağış',
        Icon: CloudRain,
        color: 'text-blue-400'
      };
    case 85:
    case 86:
      return {
        label: 'Tipi & Kar',
        Icon: CloudSnow,
        color: 'text-cyan-200'
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Gök Gürültülü',
        Icon: CloudLightning,
        color: 'text-amber-400'
      };
    default:
      return {
        label: 'Bulutlu',
        Icon: Cloud,
        color: 'text-slate-300'
      };
  }
}

interface WeatherWidgetProps {
  className?: string;
  badgeLabel?: string;
  showAllDistricts?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  className = '',
  badgeLabel = 'CANLI KAMPÜS & KOCAELİ HAVA DURUMU',
  showAllDistricts = true
}) => {
  // Live Clock State
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Dual primary points
  const [umuttepe, setUmuttepe] = useState<WeatherData>({
    temperature: 20.1,
    feelsLike: 19.8,
    humidity: 68,
    windSpeed: 15,
    precipitation: 0.0,
    weatherCode: 2,
    isDay: true,
    time: 'Canlı'
  });

  const [izmit, setIzmit] = useState<WeatherData>({
    temperature: 23.2,
    feelsLike: 23.0,
    humidity: 61,
    windSpeed: 18,
    precipitation: 0.0,
    weatherCode: 3,
    isDay: true,
    time: 'Canlı'
  });

  // All 13 Districts List
  const [districts, setDistricts] = useState<DistrictWeather[]>([
    { id: 'umuttepe', name: 'KOÜ Umuttepe', temperature: 20.1, weatherCode: 2, humidity: 68, windSpeed: 15, isDay: true, isCampus: true },
    { id: 'izmit', name: 'İzmit (Merkez)', temperature: 23.2, weatherCode: 3, humidity: 61, windSpeed: 18, isDay: true },
    { id: 'gebze', name: 'Gebze', temperature: 21.7, weatherCode: 3, humidity: 64, windSpeed: 16, isDay: true },
    { id: 'darica', name: 'Darıca', temperature: 22.0, weatherCode: 3, humidity: 63, windSpeed: 17, isDay: true },
    { id: 'korfez', name: 'Körfez', temperature: 22.2, weatherCode: 3, humidity: 62, windSpeed: 16, isDay: true },
    { id: 'golcuk', name: 'Gölcük', temperature: 22.6, weatherCode: 3, humidity: 65, windSpeed: 14, isDay: true },
    { id: 'derince', name: 'Derince', temperature: 22.7, weatherCode: 3, humidity: 62, windSpeed: 15, isDay: true },
    { id: 'cayirova', name: 'Çayırova', temperature: 22.3, weatherCode: 3, humidity: 64, windSpeed: 17, isDay: true },
    { id: 'kartepe', name: 'Kartepe', temperature: 22.9, weatherCode: 3, humidity: 60, windSpeed: 12, isDay: true },
    { id: 'basiskele', name: 'Başiskele', temperature: 23.1, weatherCode: 3, humidity: 62, windSpeed: 13, isDay: true },
    { id: 'karamursel', name: 'Karamürsel', temperature: 22.3, weatherCode: 3, humidity: 66, windSpeed: 15, isDay: true },
    { id: 'kandira', name: 'Kandıra', temperature: 21.5, weatherCode: 1, humidity: 70, windSpeed: 19, isDay: true },
    { id: 'dilovasi', name: 'Dilovası', temperature: 22.3, weatherCode: 3, humidity: 63, windSpeed: 16, isDay: true }
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Canlı');

  // Live Clock Tick (Every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Time & Date strings (Turkish locale)
  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, [currentTime]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('tr-TR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }, [currentTime]);

  // Fetch Batch Weather for all 13 locations in single request
  const fetchAllWeather = useCallback(async () => {
    setLoading(true);
    try {
      const lats = KOCAELI_LOCATIONS.map((l) => l.lat).join(',');
      const lons = KOCAELI_LOCATIONS.map((l) => l.lon).join(',');

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Europe%2FIstanbul`
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length === KOCAELI_LOCATIONS.length) {
        // Map all locations
        const mappedDistricts: DistrictWeather[] = KOCAELI_LOCATIONS.map((loc, idx) => {
          const cur = data[idx]?.current;
          return {
            id: loc.id,
            name: loc.name,
            temperature: cur ? Math.round(cur.temperature_2m * 10) / 10 : 22,
            weatherCode: cur ? cur.weather_code : 3,
            humidity: cur ? cur.relative_humidity_2m : 65,
            windSpeed: cur ? Math.round(cur.wind_speed_10m) : 15,
            isDay: cur ? Boolean(cur.is_day) : true,
            isCampus: loc.isCampus
          };
        });

        setDistricts(mappedDistricts);

        // Update primary Umuttepe & İzmit
        const umuttepeData = data[0]?.current;
        if (umuttepeData) {
          setUmuttepe({
            temperature: Math.round(umuttepeData.temperature_2m * 10) / 10,
            feelsLike: Math.round(umuttepeData.apparent_temperature * 10) / 10,
            humidity: umuttepeData.relative_humidity_2m,
            windSpeed: Math.round(umuttepeData.wind_speed_10m),
            precipitation: umuttepeData.precipitation || 0,
            weatherCode: umuttepeData.weather_code,
            isDay: Boolean(umuttepeData.is_day),
            time: umuttepeData.time
          });
        }

        const izmitData = data[1]?.current;
        if (izmitData) {
          setIzmit({
            temperature: Math.round(izmitData.temperature_2m * 10) / 10,
            feelsLike: Math.round(izmitData.apparent_temperature * 10) / 10,
            humidity: izmitData.relative_humidity_2m,
            windSpeed: Math.round(izmitData.wind_speed_10m),
            precipitation: izmitData.precipitation || 0,
            weatherCode: izmitData.weather_code,
            isDay: Boolean(izmitData.is_day),
            time: izmitData.time
          });
        }

        const now = new Date();
        setLastUpdated(
          now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        );
      }
    } catch (err) {
      console.warn('Kocaeli hava durumu verileri güncellenemedi:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and every 10 minutes
  useEffect(() => {
    fetchAllWeather();
    const interval = setInterval(fetchAllWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllWeather]);

  // Microclimate Difference
  const tempDiff = useMemo(() => {
    return Math.round((izmit.temperature - umuttepe.temperature) * 10) / 10;
  }, [izmit.temperature, umuttepe.temperature]);

  const umuttepeInfo = useMemo(
    () => getWeatherDetails(umuttepe.weatherCode, umuttepe.isDay),
    [umuttepe.weatherCode, umuttepe.isDay]
  );
  const izmitInfo = useMemo(
    () => getWeatherDetails(izmit.weatherCode, izmit.isDay),
    [izmit.weatherCode, izmit.isDay]
  );

  return (
    <div
      id="campus-live-weather"
      className={`relative rounded-2xl bg-[#070e1c] border border-cyan-500/25 p-3 sm:p-4 shadow-lg overflow-hidden ${className}`}
    >
      {/* Background subtle glow */}
      <div className="absolute top-0 right-0 w-48 h-20 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* TOP HEADER: Compact Title + Live Clock + Refresh Button */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 truncate">
            {badgeLabel}
          </span>
        </div>

        {/* Live Clock & Refresh */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
            <Clock className="w-3 h-3 text-cyan-300" />
            <span className="text-[11px] font-mono font-bold text-cyan-200">
              {formattedTime}
            </span>
            <span className="text-[9px] text-slate-400 hidden xs:inline ml-0.5">
              • {formattedDate}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchAllWeather}
            disabled={loading}
            title="Canlı Veriyi Yenile"
            className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* DUAL COMPARISON GRID (Compact 2 Columns) */}
      <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-3 pt-2.5">
        {/* 1. UMUTTEPE KAMPÜSÜ */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-[#0c1a30] to-[#07101f] border border-cyan-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1 text-[11px] font-black text-cyan-300 truncate">
              <Mountain className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">KOÜ Umuttepe</span>
            </div>
            <span className="text-[9px] font-bold text-cyan-400/90 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/40 shrink-0">
              ~396m
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 my-1">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">
                {umuttepe.temperature}°
              </span>
              <span className="text-[10px] text-slate-400">C</span>
            </div>
            <umuttepeInfo.Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${umuttepeInfo.color} shrink-0`} />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1 border-t border-slate-800/80 mt-1">
            <span className="truncate font-medium text-slate-200">{umuttepeInfo.label}</span>
            <span className="text-slate-400 shrink-0 text-[9px]">Hissedilen {umuttepe.feelsLike}°</span>
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 mt-1">
            <span className="flex items-center gap-0.5">
              <Wind className="w-2.5 h-2.5 text-cyan-400" />
              {umuttepe.windSpeed} km/s
            </span>
            <span className="flex items-center gap-0.5">
              <Droplets className="w-2.5 h-2.5 text-blue-400" />
              %{umuttepe.humidity}
            </span>
          </div>
        </div>

        {/* 2. İZMİT MERKEZ */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-[#0a1424] to-[#060c18] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1 text-[11px] font-black text-slate-200 truncate">
              <Waves className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">İzmit Merkez</span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700/50 shrink-0">
              ~6m
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 my-1">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">
                {izmit.temperature}°
              </span>
              <span className="text-[10px] text-slate-400">C</span>
            </div>
            <izmitInfo.Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${izmitInfo.color} shrink-0`} />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1 border-t border-slate-800/80 mt-1">
            <span className="truncate font-medium text-slate-200">{izmitInfo.label}</span>
            <span className="text-slate-400 shrink-0 text-[9px]">Hissedilen {izmit.feelsLike}°</span>
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 mt-1">
            <span className="flex items-center gap-0.5">
              <Wind className="w-2.5 h-2.5 text-cyan-400" />
              {izmit.windSpeed} km/s
            </span>
            <span className="flex items-center gap-0.5">
              <Droplets className="w-2.5 h-2.5 text-blue-400" />
              %{izmit.humidity}
            </span>
          </div>
        </div>
      </div>

      {/* FACTUAL MICROCLIMATE DIFFERENCE BAR (Zero advice clutter, pure metrics) */}
      <div className="relative z-10 mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px] sm:text-[11px]">
        <div className="flex items-center gap-2 truncate">
          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-bold shrink-0 text-[9px] font-mono">
            {tempDiff > 0 ? `Fark: -${tempDiff}°C` : `Fark: +${Math.abs(tempDiff)}°C`}
          </span>
          <span className="text-slate-400 truncate text-[10px]">
            Rakım: Zirve ~396m ↔ Sahil ~6m
          </span>
        </div>

        <span className="text-[9px] text-slate-400 shrink-0 font-mono">
          Son Güncelleme: {lastUpdated}
        </span>
      </div>

      {/* ALL 12 KOCAELI DISTRICTS COMPACT & MINI GRID */}
      {showAllDistricts && (
        <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/90">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                Kocaeli İlçe İlçe Canlı Hava Durumu
              </span>
            </div>
            <span className="text-[9px] text-slate-400">12 İlçe &amp; Umuttepe</span>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1.5">
            {districts.map((d) => {
              const info = getWeatherDetails(d.weatherCode, d.isDay);
              return (
                <div
                  key={d.id}
                  className={`p-2 rounded-xl flex items-center justify-between gap-1.5 transition-colors ${
                    d.isCampus
                      ? 'bg-cyan-950/40 border border-cyan-500/40'
                      : 'bg-slate-900/80 border border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`text-[10px] font-bold truncate leading-tight ${d.isCampus ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {d.name}
                    </p>
                    <p className="text-[8px] text-slate-400 truncate mt-0.5">
                      {info.label}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <info.Icon className={`w-3.5 h-3.5 ${info.color}`} />
                    <span className="text-xs font-black text-white font-mono leading-none">
                      {d.temperature}°
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
