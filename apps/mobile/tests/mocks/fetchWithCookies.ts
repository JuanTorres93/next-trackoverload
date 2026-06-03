import makeFetchCookie from "fetch-cookie";
import { CookieJar } from "tough-cookie";

const cookieJar = new CookieJar();
const fetchWithCookies = makeFetchCookie(fetch, cookieJar);

beforeAll(() => {
  global.fetch = fetchWithCookies as typeof fetch;
});
