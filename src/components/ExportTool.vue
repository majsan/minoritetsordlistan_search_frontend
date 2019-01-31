<template>
  <div class="export-row">
    <div>
      <a :href="htmlLink" target="_blank"><icon name="code"></icon></a>
    </div>
  </div>
</template>

<script>
import Backend from '../services/backend'
export default {
  name: 'ExportTool',
  props: {
    searchState: {
      type: Object
    }
  },
  data () {
    return {
      query: ''
    }
  },
  computed: {
    htmlLink () {
      return Backend.getHTMLCall(
        this.searchState.query, 
        this.searchState.subtype,
        this.searchState.searchLang,
        this.searchState.lexicon,
        this.searchState.searchType
      )
    }
  }
}
</script>

<style scoped>
.export-row {
  bottom: 0px;
  right: 10px;
  position: absolute;
}
</style>
