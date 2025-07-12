import { parseWikiTable } from './utils.js';
const URL = 'https://en.wikipedia.org/wiki/2023%E2%80%9324_Premier_League';
export const scrapePremierLeague = () => parseWikiTable(URL);
