<template>
  <div id="app" class="container">
    <Header @showSearch="showSearch = true" @hideSearch="showSearch = false"/>
    <template v-if="showSearch">
      <SearchInput :globals="globals" @router="update" />
      <SearchResult v-if="globals.hot.subtype !== ''" :globals="globals" @router="update"/>
      <NoSearchResult v-if="globals.hot.subtype === ''"/>
      <ExportTool :globals="globals" @router="update"/>
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
      parameters: {
        'query': {
          history: true,
          type: 'STRING',
          defaultValue: '',
          onChange: (newValue, preventAction) => {
            this.globals.hot.query = newValue
            if (! preventAction) {
              this.search(newValue, this.globals.hot.subtype, this.globals.hot.searchLang, this.globals.hot.lexicon, this.globals.hot.searchType)
            }
          }
        },
        'subtype': {
          history: true,
          type: 'STRING',
          defaultValue: '',
          onChange: (newValue, preventAction) => {
            this.globals.hot.subtype = newValue
            if (newValue === '') {
              this.globals.hot.entries = []
              this.globals.hot.overflow = false
            }
            if (! preventAction) {
              this.search(this.globals.hot.query, newValue, this.globals.hot.searchLang, this.globals.hot.lexicon, this.globals.hot.searchType)
            }
          }
        },
        'searchLang': {
          history: true,
          type: 'STRING',
          defaultValue: config.defaultSearchLang,
          onChange: (newValue, preventAction) => {
            this.globals.hot.searchLang = newValue
            if (! preventAction) {
              this.search(this.globals.hot.query, this.globals.hot.subtype, newValue, this.globals.hot.lexicon, this.globals.hot.searchType)
            }
          }
        },
        'searchType': {
          history: true,
          type: 'STRING',
          defaultValue: 'prefix',
          onChange: (newValue, preventAction) => {
            this.globals.hot.searchType = newValue
            if (! preventAction) {
              this.search(this.globals.hot.query, this.globals.hot.subtype, this.globals.hot.searchLang, this.globals.hot.lexicon, newValue)
            }
          }
        },
        'lexicon': {
          history: true,
          type: 'STRING',
          defaultValue: config.defaultLexicon,
          onChange: (newValue, preventAction) => {
            this.globals.hot.lexicon = newValue
          }
        },
        'lang': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.GUILang = newValue
          },
          defaultValue: 'swe'
        }
      },
      globals: {
        cold: {
          translations: {
            'swe': {'swe': 'Svenska'},
            'fin': {'swe': 'Finska'},
            'yid': {'swe': 'Jiddisch'},
            'rom': {'swe': 'Romani'},
            'fit': {'swe': 'Meänkieli'}
          }
        },
        hot: {
          GUILang: 'swe',
          query: '',
          subtype: '',
          searchLang: 'swe',
          searchType: 'prefix',
          lexicon: config.defaultLexicon,
          searching: false,
          entries: [],
          overflow: false
        }
      },
      showSearch: true
    }
  },
  methods: {
    search: function(query, subtype, searchLang, lexicon, searchType) {
      if (!subtype) {
        return
      }
      const backendService = Backend
      this.globals.hot.searching = true

      let canceled = false
      let http = backendService.getQueryResult(query, subtype, searchLang, lexicon, searchType)
      let that = this
      http.then(([entries, overflow]) => {
        if (query === this.globals.hot.query && 
            subtype === this.globals.hot.subtype &&
            searchLang === this.globals.hot.searchLang &&
            lexicon === this.globals.hot.lexicon &&
            searchType === this.globals.hot.searchType) {
              this.globals.hot.entries = entries
              this.globals.hot.overflow = overflow
        }
      }).catch((response) => {
        if (response.message === 'cancel') {
          canceled = true
        } else {
          console.log("A search error occured", response)
        }
      }).finally(() => {
        if (!canceled) {
          that.globals.hot.searching = false
        }
      })
    },
    update: function(actions) {
      /*
        Multiple actions in one update let several changes become only one history entry

        actions = [{
          param: "query",
          value: "simple||apa"
        }, ...]
      */
      let state = window.history.state || {}
      let newHistoryEntry = false
      for (let action of actions) {
        let param = this.parameters[action.param]
        if (action.value === param.defaultValue) {
          delete state[action.param]
        } else {
          state[action.param] = action.value
        }
        
        newHistoryEntry = newHistoryEntry || param.history
      }

      window.history.replaceState(state, "dummy", this.buildURL(state));

      this.syncAppState(state)

    },
    buildURL: function(state) {
      return "?" + _.map(_.keys(state), (key) => { return key + "=" + state[key] }).join("&")
    },
    syncAppState: function(state, initPreventAction) {
      // Should update the internal state of the application to the provided one.
      // It's either called after the update function has been called by a component
      // or from the window.onpopstate function to make sure the app state is synced with the browser's back/forward buttons

      let oldState = window.lastHistoryState || {}

      let diff = this.diffObjects(state, oldState)
      let invertedDiff = this.diffObjects(oldState, state)

      let handled = {}
      for (let paramID in diff) {
        handled[paramID] = true
        this.syncParam(this.parameters[paramID], state[paramID], initPreventAction)
      }
      for (let paramID in invertedDiff) {
        if (!handled[paramID]) {
          // Deleted item (i.e. an item that has changed back to the default)
          let param = this.parameters[paramID]
          this.syncParam(param, param.defaultValue, initPreventAction)
        }
      }

      window.lastHistoryState = state
    },
    syncParam: function(param, newValue, initPreventAction) {
      let convertedParamValue = this.convertParamValue(newValue, param.type)
      if (param.onChange) {
        param.onChange(convertedParamValue, param.preventAction || initPreventAction || false)
      }
    },
    convertParamValue: function(inValue, type = 'STRING') {
      switch(type) {
        case 'STRING':
          return inValue
        case 'NUMBER':
          return Number(inValue)
      }
    },
    makeStartingState: function() {
      let url = window.location.search
      let state = {}
      if (_.includes(url, "?")) {
        url = url.split("?")[1] // Maybe needs some tweaking
        let parts = url.split("&")
        for (let part of parts) {
          let [key, value] = part.split("=")
          state[key] = value
          window.history.replaceState(state, "init")
        }
      } else {
        // Maybe use some default state
      }
      this.syncAppState(state, true)
    },
    diffObjects: function(object, base) { // REM: This doesn't seem to work with non-existant keys
      /**
       * Deep diff between two object, using lodash
       * @param  {Object} object Object compared
       * @param  {Object} base   Object to compare with
       * @return {Object}        Return a new object who represent the diff
       */
      function changes(object, base) {
        return _.transform(object, function(result, value, key) {
          if (!_.isEqual(value, base[key])) {
            result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value
          }
        })
      }
      return changes(object, base)
    }
  },
  created: function() {
    this.$watch('globals.hot', function() { this.$nextTick() }, {deep: true} )

    let that = this

    window.onpopstate = function(event) {
      if (event.state) {
        that.syncAppState(event.state)
      } else {
        that.makeStartingState()
      }
    }

    // Set up URL to default parameters:
    this.makeStartingState()
  },
  mounted () {
    this.search(this.globals.hot.query, this.globals.hot.subtype, this.globals.hot.searchLang, this.globals.hot.lexicon, this.globals.hot.searchType)
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
