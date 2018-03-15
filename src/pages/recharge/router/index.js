import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/ios-index',
      name: 'iosIndex',
      component(resolve) {
        require.ensure(['rechargeViews/ios-index/ios-index'], () => {
          resolve(require('rechargeViews/ios-index/ios-index'));
        });
      }
    },
    {
      path: '/android-index',
      name: 'androidIndex',
      component(resolve) {
        require.ensure(['rechargeViews/android-index/android-index'], () => {
          resolve(require('rechargeViews/android-index/android-index'));
        });
      }
    }
  ]
});
