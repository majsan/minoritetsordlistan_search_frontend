import axios from 'axios';
import config from '../config'

let cancel

class Backend {

  getSearchURL (inputString, category, searchLang, lexicon, searchType) {
    const lang = config.getLanguage(searchLang)

    const url =  config.backendURL + '/search?q=' + inputString + 
            '&subtypes=' + category +
            '&lang=' + lang +
            '&mode=' + lexicon
    if (searchType === 'contains') {
      return url + '&contains=true'
    }
    return url
  }

  getHTMLCall (inputString, category, searchLang, lexicon, searchType) {
    return this.getSearchURL(inputString, category, searchLang, lexicon, searchType) + '&format=html'
  }

  getQueryResult (inputString, category, searchLang, lexicon, searchType) {
    if (cancel) {
      cancel('cancel')
    }

    let url = this.getSearchURL(inputString, category, searchLang, lexicon, searchType)
    const CancelToken = axios.CancelToken;
    return new Promise(function(resolve, reject) {
      axios.get(url, {
          cancelToken: new CancelToken(function executor(c) {
            cancel = c
          })
        }).then(response => {
        resolve([_.map(response.data.result, (entry) => {
          const entrySomething = {}
          let from
          let to 
          if (searchLang === 'swe') {
            from = entry.baselang
            to = entry.targetlang[0]
          } else {
            from = entry.targetlang[0]
            to = entry.baselang
          }
          
          entrySomething.langs = [from.form, to.form]
          if (from.compound && to.compound) {
            entrySomething.compounds = _.zip(from.compound, to.compound)
          } else {
            entrySomething.compounds = []
          }
          
          return entrySomething
        }), response.data.overflow])
      }, response => {
        console.log("failure.", response)
        reject(response)
      })
    })
  }

  getCategories (lexicon) {
    return new Promise(function(resolve, reject) {
      axios.get(config.backendURL + '/subtypes', {
        params: {
          mode: lexicon
        }
      }).then(response => {
        const data = _.map(response.data.subtypes, (item) => { 
          return { 'text': item, 'value': item }
        })
        resolve(data)
      }, response => {
        console.log("failure.", response)
        reject(response)
      })
    })
  }

}

const singleton = new Backend()
export default singleton
