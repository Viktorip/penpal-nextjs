export const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/api/' : 'https://www.kirjekaverit.fi/api/';
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
export const DB_ADDRESSBOOK = 'addressbook';

export const VISIBILITY_PRIVATE = 'private';
export const VISIBILITY_PUBLIC = 'public';

export const ERROR_MESSAGE_KEYS = {
    404: 'error_not_found_404',
    403: 'error_access_denied_403',
    500: 'error_server_500',
    200: 'status_ok_200',
    600: 'error_invalid_email'
}