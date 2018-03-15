<template>
  <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"
               :bottom-method="loadBottom" ref="loadmore" class="hero-list">
    <div slot="top" class="mint-loadmore-top">
      <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
      <span v-show="topStatus === 'loading'">
         <mt-spinner :type="3" color="rgba(0,0,0,0.5)" :size="18"
                     class="mint-loadmore-spinner mint-spinner-fading-circle circle-color-6"></mt-spinner>
           正在刷新数据中...
      </span>
      <span v-show="topStatus === 'drop'">松开立即刷新</span>
      <span v-show="topStatus === 'finish'">已更新完毕</span>
    </div>
    <div class="info-list-wrapper" v-for="hero in heroList" @click="goDetail(hero.tid)">
      <div class="photo-content">
        <img v-lazy="hero.titleImage" alt="">
      </div>
      <div class="info-content">
        <h2 class="title">
          <i class="top-icon" v-if="hero.top == 1"></i> {{hero.title}}
        </h2>
        <div class="info">
          <span>
            {{hero.downloadFromNow}}
          </span>
          <!-- 不喜欢0,喜欢1, 其他2 -->
          <span>
             <i class="icon like" v-if="hero.likes==1"></i>
             <i class="icon unlike" v-else @click.stop.prevent="like(hero.tid)"></i>
               {{hero.likeNum+1}}
              <i class="icon watch"></i>
               {{hero.readNum}}
          </span>
        </div>
      </div>
    </div>
    <div class="no-more" v-show="hasBottomLoaded">
      已加载完毕~
    </div>
  </mt-loadmore>
</template>

<script type="text/ecmascript-6">
  import {ajaxRequest} from 'common/js/common';
  import config from 'common/js/config';
  export default{
    data() {
      return {
        time: '',
        userId: '',
        heroName: '',
        topStatus: '',
        hasBottomLoaded: false,
        heroList: []
      };
    },
    methods: {
      like(id) {
        var self = this;
        ajaxRequest({
          url: config.NEWS_LIKE_URL(this.userId, id),
          type: config.NEWS_LIKE_TYPE,
          successFun() {
            for (let i = 0; i < self.heroList.length; i++) {
              if (self.heroList[i].tid == id) {
                self.heroList[i].likes = 1;
                self.heroList[i].likeNum = parseInt(self.heroList[i].likeNum) + 1;
              }
            }
          }
        });
      },
      handleTopChange(state) {
        this.topStatus = state;
      },
      loadTop() {
        var self = this;
        setTimeout(() => {
          ajaxRequest({
            url: config.STRATEGY_URL,
            type: config.STRATEGY_TYPE,
            data: JSON.stringify({
              jmid: this.userId,
              heroe: self.heroName
            }),
            successFun(result) {
              self.heroList = result.list;
              self.topStatus = 'finish';
              setTimeout(() => {
                self.$refs.loadmore.onTopLoaded();
              }, 500);
            }
          });
        }, 1000);
      },
      loadBottom() {
        if (this.heroList.length > 0) {
          var self = this;
          setTimeout(() => {
            ajaxRequest({
              url: config.MORE_NEWS_URL,
              type: config.MORE_NEWS_TYPE,
              data: JSON.stringify({
                heroe: self.heroName,
                sortValue: self.heroList[self.heroList.length - 1].sortValue
              }),
              successFun(result) {
                self.heroList = self.heroList.concat(result.list);
                self.$refs.loadmore.onBottomLoaded();
                self.hasBottomLoaded = true;
                setTimeout(() => {
                  self.hasBottomLoaded = false;
                }, 1000);
              }
            });
          }, 1000);
        }
      },
      goDetail(id) {
        this.$router.push({path: '/newest-detail', query: {id: id, jm_id: this.userId}});
      }
    },
    created() {
      this.userId = this.$route.query.jm_id || 0;
      this.heroName = decodeURI(this.$route.query.name);
      if (config.IsApp === true) {
        // 顶部，是否分享（0：不分享，1：分享），分享的URL，文章标题
        if (typeof window.AndroidToast !== 'undefined') {
          window.AndroidToast.getMidTitle(this.heroName, '0', '', '');
        } else {
          window.webkit.messageHandlers.getMidTitle.postMessage({
            midTitle: this.heroName,
            isShare: '0',
            shareUrl: '',
            shareName: ''
          });
        }
      }
      var self = this;
      ajaxRequest({
        url: config.STRATEGY_URL,
        type: config.STRATEGY_TYPE,
        data: JSON.stringify({
          jmid: this.userId,
          heroe: self.heroName
        }),
        successFun(result) {
          self.heroList = result.list;
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .hero-list
    min-height: 100%
</style>
