<template>
  <div class="newest">
    <div class="loading-wrapper" v-if="loading">
      <img class="loading" src="../../../../assets/loading.gif" alt="">
    </div>
    <div v-else>
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom"
                   class="newest-wrapper" @top-status-change="handleTopChange" ref="loadmore">
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
        <div class="photo-wrapper">
          <mt-swipe :auto="1500">
            <mt-swipe-item v-for="photo in photoList" :key="photo.titleImage">
              <img class="photo" v-lazy="photo.titleImage" alt="图片" @click="goDetail(photo.tid)">
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <div class="info-list-wrapper" v-for="news in newestList"
             @click="goDetail(news.tid)">
          <div class="photo-content">
            <img v-lazy="news.titleImage" alt="">
          </div>
          <div class="info-content">
            <h2 class="title">
              <i class="top-icon" v-if="news.top == 1"></i> {{news.title}}
            </h2>
            <div class="info">
          <span>
            {{news.downloadFromNow}}
          </span>
              <!-- 不喜欢0,喜欢1, 其他2 -->
              <span>
            <i class="icon like" v-if="news.likes==1"></i>
             <i class="icon unlike" v-else @click.stop.prevent="like(news.tid)"></i>
               {{news.likeNum}}
              <i class="icon watch"></i>
               {{news.readNum}}
          </span>
            </div>
          </div>
        </div>
        <div class="no-more" v-show="hasBottomLoaded">
          已加载完毕~
        </div>
      </mt-loadmore>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ajaxRequest} from 'common/js/common';
  import config from 'common/js/config';
  export default{
    data() {
      return {
        loading: true,
        userId: '',
        photoList: [],
        topStatus: '',
        hasBottomLoaded: false,
        newestList: []
      };
    },
    methods: {
      like(id) {
        var self = this;
        ajaxRequest({
          url: config.NEWS_LIKE_URL(this.userId, id),
          type: config.NEWS_LIKE_TYPE,
          successFun() {
            for (let i = 0; i < self.newestList.length; i++) {
              if (self.newestList[i].tid == id) {
                self.newestList[i].likes = 1;
                self.newestList[i].likeNum = parseInt(self.newestList[i].likeNum) + 1;
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
            url: config.LOOP_REPLAY_URL,
            type: config.LOOP_REPLAY_TYPE,
            successFun(result) {
              self.photoList = result.list;
              ajaxRequest({
                url: config.NEWS_URL(self.userId),
                type: config.NEWS_TYPE,
                successFun(result) {
                  self.newestList = result.list;
                  self.topStatus = 'finish';
                  setTimeout(() => {
                    self.$refs.loadmore.onTopLoaded();
                  }, 500);
                }
              });
            }
          });
        }, 1000);
      },
      loadBottom() {
        if (this.newestList.length > 0) {
          var self = this;
          setTimeout(() => {
            ajaxRequest({
              url: config.MORE_NEWS_URL,
              type: config.MORE_NEWS_TYPE,
              data: JSON.stringify({
                jmid: self.id,
                sortValue: self.newestList[self.newestList.length - 1].sortValue
              }),
              successFun(result) {
                self.newestList = self.newestList.concat(result.list);
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
        if (config.IsApp === true) {
          // 跳转url
          var url = 'http://' + document.location.hostname +
            '/ugaming/news.html#/newest-detail?id=' + id + '&jm_id=' + this.userId;
          if (typeof window.AndroidToast !== 'undefined') {
            window.AndroidToast.nextOne(url);
          } else {
            window.webkit.messageHandlers.nextOne.postMessage({
              url: url
            });
          }
        } else {
          this.$router.push({path: '/newest-detail', query: {id: id, jm_id: this.userId}});
        }
      }
    },
    created() {
      this.userId = this.$route.query.jm_id || 0;
      var self = this;
      ajaxRequest({
        url: config.LOOP_REPLAY_URL,
        type: config.LOOP_REPLAY_TYPE,
        successFun(result) {
          self.photoList = result.list;
        }
      });
      ajaxRequest({
        url: config.NEWS_URL(self.userId),
        type: config.NEWS_TYPE,
        successFun(result) {
          self.newestList = result.list;
          self.loading = false;
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .newest
    min-height: 100%
    .newest-wrapper
      min-height: 1000px
      .watch
        margin-left: 0.2rem
      .photo-wrapper
        width: 100%
        height: 400px
        .photo
          width: 100%

</style>
