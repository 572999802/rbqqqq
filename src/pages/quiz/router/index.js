import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component(resolve) {
        require.ensure(['quizViews/index/index'], () => {
          resolve(require('quizViews/index/index'));
        });
      }
    },
    {
      path: '/quiz-share',
      name: 'Quiz-share',
      component(resolve) {
        require.ensure(['quizViews/quiz-share/quiz-share'], () => {
          resolve(require('quizViews/quiz-share/quiz-share'));
        });
      }
    }
  ]
});
