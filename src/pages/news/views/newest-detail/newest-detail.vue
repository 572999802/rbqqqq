<template>
  <div class="newest-detail">
    <div class="loading-wrapper" v-if="loading">
      <img class="loading" src="../../../../assets/loading.gif" alt="">
    </div>
    <div v-else>
      <h1 class="title">
        {{info.title}}
      </h1>
      <div class="author-wrapper">
        <!--作者头像-->
        <img class="photo" v-lazy="info.photo" alt="作者头像">
        <span class="name">{{info.nickName}}</span>
        {{info.download}}
        <i class="icon watch"></i>
        {{info.readNum}}
      </div>
      <div class="info-wrapper" v-html="info.content">
      </div>
      <div class="like-wrapper" v-show="userId">
        <!-- 不喜欢0,喜欢1, 其他2 -->
        <div class="like-content liked" v-if="info.likes==1">
          <i class="icon liked-news"></i>
          {{info.likeNum}}
        </div>
        <div class="like-content" v-else @click="like">
          <i class="icon like-news"></i>
          喜欢
        </div>

        <div class="like-content unlike" @click="sheetVisible = true">
          <i class="icon dislike-news"></i>
          不喜欢
        </div>
      </div>
      <mt-actionsheet
        :actions="actions"
        v-model="sheetVisible">
      </mt-actionsheet>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ajaxRequest} from 'common/js/common';
  import config from 'common/js/config';
  import {Toast} from 'mint-ui';
  export default{
    data() {
      return {
        loading: true,
        userId: '',
        id: '',
        info: {},
        sheetVisible: false,
        actions: [
          {
            name: '标题夸张', method: this.report
          },
          {
            name: '内容过时', method: this.report
          },
          {
            name: '错别字', method: this.report
          },
          {
            name: '疑似抄袭', method: this.report
          }]
      };
    },
    methods: {
      report(info) {
        var self = this;
        ajaxRequest({
          url: config.NEWS_UNLIKE_URL,
          type: config.NEWS_UNLIKE_TYPE,
          data: {
            jmid: self.userId,
            tid: self.id,
            unlikeReason: info.name
          },
          successFun() {
            self.info.likes = 2;
            Toast({
              message: '我们已收到你的反馈，谢谢！',
              duration: 1500
            });
          }
        });
      },
      like() {
        var self = this;
        ajaxRequest({
          url: config.NEWS_LIKE_URL(this.userId, this.id),
          type: config.NEWS_LIKE_TYPE,
          successFun() {
            self.info.likes = 1;
            self.info.likeNum = parseInt(self.info.likeNum) + 1;
          }
        });
      }
    },
    created() {
      this.userId = this.$route.query.jm_id || 0;
      this.id = this.$route.query.id;
      var self = this;
      ajaxRequest({
        url: config.NEWS_READ_URL(this.id),
        type: config.NEWS_READ_TYPE
      });
      ajaxRequest({
        url: config.GAME_NEWS_ID_URL(this.userId, this.id),
        type: config.GAME_NEWS_ID_TYPE,
        successFun(result) {
          self.info = result.bnews;
          self.loading = false;
          if (config.IsApp === true) {
            var url = window.location.href;
            var shareUrl = url.substring(0, url.indexOf('jm_id='));
            shareUrl += 'jm_id=0';
            // 顶部，是否分享（0：不分享，1：分享），分享的URL，文章标题
            if (typeof window.AndroidToast !== 'undefined') {
              window.AndroidToast.getMidTitle('详情', '1', shareUrl, self.info.title);
            } else {
              window.webkit.messageHandlers.getMidTitle.postMessage({
                midTitle: '详情',
                isShare: '1',
                shareUrl: shareUrl,
                shareName: self.info.title
              });
            }
          }
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../../../common/stylus/mixin.styl';
  .newest-detail
    padding: 0 35px
    .title
      text-align: center
      margin: 50px auto 40px
      font-size: 36px
      font-weight: 600
    .author-wrapper
      text-align: center
      color: #9E9E9E
      font-size: 20px
      .photo
        width: 39px
        height: 39px
        border-radius: 50%
        vertical-align: middle
      .name
        margin: 0 20px 0 20px
        color: #1D1D1D
      .watch
        margin-left: 20px
    .info-wrapper
      margin-top: 8px
      font-size: 30px
      line-height: 54px
      img
        width: 100%
        margin: 57px -5px
    .like-wrapper
      margin: 165px auto
      text-align: center
      font-size: 26px
      .like-content
        display: inline-block
        width: 225px
        line-height: 66px
        border-radius: 200px
        border: 1Px solid rgba(226, 226, 226, 0.5)
        &.liked
          color: #DC6854
          border: 1Px solid #DC6854
        &.unlike
          margin-left: 90px
    .mint-actionsheet
      bottom: 20px
      width: 94%
      box-sizing: border-box
      background-color: rgba(0, 0, 0, 0)
      .mint-actionsheet-list
        width: 100%
        height: 186Px
        bg-image('../../../../assets/modalTop')
        background-size: 100% 186Px
        background-repeat: no-repeat
        .mint-actionsheet-listitem
          color: #1D1D1D
          background-color: rgba(0, 0, 0, 0)
          border-bottom: none
          &:first-child
            height: 50Px
            padding-top: 5Px
      .mint-actionsheet-button
        width: 100%
        height: 50Px
        background-color: rgba(0, 0, 0, 0)
        background-size: 100% 50Px
        background-repeat: no-repeat
        bg-image('../../../../assets/modalBottom')
        color: white
</style>
