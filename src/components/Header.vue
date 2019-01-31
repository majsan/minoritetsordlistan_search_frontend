<template>
  <div class="row">
    <div class="col-12">
      <div class="row menu">
        <div class="col-auto title">
          <a href="."><h2>Minoritetsordlistan</h2></a>
        </div>
        <div class="ml-auto col-auto buttons">
          <span class="clickable" @click="showInfo"><icon name="info-circle" scale="1.8" style="margin-right: 4px;"></icon></span>
          <span class="clickable" @click="showHelp"><icon name="question-circle" scale="1.8"></icon></span>
        </div>
      </div>
      <div v-if="showingInfo" class="row">
        <div class="col-12">
          <button class="btn btn-mine" @click="showSearch">Tillbaka till sök</button>
          <span v-html="infoContent"></span>
        </div>
      </div>
      <div v-if="showingHelp" class="row">
        <div class="col-12">
          <button class="btn btn-mine" @click="showSearch">Tillbaka till sök</button>
          <span v-html="helpContent"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import infoContent from '../assets/info.html'
import helpContent from '../assets/help.html'

export default {
  name: 'Header',
  data () {
    return {
      showingInfo: false,
      showingHelp: false,
      infoContent: infoContent,
      helpContent: helpContent
    }
  },
  methods: {
    showSearch () {
      window.history.back()
    },
    showInfo () {
      if (this.showingHelp) {
        window.history.replaceState({}, "infohelp", window.location)
      } else {
        window.history.pushState({}, "infohelp", window.location)
        this.$emit('hideSearch')
      }
      this.showingInfo = true
      this.showingHelp = false
      this.$emit('hideSearch')
    },
    showHelp () {
      if (this.showingInfo) {
        window.history.replaceState({}, "infohelp", window.location)
      } else {
        window.history.pushState({}, "infohelp", window.location)
        this.$emit('hideSearch')
      }
      this.showingHelp = true
      this.showingInfo = false
    }
  },
  created () {
    const that = this
    window.addEventListener('popstate', function (e) {
      if (that.showingHelp || that.showingInfo) {
        that.showingInfo = false
        that.showingHelp = false
        that.$emit('showSearch')
      }
    })
  }
}
</script>

<style scoped>
.menu {
  background-color: rgba(23, 162, 184, 0.5);
  margin-bottom: 15px;
  padding-top: 10px;
}
.menu h2 {
  font-size: 1.5rem;
}
.title {
  padding-right: 0px;
}
.clickable {
  cursor: pointer;
}
.buttons {
  padding-left: 5px;
}
.btn-mine {
  background-color: #8ad0db !important;
  border-color: #8ad0db !important;
  margin-bottom: 10px;
}
</style>
