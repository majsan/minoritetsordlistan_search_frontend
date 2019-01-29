<template>
  <div class="row">
    <div class="col-auto ml-auto">
      <a :href="htmlLink" target="_blank"><icon name="code"></icon></a>
    </div>
  </div>
</template>

<script>
import mix from '../mix'
import Backend from '../services/backend'
export default {
  mixins: [mix],
  name: 'ExportTool',
  data () {
    return {
      query: ''
    }
  },
  computed: {
    htmlLink () {
      return Backend.getHTMLCall(
        this.globals.hot.query, 
        this.globals.hot.subtype,
        this.globals.hot.searchLang,
        this.globals.hot.lexicon,
        this.globals.hot.searchType
      )
    }
  }
}
</script>

<style scoped>

</style>
