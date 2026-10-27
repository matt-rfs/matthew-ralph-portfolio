// Every internal link goes through here so the site works under the GitHub Pages base path.
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export const href = (path = '/') => `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
