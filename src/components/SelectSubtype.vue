<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="row menu">
          <div class="col-auto title">
            <h2>Välj sakområde</h2>
          </div>
          <div class="ml-auto col-auto">
            <span class="clickable" @click="exitButton"><icon name="times" scale="1.8" style="margin-right: 4px;"></icon></span>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-auto">
        <button class="btn btn-mine btn-md mr-2 mb-2" @click="selectAllSubtypes">Markera alla</button>
        <button class="btn btn-mine btn-md mb-2" @click="deselectAllSubtypes">Avmarkera alla</button>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-6 mb-2">
        <input type="text" class="form-control form-control-lg" v-$model="subtypeSearch" placeholder="Filtrera sakområden">
      </div>
    </div>
    <div class="row pb-3">
      <div class="col-12 col-md-6">
        <div class="row subtype my-1 align-items-center mx-md-1 mx-lg-1" v-bind:class="{selected : selected}" 
              @click="toggleSubclass(option)" v-for="[option, selected] in options">
          <div class="col-12">
            <icon class="check" name="check" scale="1.8"></icon>
            <span>{{option}}</span>
          </div>
        </div>
      </div>
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
    },
    showSubtype: Boolean
  },
  data () {
    return {
      selectedSubtypes: _.compact(decodeURI(this.searchState.subtype).split(',')),
      availableSubtypes: [],
      subtypeSearch: '',
      isVisible: false
    }
  },
  methods: {
    selectAllSubtypes () {
      this.selectedSubtypes = _.map(this.options, (elem) => elem[0])
    },
    deselectAllSubtypes () {
      this.selectedSubtypes = []
    },
    exitButton () {
      window.history.back()
    },
    hideSubtypeSelector () {
      if (this.showSubtype) {
        this.$emit('hideSubtype', this.selectedSubtypes)
      }
    },
    toggleSubclass (clickedSubtype) {
      const idx = this.selectedSubtypes.indexOf(clickedSubtype)
      if (idx != -1) {
        this.selectedSubtypes.splice(idx, 1)
      } else {
        this.selectedSubtypes.push(clickedSubtype)
      }
    }
  },
  computed: {
    options () {
      return _.map(_.filter(this.availableSubtypes, subtype => {
        return _.includes(subtype.toLowerCase(), this.subtypeSearch.toLowerCase())
      }), subtype => {
        return [subtype, this.selectedSubtypes.indexOf(subtype) != -1] 
      })
    }
  },
  destroyed(){
    window.removeEventListener('popstate', this.hideSubtypeSelector)
  },
  mounted(){
    window.addEventListener('popstate', this.hideSubtypeSelector)
  },
  created () {
    Backend.getCategories(this.lexicon).then(response => {
      this.availableSubtypes = response
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
.btn-mine {
  background-color: #8ad0db !important;
  border-color: #8ad0db !important;
}
.subtype {
  height: 50px;
  font-size: 1.2em;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
}
.subtype.selected .check, .subtype:hover .check {
  color: hsl(188, 53%, 42%)
}
.subtype .check {
  color: hsl(188, 53%, 88%)
}
.subtype.selected {
  background-color: hsl(188, 53%, 70%);
}
.subtype:hover {
  background-color: hsl(188, 53%, 88%);
}
.form-control:focus {
  border-color: hsl(188, 53%, 70%);
  box-shadow: inset 0 1px 1px hsl(188, 53%, 70%), 0 0 8px hsl(188, 53%, 70%);
}
</style>
