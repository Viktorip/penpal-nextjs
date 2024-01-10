export const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/api/' : 'https://penpal-nextjs.vercel.app/api/';
export const cookiename = 'penpaluser';
export const redirectcookiename = 'redirectedfrom';
export const jwtcookiename = 'jwttoken';

export const FONT_CAVEAT = 'caveat';
export const FONT_INDIEFLOWER = 'indieflower';
export const FONT_NOTHING = 'nothing';
export const FONT_PARISIENNE = 'parisienne';
export const FONT_REENIEBEANIE = 'reeniebeanie';
export const FONT_TANGERINE = 'tangerine';

export const DB_NAME = 'penpal';
export const DB_LETTERS = 'letters';
export const DB_USERS = 'users';