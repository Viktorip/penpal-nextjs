export const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/api/' : 'https://www.kirjekaverit.fi/api/';
export const domain = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/' : 'https://www.kirjekaverit.fi/';
export const cookiename = 'penpaluser';
export const redirectcookiename = 'redirectedfrom';
export const jwtcookiename = 'jwttoken';

export const FONT_GRECHEN = 'grechen';
export const FONT_SHANTELL = 'shantell';
export const FONT_SERIOUS = 'serious';
export const FONT_DANCING = 'dancing';
export const FONT_GRAPENUTS = 'grapenuts';
export const FONT_PATRICK = 'patrick';
export const FONT_PACIFICO = 'pacifico';


export const DB_NAME = 'penpal';
export const DB_LETTERS = 'letters';
export const DB_USERS = 'users';
export const DB_ADDRESSBOOK = 'addressbook';
export const DB_VERIFY = 'verify';

export const VISIBILITY_PRIVATE = 'private';
export const VISIBILITY_PUBLIC = 'public';

export const ERROR_MESSAGE_KEYS = {
    400: 'error_invalid_credentials',
    404: 'error_not_found_404',
    403: 'error_access_denied_403',
    500: 'error_server_500',
    200: 'status_ok_200',
    600: 'error_invalid_email',
    601: 'error_user_not_found'
}

export const ACCEPTED_DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.com', 'aol.com', 'msn.com', 'live.com', 'outlook.com'];

export const NO_REPLY_EMAIL = 'no-reply@kirjekaverit.fi';