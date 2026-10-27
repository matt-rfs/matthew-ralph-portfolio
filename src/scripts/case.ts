// Case-study pages: shared nav, plus the rail marking the section you're reading.
import { initNav } from './common';

export function initCase() {
  initNav(['.case-hero']);
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.case-rail a[data-sec]'));
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) =>
          a.dataset.sec === e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'),
        );
      }),
    { rootMargin: '-30% 0px -65% 0px' },
  );
  document.querySelectorAll('.sec[id]').forEach((s) => io.observe(s));

  // on narrow screens the project switcher scrolls sideways; bring the current project into view
  const sw = document.querySelector<HTMLElement>('.case-switch ul');
  const cur = sw?.querySelector<HTMLElement>('[aria-current="page"]')?.parentElement;
  if (sw && cur && sw.scrollWidth > sw.clientWidth) sw.scrollLeft = cur.offsetLeft - 16;

  const toc = document.querySelector<HTMLDetailsElement>('.case-toc');
  toc?.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', () => (toc.open = false)));
}
