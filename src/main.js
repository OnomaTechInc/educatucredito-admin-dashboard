// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueCordova from 'vue-cordova'
import VueHead from 'vue-head'
import store from './store'
import App from './App'
import router from './router'
import wysiwyg from 'vue-wysiwyg'

Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.use(VueCordova)
Vue.use(VueHead)
Vue.use(wysiwyg, {})

if (process.env.NODE_ENV === 'development') {
  window.apiLink = 'https://api.educatucredito.com/v1/admin/'
} else {
  window.apiLink = 'https://api.educatucredito.com/v1/admin/'
}
window.avatarColor = {
  Administrator: 'red',
  Broker: 'pink',
  Customer: 'teal'
}

// add cordova.js only if serving the app through file://
if (window.location.protocol === 'file:' || window.location.port === '3000') {
  var cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  head: {
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      }
    ]
  }
})
