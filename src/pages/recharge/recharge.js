// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '../../../node_modules/mint-ui/lib/style.css';
import 'common/stylus/index.styl';
import Vue from 'vue';
import Recharge from './Recharge.vue';
import router from './router';
import MintUi from 'mint-ui';
Vue.use(MintUi);
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#recharge',
  router,
  template: '<Recharge/>',
  components: {Recharge}
});
