import * as _ from 'lodash'

// To add and remove lexicons, only the list languages must be changed 
export default {
  backendURL: 'https://ws.spraakbanken.gu.se/ws/minoritetsordlistan',
  languageMap: {
    swe: 'sv',
    fin: 'fi',
    yid: 'yid',
    rom: 'rom',
    fit: 'fit'
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
    // 'rom',
    // 'fit'
  ],
  lexicons: {
    fin: 'term-swefin',
    yid: 'term-sweyid',
    rom: 'term-swerom',
    fit: 'term-swefit',
  },
  lexToLang () { return _.invert(this.lexicons) },
  defaultLexicon: 'term-swefin',
  defaultSearchLang: 'swe'
}
