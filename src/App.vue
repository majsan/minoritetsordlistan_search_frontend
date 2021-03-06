<template>
  <div id="app" class="container">
    <Header @showSearch="showSearch = true" @hideSearch="showSearch = false"/>
    <template v-if="showSearch">
      <SearchInput @update="update" :searchState="searchState" :searching="searching"/>
      <SearchResult v-if="searchState.subtype !== ''" :entries="entries" :overflow="overflow" :searching="searching"/>
      <NoSearchResult v-if="searchState.subtype === ''"/>
      <ExportTool :searchState="searchState"/>
    </template>
  </div>
</template>

<script>

import Backend from './services/backend'
import SearchInput from './components/SearchInput'
import SearchResult from './components/SearchResult'
import NoSearchResult from './components/NoSearchResult'
import Header from './components/Header'
import ExportTool from './components/ExportTool'
import config from './config'

export default {
  name: 'app',
  components: {
    SearchInput, SearchResult, ExportTool, NoSearchResult, Header
  },
  data () {
    return {
      parameters: ['query', 'subtype', 'searchLang', 'lexicon', 'searchType'],
      defaultSearchState: {
        query: '',
        subtype: '',
        searchLang: 'swe',
        searchType: 'prefix',
        lexicon: config.defaultLexicon,
      },
      searchState: {},
      searching: false,
      entries: [],
      overflow: false,
      showSearch: true
    }
  },
  methods: {
    update (newSearchState) {
      this.searchState = Object.assign({}, this.searchState, newSearchState)
      this.createPath()
      this.search(newSearchState.query, newSearchState.subtype, 
        newSearchState.searchLang, newSearchState.lexicon, newSearchState.searchType)
    },
    search (query, subtype, searchLang, lexicon, searchType) {
      if (!subtype) {
        return
      }
      const backendService = Backend
      this.searching = true

      let canceled = false
      let http = backendService.getQueryResult(query, subtype, searchLang, lexicon, searchType)
      let that = this
      http.then(([entries, overflow]) => {
        if (query === this.searchState.query && 
            subtype === this.searchState.subtype &&
            searchLang === this.searchState.searchLang &&
            lexicon === this.searchState.lexicon &&
            searchType === this.searchState.searchType) {
              this.entries = entries
              this.overflow = overflow
        }
      }).catch((response) => {
        if (response.message === 'cancel') {
          canceled = true
        } else {
          console.log("A search error occured", response)
        }
      }).finally(() => {
        if (!canceled) {
          that.searching = false
        }
      })
    },
    createPath () {
      const locationObj = []
      this.parameters.map((param) => {
        if (this.searchState[param] !== this.defaultSearchState[param]) {
          locationObj.push([param, this.searchState[param]].join('='))
        }
      })
      history.replaceState({}, '', '?' + locationObj.join('&'));
    },
    readPath () {
      const locationObj = {}
      location.search.slice(1).split('&').map((elem) => {
        const [key, value] = elem.split('=')
        locationObj[key] = value
      })
      this.parameters.map((param) => {
        if (param in locationObj) {
          this.$set(this.searchState, param, locationObj[param])
        } else {
          this.$set(this.searchState, param, this.defaultSearchState[param])
        }
      })
    }
  },
  created () {
    this.readPath()
  },
  mounted () {
    this.search(this.searchState.query, this.searchState.subtype, this.searchState.searchLang, 
                this.searchState.lexicon, this.searchState.searchType)
  }
}
</script>

<style>
#app {
  color: hsl(0, 0%, 30%);
  background-color: #fff;
  box-shadow: 0 2px 6px 0 hsla(0, 0%, 0%, 0.2);
}
</style>
