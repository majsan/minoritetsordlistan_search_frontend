<template>
  <div class="row search-results">
    <div class="col-12">
      <div class="row entry" v-for="(entry, idx) in entries" v-b-toggle="'additionalInfo' + idx">
        <div class="col">
          <div variant="primary" class="primary-info row">
            <div class="col-12">
              <template v-for="(lang, langidx) in entry.langs">
                <template v-for="(form, idx) in lang">
                  <span v-bind:class="{'font-weight-bold': langidx === 0}">{{formatWordForm(form, idx, lang)}}</span>
                  <span v-if="form.latin" v-bind:class="{'font-weight-bold': langidx === 0}">({{formatLatinForm(form, idx, lang)}})</span>
                  <span v-if="form.comment" style="font-style: italic">{{formatComment(form, idx, lang)}}</span>
                </template>
              </template>
            </div>
          </div>
          <b-collapse v-bind:id="'additionalInfo' + idx" class="row" v-if="entry.compounds.length > 0">
            <div class="col-12">
              <ul class="additional-info">
                <li v-for="compound in entry.compounds">
                  <span class="mr-1" style="font-weight: 600">{{compound[0]}}</span>
                  <span>{{compound[1]}}</span>
                </li> 
              </ul>
            </div>
          </b-collapse>
        </div>
        <div class="col-1 show-extra-info-icon" v-if="entry.compounds.length > 0">
          <span class="when-closed"><icon name="chevron-circle-down"></icon></span>
          <span class="when-opened"><icon name="chevron-circle-up"></icon></span>
        </div>
      </div>
      <div v-if="noResults" class="row no-results">
        <div class="col-12">
          Inga träffar
        </div>
      </div>
      <div v-if="overflow" class="row overflow">
        <div class="col-12">
          Hela sökningen kan inte visas.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  props: [
    'entries',
    'overflow',
    'searching'
  ],
  data () {
    return {
    }
  },
  methods: {
    formatWordForm (form, idx, lang) {
      if ((!form.latin || !form.comment) && idx != lang.length - 1) {
        return form.wordform + ','
      }
      return form.wordform
    },
    formatLatinForm (form, idx, lang) {
      if (!form.comment && idx != lang.length - 1) {
        return form.latin + ','
      }
      return form.latin
    },
    formatComment (form, idx, lang) {
      if (idx != lang.length - 1) {
        return form.comment + ','
      }
      return form.comment
    }
  },
  computed: {
    noResults () {
      return this.entries.length == 0 
          && !this.searching
    }
  }
}
</script>

<style scoped>
.entry {
  padding: 10px;
}
.no-results {
  padding: 10px;
  background-color: #add8e67a;
}
.entry:nth-child(even){
  background-color: #add8e67a;
}
.entry:nth-child(odd){
  background-color: #add8e63b;
}
.primary-info {
  display: block;
}
ul.additional-info {
  list-style: none;
  margin-left: 0;
  padding-left: 1em;
}
ul.additional-info > li:before {
  display: inline-block;
  content: "-";
  width: 1em;
  margin-left: -1em;
}
.show-extra-info-icon {
  color: #8ad0db;
  text-align: right;
}
.overflow {
  background-color: hsl(0, 0%, 90%);
  font-size: 0.8em;
}
.entry.collapsed .when-opened {
  display: none;
}
.when-closed {
  display: none;
}
.entry.collapsed .when-closed {
  display: inline-block;
}
</style>
