import React from 'react';
import { Clock } from 'lucide-react';
import { ACTIVITIES_DATA } from '../data/mockData';
import { formatCountdownTo, soonestUpcomingStart } from '../utils/eventHelpers';

/**
 * Ana sayfa istatistik şeridindeki canlı geri sayım.
 * Her 60 saniyede bir yenilenir, bileşen kaldırıldığında zamanlayıcı temizlenir.
 */
export const NextEventCountdown: React.FC = () => {
  const [text, setText] = React.useState<string | null>(() =>
    formatCountdownTo(soonestUpcomingStart(ACTIVITIES_DATA))
  );

  React.useEffect(() => {
    const refresh = () => setText(formatCountdownTo(soonestUpcomingStart(ACTIVITIES_DATA)));
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p
      aria-live="polite"
      className="mt-2 min-h-5 flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-xs font-bold text-cyan-200 whitespace-nowrap overflow-hidden"
    >
      {text && (
        <>
          <Clock aria-hidden="true" className="w-3 h-3 shrink-0 text-[#00d2eb]" />
          <span>{text}</span>
        </>
      )}
    </p>
  );
};
