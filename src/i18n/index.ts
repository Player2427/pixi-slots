import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      balance: 'Balance',
      bet: 'Bet',
      spin: 'Spin',
      win: 'Win',
      sound: 'Sound',
    },
  },
  ru: {
    translation: {
      balance: 'Баланс',
      bet: 'Ставка',
      spin: 'Спин',
      win: 'Выигрыш',
      sound: 'Звук',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
