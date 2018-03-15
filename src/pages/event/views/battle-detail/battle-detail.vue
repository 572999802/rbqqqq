<template>
  <div class="battle-detail">
    <div class="title-wrapper">
      <p class="time">
        {{info.matchTime}}
      </p>
      <div class="team-wrapper">
        <div class="team-content">
          <img v-if="info.team1Logo" :src="info.team1Logo" class="logo" alt="">
          <img v-else src="./img/default.png" class="logo" alt="">
          <p class="name">
            {{info.team1Name}}
          </p>
        </div>
        <div class="score-content">
          {{info.team1Score}}
          <span class="score">:</span>
          {{info.team2Score}}
        </div>
        <div class="team-content">
          <img v-if="info.team2Logo" :src="info.team2Logo" class="logo" alt="">
          <img v-else src="./img/default.png" class="logo" alt="">
          <p class="name">
            {{info.team2Name}}
          </p>
        </div>
      </div>
    </div>
    <!--回放-->
    <div class="replay-wrapper" v-if="videoShow">
      <div class="title">
        <i class="battle-icon"></i>
        回放
      </div>
      <div class="replay-content">
        <div class="video" v-for="item in info.videoList" v-if="item.video">
          <img :src="item.videoImg" class="photo" alt="" @click="watchVideo(item.video)">
          <i class="icon-play" @click="watchVideo(item.video)"></i>
          <p class="name">
            {{info.matchName}}{{info.zoneName}}区{{info.team1Name}} VS {{info.team2Name}}
          </p>
        </div>
      </div>
    </div>
    <!--赛况-->
    <div class="battle-wrapper">
      <div class="title">
        <i class="battle-icon"></i>
        赛况
      </div>
      <div class="battle-content" v-for="(item,index) in info.videoList">
        <div class="title" style="text-align:center">
          第{{numList[index]}}场
        </div>
        <p class="small-title">装备对比</p>
        <img class="photo" :src="item.equipPic" alt="">
        <p class="small-title">数据对比</p>
        <img class="photo" :src="item.attackPic" alt="">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ajaxRequest} from 'common/js/common';
  import config from 'common/js/config';
  export default{
    data() {
      return {
        numList: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
        id: '',
        info: {},
        videoShow: false
      };
    },
    methods: {
      watchVideo(url) {
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
      document.getElementsByTagName('body')[0].style.backgroundColor = 'white';
      if (config.IsApp === true) {
        // 顶部，是否分享（0：不分享，1：分享），分享的URL，文章标题
        if (typeof window.AndroidToast !== 'undefined') {
          window.AndroidToast.getMidTitle('赛事回放', '0', '', '');
        } else {
          window.webkit.messageHandlers.getMidTitle.postMessage({
            midTitle: '赛事回放',
            isShare: '0',
            shareUrl: '',
            shareName: ''
          });
        }
      }
      var self = this;
      this.id = this.$route.query.id;
      ajaxRequest({
        url: config.BATTLE_DETAIL_URL(this.id),
        type: config.BATTLE_DETAIL_TYPE,
        successFun(result) {
          self.info = result.gameScheduleTeam;
          for (var i = 0; i < self.info.videoList.length; i++) {
            if (self.info.videoList[i].video) {
              self.videoShow = true;
              break;
            }
          }
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../../../common/stylus/mixin.styl';
  .battle-detail
    .title
      line-height: 86px
      font-size: 30px
    .battle-icon
      display: inline-block
      width: 16px
      height: 30px
      margin: 10px 16px 0 34px
      vertical-align: baseline
      background-size: 16px 30px
      background-repeat: no-repeat
      bg-image('../../../../assets/battleIcon')
    .title-wrapper
      width: 100%
      height: 400px
      box-sizing: border-box
      background-size: 100% 400px
      background-repeat: no-repeat
      bg-image('../../../../assets/battleBack')
      padding: 10px 78px 0
      color: white
      .time
        text-align: center
        line-height: 70px
        font-size: 28px
      .team-wrapper
        display: flex
        .team-content
          width: 180px
          flex: 0 0 180px
          text-align: center
          .logo
            width: 150px
            height: 150px
            border-radius: 50%
          .name
            width: 180px
            overflow: hidden
            word-space: nowrap
            white-space: nowrap
            text-overflow: ellipsis
            line-height: 70px
            margin: 0 auto
            font-size: 30px
        .score-content
          flex: 1
          line-height: 150px
          text-align: center
          font-size: 64px
          .score
            display: inline-block
            padding: 0 10px
    .replay-wrapper
      .replay-content
        height: 270px
        word-space: nowrap
        white-space: nowrap
        overflow-x: scroll
        overflow-y: hidden
        padding: 0 0 34px 48px
        border-bottom: 1px solid rgba(0, 0, 0, 0.1)
        .video
          display: inline-block
          width: 374px
          height: 210px
          margin-right: 14px
          position: relative
          .photo
            width: 374px
            height: 210px
          .name
            margin: 0
            font-size: 28px
            overflow: hidden
            word-space: nowrap
            white-space: nowrap
            text-overflow: ellipsis

    .battle-wrapper
      .battle-content
        padding: 10px 40px
        .small-title
          line-height: 70px
          color: #9E9E9E
          font-size: 28px
        .photo
          width: 100%
</style>
