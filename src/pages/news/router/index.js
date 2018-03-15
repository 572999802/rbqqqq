import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Newest',
      component(resolve) {
        require.ensure(['newsViews/newest/newest'], () => {
          resolve(require('newsViews/newest/newest'));
        });
      }
    },
    {
      path: '/newest-detail',
      name: 'NewestDetail',
      component(resolve) {
        require.ensure(['newsViews/newest-detail/newest-detail'], () => {
          resolve(require('newsViews/newest-detail/newest-detail'));
        });
      }
    },
    {
      path: '/strategy',
      name: 'Strategy',
      component(resolve) {
        require.ensure(['newsViews/strategy/strategy'], () => {
          resolve(require('newsViews/strategy/strategy'));
        });
      }
    },
    {
      path: '/hero-list',
      name: 'HeroList',
      component(resolve) {
        require.ensure(['newsViews/strategy/hero-list'], () => {
          resolve(require('newsViews/strategy/hero-list'));
        });
      }
    },
    {
      path: '/video',
      name: 'Video',
      component(resolve) {
        require.ensure(['newsViews/video/video'], () => {
          resolve(require('newsViews/video/video'));
        });
      }
    }
  ]
});
