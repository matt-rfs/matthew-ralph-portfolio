// Homepage behaviour: the studio (one fixed 3D stage behind the page, see studio.ts), the story drawer, and the nav.
// The hero shows the instrument closed; "Sound familiar?" slides over it in daylight; the career tour then pins its
// beats over the same instrument as it comes apart. The 3D runs only on wide screens with motion allowed and WebGL
// available; everywhere else the hero shows a still and the beats stack as plain sections, every word still there.
import { moments } from '../data/site';
import { initNav, trackSections, reducedMQ } from './common';

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const STEP = 0.75; // viewport heights of scroll per beat (matches html.studio-live .studio--tour in global.css)

const webgl = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

/* The story drawer: each role's full four-part story, opened from a beat or by clicking its card. */
function openStory(id: string) {
  const dlg = $<HTMLDialogElement>('dialog.story');
  const tpl = document.getElementById(`story-${id}`) as HTMLTemplateElement | null;
  if (!dlg || !tpl) return;
  $('.story__body', dlg)!.replaceChildren(tpl.content.cloneNode(true));
  dlg.showModal();
}
function initStories() {
  const dlg = $<HTMLDialogElement>('dialog.story');
  if (!dlg) return;
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-story]');
    if (b) openStory(b.dataset.story!);
  });
  $('.story__close', dlg)!.addEventListener('click', () => dlg.close());
  // a click on the dimmed backdrop closes it too
  dlg.addEventListener('click', (e) => e.target === dlg && dlg.close());
}

/* The studio: scroll position in the tour → which beat is showing → where the instrument is in its exploded view. */
function initStudio() {
  const root = document.documentElement;
  const tour = $('.studio--tour');
  const stage = $('.stage');
  const canvas = $<HTMLCanvasElement>('.studio__canvas');
  const beats = $$<HTMLElement>('.studio--tour .studio__beat');
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (!tour || !stage || !canvas || reducedMQ.matches || saveData || !matchMedia('(min-width: 961px)').matches || !webgl()) return;
  root.classList.add('studio-live');

  let ctl: Awaited<ReturnType<typeof import('./studio').mountStudio>> | null = null;
  // before the tour this stays 0: the hero's closed instrument
  const t = () => clamp(-tour.getBoundingClientRect().top / (innerHeight * STEP), 0, beats.length - 1);
  const update = () => {
    const now = t();
    beats.forEach((b) => {
      const o = clamp(1 - (Math.abs(now - Number(b.dataset.at)) - 0.16) / 0.26, 0, 1);
      b.style.setProperty('--o', o.toFixed(3));
      b.classList.toggle('is-on', o > 0.55);
    });
    // the skip link bows out once the closing beat arrives (there's nothing left to skip)
    tour.classList.toggle('is-ending', now > beats.length - 1.6);
    ctl?.setT(now);
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();

  // the stage only draws while something lets it show through (the dark sections and the fades)
  const seen = new Set<Element>();
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
    ctl?.show(seen.size > 0);
  });
  $$('.studio, .fade').forEach((el) => io.observe(el));

  import('./studio')
    .then(async ({ mountStudio }) => {
      await document.fonts?.ready;
      ctl = await mountStudio(stage, canvas, $$('.etch-src > div'), moments.map((m) => m.role));
      ctl.setT(t(), true);
      ctl.show(seen.size > 0);
      root.classList.add('studio-ready');
      ctl.boot();
      // the canvas sits behind the page, so the tour takes the clicks: a layer under the pointer opens its story
      const onLayer = (e: MouseEvent) => !(e.target as HTMLElement).closest('a, button') && ctl!.pick(e.clientX, e.clientY);
      tour.addEventListener('click', (e) => {
        const id = onLayer(e);
        if (id) openStory(id);
      });
      tour.addEventListener('pointermove', (e) => (tour.style.cursor = onLayer(e) ? 'pointer' : ''));
      // each proof in the hero points at the layer it came from
      $$('.fix[data-role]').forEach((b) => {
        const on = () => ctl!.point(b.dataset.role!);
        const off = () => ctl!.point(null);
        b.addEventListener('pointerenter', on);
        b.addEventListener('pointerleave', off);
        b.addEventListener('focus', on);
        b.addEventListener('blur', off);
      });
    })
    .catch(() => root.classList.remove('studio-live'));
  // reduced motion switched on mid-visit: back to the still layout
  reducedMQ.addEventListener('change', () => {
    if (!reducedMQ.matches) return;
    root.classList.remove('studio-live', 'studio-ready');
    ctl?.show(false);
  });
}

export function initHome() {
  initNav(['.studio--hero', '.studio--tour']);
  trackSections([
    ['.studio--hero', ''],
    ['#help', 'help'],
    ['#career', 'career'],
    ['#work', 'work'],
    ['#answers', 'answers'],
    ['#contact', 'contact'],
  ]);
  initStudio();
  initStories();
}
