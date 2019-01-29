<template>
  <div>
    <button @click="setLang('swe')">Svenska</button>&nbsp;<button @click="setLang('eng')">English</button>
  </div>
</template>


<script>

import mix from '../mix'
export default {
  mixins: [mix],
  name: 'LangChoice',
  methods: {
    setLang: function(lang) {
      this.update('lang', lang)
    }
  }
}
</script>

<style scoped>

</style>
