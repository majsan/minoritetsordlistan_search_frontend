// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'vue-awesome/icons/file-pdf'
import 'vue-awesome/icons/code'
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/fish'
import 'vue-awesome/icons/chevron-circle-down'
import 'vue-awesome/icons/chevron-circle-up'
import 'vue-awesome/icons/spinner'
import 'vue-awesome/icons/long-arrow-alt-right'
import 'vue-awesome/icons/long-arrow-alt-left'
import 'vue-awesome/icons/info-circle'
import 'vue-awesome/icons/question-circle'
import Icon from 'vue-awesome/components/Icon'
import App from './App'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/style.css'

Vue.component('icon', Icon)
Vue.use(BootstrapVue)

Vue.config.productionTip = false

/* directive that listens to the input event. mobile keyboards doesn't update 
   model until a compositioned event is sent and here we listen to each input
*/
Vue.directive('$model', {
  bind: function (el, binding, vnode) {
    el.oninput = () => (vnode.context[binding.expression] = el.value)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
