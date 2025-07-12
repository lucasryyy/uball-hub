import { parseWikiTable } from './utils.js';
const URL = 'https://en.wikipedia.org/wiki/2023%E2%80%9324_Bundesliga';
export const scrapeBundesliga = () => parseWikiTable(URL);
