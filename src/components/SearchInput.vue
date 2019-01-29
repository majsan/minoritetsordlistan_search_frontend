<template>
  <div class="search-box row">
    <div class="col-12">
      <div class="row lang-row">
        <div class="col-auto pr-1">
          <div class="lang" v-bind:class="{'active-lang': searchLang === 'swe'}">
            {{loc('swe')}}
          </div>
        </div>
        <div class="col-auto px-1">
          <div @click="switchOrder()" class="lang-switch">
            <icon class="first-icon" v-bind:class="{active : searchLang === 'swe'}" name="long-arrow-alt-right"></icon>
            <icon class="second-icon" v-bind:class="{active : searchLang !== 'swe'}" name="long-arrow-alt-left"></icon>
          </div>
        </div>
        <div class="col">
          <div class="row">
            <div class="col-auto px-1" v-for="lang in availableSearchLangs">
              <div @click="setLexicon(lang)" class="lang selectable" v-bind:class="{selected: targetLang === lang, 'active-lang': searchLang === lang}">
                {{loc(lang)}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          <b-dropdown text="Välj sakområde" class="mb-2" toggle-class="dropdown-btn-mine" @hide="closeDropdown()">
            <!-- .bg-white and .text-body suppress .dropdown-item.active and .dropdown-item:active styles -->
            <div class="dropdown-item bg-white text-body">
              <span class="small-btn mr-2" @click="selectAllSubtypes">Markera alla</span>
              <span class="small-btn" @click="deselectAllSubtypes">Avmarkera alla</span>
            </div>
            <div class="dropdown-item bg-white text-body" v-if="availableSubtypes.length >= 25">
              <input type="text" v-$model="subtypeSearch" placeholder="Filtrera sakområden">
            </div>
            <div class="dropdown-item bg-white text-body">
              <b-form-checkbox-group stacked v-model="selectedSubtypesModel" name="subtypes" :options="options"/>
            </div>
          </b-dropdown>
        </div>
        <div class="col-auto pd-0">
          <b-form-radio-group id="searchTypeRadio" v-model="searchType" name="searchTypeRadio" stacked>
            <b-form-radio value="prefix">Ord börjar med</b-form-radio>
            <b-form-radio value="contains">Ord innehåller</b-form-radio>
          </b-form-radio-group>
        </div>
      </div>

      <div class="row selected-subtypes">
        <div class="col-12">
          <span class="font-weight-bold">Valda sakområden:</span> {{selectedSubtypes.join(', ')}}
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-search">
          <icon name="search" class="search-icon"></icon>
          <input type="search" autocorrect="off" autocapitalize="off" spellcheck="false" 
                 @keyup="checkEnter" @input="debounceQuery" v-model="modelQuery" 
                 :placeholder="placeholder" class="mr-2"/>
          <icon v-if="globals.hot.searching" name="spinner" pulse></icon>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

import mix from '../mix'
import Backend from '../services/backend'
import config from '../config'

export default {
  mixins: [mix],
  name: 'SearchInput',
  components: { },
  data () {
    return {
      query: decodeURI(this.globals.hot.query),
      modelQuery: decodeURI(this.globals.hot.query),
      searchLang: this.globals.hot.searchLang,
      lexicon: this.globals.hot.lexicon,
      selectedSubtypes: _.compact(decodeURI(this.globals.hot.subtype).split(',')),
      selectedSubtypesModel: _.compact(decodeURI(this.globals.hot.subtype).split(',')),
      availableSearchLangs: config.languages,
      placeholder: 'Mata in ett sökuttryck',
      availableSubtypes: [],
      subtypeSearch: '',
      searchType: this.globals.hot.searchType,
      lexToLang: config.lexToLang()
    }
  },
  methods: {
    switchOrder () {
      if (this.searchLang === 'swe') {
        this.searchLang = this.targetLang 
      } else {
        this.searchLang = 'swe'
      }
    },
    setLexicon (lang) {
      this.lexicon = config.lexicons[lang]
      if (this.searchLang !== 'swe') {
        this.searchLang = lang
      }
    },
    debounceQuery: _.debounce(function (e) {
      this.query = e.target.value
    }, 300),
    closeDropdown () {
      this.selectedSubtypes = this.selectedSubtypesModel
      this.subtypeSearch = ''
    },
    checkEnter: function(e) {
      if(e.keyCode == 13) {
          e.target.blur()
      }
    },
    selectAllSubtypes () {
      this.selectedSubtypesModel = _.map(this.options, (elem) => elem.value)
    },
    deselectAllSubtypes () {
      this.selectedSubtypesModel = []
    }
  },
  computed: {
    compoundSearch () {
      return [this.query, this.selectedSubtypes, this.searchLang, this.searchType].join()
    },
    options () {
      return _.filter(this.availableSubtypes, subtype => {
        return _.includes(subtype.value.toLowerCase(), this.subtypeSearch.toLowerCase())
      })
    },
    targetLang () {
      return this.lexToLang[this.lexicon]
    }
  },
  created() {
    Backend.getCategories(this.globals.hot.lexicon).then(response => {
      this.availableSubtypes = response
    })
  },
  watch: {
    compoundSearch () {
      this.update([
        {param: 'query', value: encodeURI(this.query), preventAction: true},
        {param: 'subtype', value: encodeURI(this.selectedSubtypes.join(',')), preventAction: true},
        {param: 'lexicon', value: this.lexicon, preventAction: true},
        {param: 'searchType', value: this.searchType, preventAction: true},
        {param: 'searchLang', value: this.searchLang}
      ])
    },
    lexicon () {
      Backend.getCategories(this.lexicon).then(response => {
        this.availableSubtypes = response
      })
      if (this.selectedSubtypes.length == 0) {
        this.update({param: 'lexicon', value: this.lexicon})
      } else {
        this.selectedSubtypes = []
        this.selectedSubtypesModel = []
      }
    }
  }
}
</script>

<style>
.text-search {
  background-color: hsl(0, 0%, 95%);
  padding: 7px;
}
.search-icon {
  margin-right: 7px;
}
.search-icon * {
  color: hsl(0, 0%, 85%);
}
.lang {
  background-color: hsl(0, 0%, 95%);
  padding: 7px;
  border-radius: 5px;
  border: 2px solid hsl(0, 0%, 100%);
}
.lang.selectable {
  cursor: pointer;
}
.lang.selected {
  border: 2px solid hsl(188, 53%, 70%);
  background-color: hsl(196, 53%, 90%);
}
.active-lang {
  font-weight: 600;
}
.lang:not(:last-child) {
  margin-right: 7px;
}
.lang-row {
  margin-bottom: 15px;
}
.dropdown-btn-mine {
  background-color: #8ad0db !important;
  border-color: #8ad0db !important;
  color: hsla(0, 0%, 100%, 0.9) !important;
}
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
    background-color: rgb(138, 208, 219) !important;
}
.custom-control-input:checked ~ .custom-control-label::before {
    color: #fff;
    background-color: rgb(138, 208, 219) !important;
}
.lang-switch {
  color: hsl(0, 0%, 75%);
  height: 35px;
  overflow: hidden;
  cursor: pointer;
}
.active {
  color: hsl(0, 0%, 30%);
}
.first-icon {
  margin-top: 8px;
  display: block !important;
}
.second-icon {
  margin-top: -20px;
}
.selected-subtypes {
  background-color: hsl(0, 0%, 90%);
  font-size: 0.8em;
  margin-top: 15px;
}
.small-btn {
  cursor: pointer;
}
</style>
