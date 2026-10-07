import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

/** One Pagefind result, as returned by result.data(). */
interface PagefindResult {
  url: string;
  excerpt: string;
  meta: { title?: string };
}

interface PagefindRuntime {
  init: () => Promise<void>;
  search: (query: string) => Promise<{
    results: Array<{ data: () => Promise<PagefindResult> }>;
  }>;
}

/** The Pagefind bundle is a build artifact under /pagefind/, not part of the
 *  app shell. Import it lazily on the first search so the index and its wasm
 *  stay off the initial load. The specifier is computed at runtime (hence
 *  @vite-ignore) so Vite leaves it as a real browser import. */
let pagefindPromise: Promise<PagefindRuntime> | null = null;
function loadPagefind(): Promise<PagefindRuntime> {
  if (!pagefindPromise) {
    const base = import.meta.env.BASE_URL;
    pagefindPromise = import(/* @vite-ignore */ `${base}pagefind/pagefind.js`).then(
      async (mod) => {
        const runtime = mod as PagefindRuntime;
        await runtime.init();
        return runtime;
      }
    );
  }
  return pagefindPromise;
}

/** Pagefind reports URLs relative to the site root ("/clubs/"). Prefix the
 *  deployment base so links resolve both at the domain root and under the
 *  GitHub Pages subpath. */
function absoluteUrl(url: string): string {
  const base = import.meta.env.BASE_URL;
  if (url === '/') return base;
  return `${base}${url.replace(/^\//, '')}`;
}

const MAX_RESULTS = 8;

interface SearchProps {
  /** Extra classes for the trigger button (lets the navbar show it at the
   *  right breakpoints without rendering two live copies). */
  className?: string;
  /** Trigger button id. The navbar renders one instance per breakpoint, so
   *  each needs its own id to keep the DOM free of duplicates. */
  id?: string;
}

export const Search: React.FC<SearchProps> = ({ className = '', id = 'nav-btn-search' }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // While open: focus the input, and stop the page behind the dialog scrolling.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [open]);

  // Closing clears the query and hands focus back to the trigger button.
  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setStatus('idle');
    setActiveIndex(-1);
    buttonRef.current?.focus();
  }, []);

  // Debounced live search. The cancel flag drops responses from stale queries.
  useEffect(() => {
    if (!open) return;
    const term = query.trim();
    if (!term) {
      setResults([]);
      setStatus('idle');
      setActiveIndex(-1);
      return;
    }
    let cancelled = false;
    setStatus('loading');
    const timer = window.setTimeout(async () => {
      try {
        const pagefind = await loadPagefind();
        const search = await pagefind.search(term);
        const data = await Promise.all(
          search.results.slice(0, MAX_RESULTS).map((result) => result.data())
        );
        if (cancelled) return;
        setResults(data);
        setStatus('done');
        setActiveIndex(data.length > 0 ? 0 : -1);
      } catch {
        if (cancelled) return;
        setResults([]);
        setStatus('error');
        setActiveIndex(-1);
      }
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, open]);

  // Keyboard: Escape closes, arrows move the selection, Enter opens the active
  // result. Enter on a result link is left to the link itself.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (status !== 'done' || results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
      return;
    }
    if (event.key === 'Enter' && event.target === inputRef.current && activeIndex >= 0) {
      const target = results[activeIndex];
      if (target) {
        event.preventDefault();
        window.location.assign(absoluteUrl(target.url));
      }
    }
  };

  // Keep the selected result inside the scrollable list.
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const node = listRef.current.children[activeIndex] as HTMLElement | undefined;
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        onClick={() => setOpen(true)}
        aria-label="Sitede ara"
        aria-haspopup="dialog"
        className={`p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer ${className}`}
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site Araması"
            className="w-full max-w-xl mt-[8vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
              <SearchIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                id="search-input"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ne arıyorsunuz?"
                aria-label="Ara"
                autoComplete="off"
                className="flex-1 min-w-0 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Aramayı kapat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              id="search-results"
              className="max-h-[60vh] overflow-y-auto"
              role="status"
              aria-live="polite"
            >
              {status === 'loading' && (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">Aranıyor...</p>
              )}
              {status === 'error' && (
                <p className="px-4 py-6 text-sm text-rose-300 text-center">
                  Arama şu anda kullanılamıyor. Lütfen sayfayı yenileyip tekrar deneyin.
                </p>
              )}
              {status === 'done' && results.length === 0 && (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">Sonuç bulunamadı.</p>
              )}
              {status === 'done' && results.length > 0 && (
                <ul ref={listRef} className="divide-y divide-slate-800/70">
                  {results.map((result, index) => (
                    <li key={result.url}>
                      <a
                        href={absoluteUrl(result.url)}
                        onClick={close}
                        aria-current={index === activeIndex}
                        className={`block px-4 py-3 transition-colors ${
                          index === activeIndex ? 'bg-slate-800/70' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="block text-sm font-semibold text-slate-100">
                          {result.meta?.title || result.url}
                        </span>
                        <span
                          className="search-excerpt mt-1 block text-xs leading-relaxed text-slate-400"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
