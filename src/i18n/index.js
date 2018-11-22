import en from './en.json';
import th from './th.json';

const langs = {
  en,
  th
};

export default function (lang = 'en') {
  return langs[lang];
};