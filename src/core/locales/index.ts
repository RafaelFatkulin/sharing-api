import i18next from 'i18next'
import en from './en.json'
import ru from './ru.json'

const resources = {
    en: {
        translation: en
    },
    ru: {
        translation: ru
    }
}

i18next.init({
    lng: 'ru',
    fallbackLng: 'en',
    debug: false,
    resources,
})

export const i18n = i18next
export const trans = i18n.t