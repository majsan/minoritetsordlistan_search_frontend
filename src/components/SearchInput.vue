<template>
  <div class="row mb-2">
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
          <button class="btn dropdown-btn-mine" @click="$emit('showSubtype')">Välj sakområde</button>
        </div>
        <div class="col-auto pd-0">
          <b-form-radio-group id="searchTypeRadio" v-model="searchType" name="searchTypeRadio" stacked>
            <b-form-radio value="prefix">Ord börjar med</b-form-radio>
            <b-form-radio value="contains">Ord innehåller</b-form-radio>
          </b-form-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

import Backend from '../services/backend'
import config from '../config'

export default {
  name: 'SearchInput',
  props: {
    searchState: {
      type: Object
    }
  },
  data () {
    return {
      searchLang: this.searchState.searchLang,
      lexicon: this.searchState.lexicon,
      availableSearchLangs: config.languages,
      searchType: this.searchState.searchType,
      lexToLang: config.lexToLang(),
      translations: {
        'swe': 'Svenska',
        'fin': 'Finska',
        'yid': 'Jiddisch',
        'rom': 'Romani',
        'fit': 'Meänkieli'
      }
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
    loc (lang) {
      return this.translations[lang]
    }
  },
  computed: {
    compoundSearch () {
      return [this.searchLang, this.searchType, this.lexicon].join()
    },
    targetLang () {
      return this.lexToLang[this.lexicon]
    }
  },
  watch: {
    compoundSearch () {
      this.$emit('update', {
        lexicon: this.lexicon,
        searchType: this.searchType,
        searchLang: this.searchLang
      })
    }
  }
}
</script>

<style>
.text-search {
  background-color: hsl(0, 0%, 95%);
  padding-top: 7px;
  padding-bottom: 7px;
}
.spinner {
  padding: 0px !important;
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
    border-color: rgb(138, 208, 219) !important;
    background-color: rgb(138, 208, 219) !important;
}
.form-control:focus {
  border-color: hsl(188, 53%, 70%) !important;
  box-shadow: inset 0 1px 1px hsl(188, 53%, 70%), 0 0 8px hsl(188, 53%, 70%) !important;
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
</style>
