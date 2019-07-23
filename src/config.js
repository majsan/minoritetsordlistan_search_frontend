import * as _ from 'lodash'

// To add and remove lexicons, only the list of languages must be changed 
export default {
  backendURL: 'https://ws.spraakbanken.gu.se/ws/minoritetsordlistan',
  languageMap: {
    swe: 'sv',
    fin: 'fi',
    yid: 'yid',
    kale: 'rom',
    kalderas: 'rom',
    lovari: 'rom',
    arli: 'rom'
  },
  getLanguage (lang) {
    const newLang = this.languageMap[lang]
    if (!newLang) {
      return this.languageMap['swe']
    } else {
      return newLang
    }
  },
  languages: [
    'fin'
    // 'yid',
    // 'kale',
    // 'kalderas',
    // 'lovari',
    // 'arli'
  ],
  lexicons: {
    fin: 'term-swefin',
    yid: 'term-sweyid',
    kale: 'term-swekale',
    kalderas: 'term-swekalderas',
    lovari: 'term-swelovari',
    arli: 'term-swearli'
  },
  lexToLang () { return _.invert(this.lexicons) },
  defaultLexicon: 'term-swefin',
  defaultSearchLang: 'swe'
}
