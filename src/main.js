import Vue from 'vue'
import App from './App.vue'
import VueSimpleAlert from 'vue-simple-alert';

export const eventBus = new Vue();
Vue.use(VueSimpleAlert);

new Vue({
  el: '#app',
  render: h => h(App)
});
