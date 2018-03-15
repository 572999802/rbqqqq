<template>
  <div class="video">
    <div class="loading-wrapper" v-if="loading">
      <img class="loading" src="../../../../assets/loading.gif" alt="">
    </div>
    <div v-else>
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom"
                   class="video-wrapper" @top-status-change="handleTopChange" ref="loadmore">
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
        <div class="info-list-wrapper" v-for="video in videoList" @click="watchVideo(video.tid,video.video)">
          <div class="photo-content video-info-wrapper">
            <img :src="video.videoImg"/>
            <i class="icon-play"></i>
          </div>
          <div class="info-content">
            <h2 class="title">
              <i class="top-icon" v-if="video.top == 1"></i> {{video.title}}
            </h2>
            <div class="info">
          <span>
            {{video.downloadFromNow}}
          </span>
              <!-- 不喜欢0,喜欢1, 其他2 -->
              <span>
            <i class="icon like" v-if="video.likes==1"></i>
             <i class="icon unlike" v-else @click.stop.prevent="like(video.tid)"></i>
               {{video.likeNum}}
              <i class="icon watch"></i>
               {{video.readNum}}
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
        topStatus: '',
        hasBottomLoaded: false,
        videoList: []
      };
    },
    methods: {
      like(id) {
        var self = this;
        ajaxRequest({
          url: config.NEWS_LIKE_URL(this.userId, id),
          type: config.NEWS_LIKE_TYPE,
          successFun() {
            for (let i = 0; i < self.videoList.length; i++) {
              if (self.videoList[i].tid == id) {
                self.videoList[i].likes = 1;
                self.videoList[i].likeNum = parseInt(self.videoList[i].likeNum) + 1;
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
        }, 1000);
      },
      loadBottom() {
        if (this.videoList.length > 0) {
          var self = this;
          setTimeout(() => {
            ajaxRequest({
              url: config.MORE_VIDEO_URL,
              type: config.MORE_VIDEO_TYPE,
              data: JSON.stringify({
                sortValue: self.videoList[self.videoList.length - 1].sortValue
              }),
              successFun(result) {
                self.videoList = self.videoList.concat(result.list);
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
        this.$router.push({path: '/video-detail', query: {id: id}});
      },
      watchVideo(id, url) {
        ajaxRequest({
          url: config.NEWS_READ_URL(id),
          type: config.NEWS_READ_TYPE
        });
        if (config.IsApp === true) {
          if (typeof window.AndroidToast !== 'undefined') {
            window.AndroidToast.setMediaPlayer(url, '0');
          } else {
            window.webkit.messageHandlers.setMediaPlayer.postMessage({
              mediaUrl: url
            });
          }
        }
      }
    },
    created() {
      this.userId = this.$route.query.jm_id || 0;
      var self = this;
      ajaxRequest({
        url: config.VIDEO_URL(self.userId),
        type: config.VIDEO_TYPE,
        successFun(result) {
          self.videoList = result.list;
          self.loading = false;
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../../../common/stylus/mixin.styl';
  .video
    min-height: 100%
    .video-wrapper
      min-height: 1000px
      .video-info-wrapper
        position: relative
</style>
