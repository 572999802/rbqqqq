<template>
  <div class="bet">
    <div class="team-name">{{teamName}}胜</div>
    <div class="total-ugb-amount">{{totalUgb}}</div>
    <div class="total-ugb"></div>
    <div class="quiz-name">{{teamName1}}&nbspVS&nbsp{{teamName2}}&nbsp胜负竞猜</div>
    <div class="betting-wrapper">
      <div class="left-ugb"></div>
      <div class="bet-amount"><input type="number" v-model="betAmount" placeholder="0"
                                     onkeyup="this.value=this.value.replace(/[^0-9-]+/,'');"></div>
      <div class="bet-rate">X{{teamRate}}</div>
      <div class="right-ugb"></div>
      <div class="estimated-earnings">{{estimatedEarnings}}</div>
      <div class="bet-amount-text">投注金额</div>
      <div class="bet-rate-text">赔率</div>
      <div class="estimated-earnings-text">预计收益</div>
    </div>
    <div class="lessTen" v-if="isLessTen">*投注项金额不少于10UG币</div>
    <div class="bet-verify" @click="confirmBet">确认下注</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ajaxRequest} from 'common/js/common';
  import config from 'common/js/config';
  import {Toast} from 'mint-ui';

  export default {
    props: {
      teamName: {
        type: String
      },
      teamName1: {
        type: String
      },
      teamName2: {
        type: String
      },
      teamRate: {
        type: Number
      },
      teamId: {
        type: String
      },
      matchId: {
        type: String
      }
    },
    data() {
      return {
        totalUgb: '',
        betAmount: '',
        isLessTen: false
      };
    },
    methods: {
      confirmBet() {
        if (this.betAmount < 10) {
          this.isLessTen = true;
        }
        if (this.betAmount >= 10 && this.betAmount > this.totalUgb) {
          this.$emit('unEnough');
        } else if (this.betAmount >= 10 && this.betAmount <= this.totalUgb) {
          this.$emit('closeQuiz');
          this.id = this.$route.query.jm_id;
          var self = this;
          ajaxRequest({
            url: config.GET_GUESS_BET_URL,
            type: config.GET_GUESS_BET_TYPE,
            data: JSON.stringify({
              jmid: self.id,
              bottomPour: self.betAmount,
              winnerId: self.teamId,
              gameScheduleTeamId: self.matchId
            }),
            successFun() {
              Toast({
                message: '竞猜成功！',
                duration: 1500
              });
            }
          });
        }
      }
    },
    computed: {
      estimatedEarnings() {
        return parseFloat(this.betAmount * this.teamRate).toFixed(2);
      }
    },
    created() {
      this.id = this.$route.query.jm_id;
      var self = this;
      ajaxRequest({
        url: config.GET_BALANCE_URL(self.id),
        type: config.GET_BALANCE_TYPE,
        data: JSON.stringify({}),
        successFun(result) {
          self.totalUgb = result.balance;
        }
      });
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../common/stylus/mixin.styl';
  .bet
    z-index: 100
    position: fixed
    bottom: 0
    left: 0
    height: 396px
    width: 100%
    font-size: 20px
    color: #000000
    background-color: white
    .team-name
      display: inline-block
      margin: 25px 0 0 29px
      font-size: 30px
      color: #000000
    .total-ugb
      display: inline-block
      float: right
      height: 30px
      width: 30px
      margin-right: 15px
      margin-top: 27px
      background-size: 30px 30px
      bg-image('../assets/UGB')
    .total-ugb-amount
      float: right
      display: inline-block
      margin-top: 27px
      margin-right: 50px
      font-size: 24px
    .quiz-name
      margin: 17px 0 0 29px
    .betting-wrapper
      display: flex
      flex-wrap: wrap
      .left-ugb
        margin: 42.5px 0 0 65px
        width: 30px
        height: 30px
        background-size: 30px 30px
        bg-image('../assets/UGB')
      .bet-amount
        margin: 33px 0 0 22px
        border-radius: 5px
        input
          height: 49px
          width: 167px
          font-size: 24px
          line-height: 49px
          text-align: center
          background-color: rgb(236, 236, 236)
          border: none
      .bet-rate
        margin: 33px 0 0 94px
        height: 49px
        line-height: 49px
        text-align: center
        font-size: 24px
      .right-ugb
        width: 30px
        height: 30px
        margin: 42.5px 0 0 92px
        bg-image('../assets/UGB')
        background-size: 30px 30px
      .estimated-earnings
        width: 98px
        height: 49px
        margin: 33px 0 0 40px
        line-height: 49px
        text-align: center
        font-size: 24px
        overflow: hidden
        white-space: nowrap
        max-width: 100px
      .bet-amount-text
        margin: 11px 0 0 117px
        width: 167px
        text-align: center
      .bet-rate-text
        margin: 11px 0 0 94px
        width: 62px
        text-align: center
      .estimated-earnings-text
        margin: 11px 0 0 155px
        text-align: center
    .bet-verify
      display: inline-block
      position: fixed
      bottom: 0
      left: 0
      height: 100px
      width: 100%
      margin-top: 62px
      font-size: 30px
      color: #FFFFFF
      line-height: 100px
      text-align: center
      bg-image('../assets/alertBtn')
      background-size: 100% 100px
    .lessTen {
      color: red;
      height: 60px
      line-height: 60px
      text-align: center
    }
</style>
