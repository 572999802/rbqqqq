<template>
  <div class="quiz-share">
    <div class="share-content">
      <div class="match-name">2017王者荣耀UG杯</div>
      <div class="match-area">11月26日{{ shareContent.zoneName }}赛区/海选</div>
      <div class="match-result">
        <div class="team-left">
          <div class="team-icon"><img :src="shareContent.team1Logo"></div>
          <div class="team-name">{{ shareContent.team1Name }}</div>
        </div>
        <div class="match-time">
          <span class="match-score">{{ shareContent.team1Score }}&nbsp:&nbsp{{ shareContent.team2Score }}</span>
          <span class="match-type">{{ shareContent.rule }}</span>
        </div>
        <div class="team-right">
          <div class="team-icon">
            <img :src="shareContent.team2Logo">
          </div>
          <div class="team-name">{{ shareContent.team2Name }}</div>
        </div>
      </div>
      <div class="result-footer">全场比赛结果</div>
      <div class="bet-detail">
        <span>投注&nbsp{{ shareContent.ug }}</span>
        <span>赔率&nbsp{{ shareContent.odds }}</span>
        <span>我猜&nbsp{{ shareContent.winnerNameGuess }}</span>
        <span>结果&nbsp{{ shareContent.winnerNameGuess }}</span>
      </div>
      <div class="user-avatar"><img :src="shareContent.photo"></div>
      <div class="user-name">{{ shareContent.name }}</div>
      <div class="ugb-get">+&nbsp{{ shareContent.reward }}.00&nbspUG币</div>
      <div class="win-prize">中奖</div>
    </div>
    <div class="join-bet" @click="joinBet">
      我也要猜
    </div>
  </div>
</template>

<script>
  import {ajaxRequest} from 'common/js/common';
  import config from 'common/js/config';

  export default {
    name: 'quiz-share',
    data() {
      return {
        shareContent: {}
      };
    },
    created() {
      this.id = this.$route.query.jm_id;
      var self = this;
      ajaxRequest({
        url: config.GET_GUESS_RECORD_URL,
        type: config.GET_GUESS_RECORD_TYPE,
        data: {
          jmid: self.id,
          status: 30
        },
        successFun() {
          var guessId = self.$route.query.guessId;
          ajaxRequest({
            url: config.GET_GUESS_SHARE_URL(guessId),
            type: config.GET_GUESS_SHARE_TYPE,
            successFun(res) {
              self.shareContent = res.list;
            }
          });
        }
      });
    },
    methods: {
      joinBet() {
        window.location.href = 'https://itunes.apple.com/cn/app/u-gaming/id1291472338?mt=8';
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../../../common/stylus/mixin.styl';
  .share-content
    margin-top: 65px
    margin-left: 5%
    width: 90%
    text-align: center
    padding-top: 35px
    padding-bottom: 25px
    color: white
    bg-image('../../../../assets/background')
    background-size 100% 100%
    .match-name
      margin-top: 40px
      font-size: 30px
    .match-area
      margin-top: 27px
      font-size: 24px
    .match-result
      display: flex
      .team-left
        width: 33%
        .team-icon
          width: 82px
          height: 82px
          margin: 0 auto
          margin-top: 24px
          border-radius: 82px
          img
            width: 82px
            height: 82px
            border-radius: 82px
        .team-name
          margin: 0 auto
          margin-top: 20px
          font-size: 30px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          max-width: 400px
      .team-right
        width: 33%
        text-align: center
        .team-icon
          margin: 0 auto
          margin-top: 24px
          width: 82px
          height: 82px
          border-radius: 82px
          img
            width: 82px
            height: 82px
            border-radius: 82px
        .team-name
          margin-top: 20px
          font-size: 30px
      .match-time
        width: 33%
        text-align: center
        .match-score
          display: block
          margin-top: 33px
          font-size: 38px
        .match-type
          margin-top: 34px
          font-size: 30px
    .result-footer
      margin-top: 37px
      font-size: 30px
    .bet-detail
      margin-top: 24px
      font-size: 22px
      span
        margin: 0 0 24px 24px
    .user-avatar
      margin 0 auto
      margin-top: 30px
      height: 158px
      width: 158px
      border-radius: 158px
      img
        width: 158px
        height: 158px
        border-radius: 158px
    .user-name
      margin-top: 8px
      font-size: 24px
    .ugb-get
      margin-top: 36px
      font-size: 60px
    .win-prize
      margin-top: 15px
      margin-bottom: 50px
      text-align: center
      width: 100%
      font-size: 48px

  .join-bet
    margin-top: 83px
    margin-left: 5%
    line-height: 100px
    height: 100px
    width: 90%
    text-align: center
    color: white
    font-size: 30px
    bg-image('../../../../assets/alertBtn')
    background-size: 100% 100px
</style>
