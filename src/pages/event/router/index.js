import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component(resolve) {
        require.ensure(['eventViews/index/index'], () => {
          resolve(require('eventViews/index/index'));
        });
      }
    },
    {
      path: '/all-schedule',
      name: 'AllSchedule',
      component(resolve) {
        require.ensure(['eventViews/all-schedule/all-schedule'], () => {
          resolve(require('eventViews/all-schedule/all-schedule'));
        });
      }
    },
    {
      path: '/battle-detail',
      name: 'BattleDetail',
      component(resolve) {
        require.ensure(['eventViews/battle-detail/battle-detail'], () => {
          resolve(require('eventViews/battle-detail/battle-detail'));
        });
      }
    }
  ]
});
