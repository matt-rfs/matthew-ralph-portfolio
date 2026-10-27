// Shared by every page: nav state, small-screen menu, and the nav's tone over dark sections.
export const reducedMQ = matchMedia('(prefers-reduced-motion: reduce)');

export function initNav(darkSelectors: string[] = []) {
  const ready = () => setTimeout(() => document.documentElement.classList.add('is-ready'), 60);
  if (document.readyState === 'complete') ready();
  else addEventListener('load', ready, { once: true });

  const nav = document.querySelector<HTMLElement>('.nav')!;
  const btn = nav.querySelector<HTMLButtonElement>('.nav__toggle')!;
  const menu = nav.querySelector<HTMLElement>('.nav__menu')!;
  const close = () => {
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };
  btn.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector<HTMLElement>('a')?.focus();
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      close();
      btn.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target as Node)) close();
  });

  const darks = darkSelectors.map((s) => document.querySelector<HTMLElement>(s)).filter(Boolean) as HTMLElement[];
  const update = () => {
    nav.classList.toggle('is-scrolled', scrollY > 8);
    const probe = nav.offsetHeight / 2;
    const dark = darks.some((d) => {
      const r = d.getBoundingClientRect();
      const top = r.top + (d.dataset.darkFrom ? parseFloat(d.dataset.darkFrom) * innerHeight : 0);
      return top < probe && r.bottom > probe;
    });
    nav.dataset.tone = dark ? 'dark' : 'light';
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
  return nav;
}

// Marks the nav item for whichever homepage section is in the middle of the screen.
export function trackSections(map: [string, string][]) {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav__menu a'));
  const set = (key: string | null) =>
    links.forEach((a) => (a.dataset.key === key ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        set(map.find(([sel]) => document.querySelector(sel) === e.target)?.[1] ?? null);
      }),
    { rootMargin: '-48% 0px -50% 0px' },
  );
  map.forEach(([sel]) => {
    const el = document.querySelector(sel);
    if (el) io.observe(el);
  });
}
