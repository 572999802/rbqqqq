<template>
  <div class="index">
    <div id="index">
      <div class="loading-wrapper" v-if="loading">
        <img class="loading" src="../../../../assets/loading.gif" alt="">
      </div>

      <div v-else>
        <div class="title-wrapper">
          <div class="text-wrapper">
            <div style="text-align: center">
              <i class="icon-go top" v-show="infoShow" @click="infoShow = false"></i>
              <i class="icon-go bottom" v-show="!infoShow" @click="infoShow = true"></i>
            </div>

            <div class="title-wrapper">
              <img src="../../../../assets/eventImageShort.png" alt="" width="100%">
            </div>

            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :autoFill="true"
                         @top-status-change="handleTopChange" ref="loadmore">
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
              <div class="quiz-list-wrapper">
                <div class="quiz-list" v-for='(item,index1) in quizList'>
                  <div v-for="(race,index2) in item.gameScheduleTeamRetList">
                    <div class="time-wrapper">
                      {{ item.date }} {{ race.zoneName }}赛区/{{ race.scheduleName }} {{ race.rule }}
                    </div>
                    <div class="quiz-wrapper">
                      <div class="team-left">
                        <div class="team-icon"><img :src="race.team1Logo"></div>
                        <div class="team-name" v-model="team1">{{ race.team1Name }}</div>
                      </div>
                      <div class="match-time">
                        <i class="icon-time"></i>
                        <span v-if="race.matchTime"> {{race.matchTime.substring(11, 17)}}</span>
                      </div>
                      <div class="team-right">
                        <div class="team-icon"><img :src="race.team2Logo"></div>
                        <div class="team-name" v-model="team2">{{ race.team2Name }}</div>
                      </div>

                    </div>
                    <div class="small-title">全场比赛结果（开赛5分钟前截止）</div>
                    <div class="quiz-button-wrapper">
                      <div class="quiz-button-content" @click="openQuizLeft(index1, index2)">
                        <button class="quiz-button">
                          <span class="team-name">{{ race.team1Name }}</span>
                          <span class="team-rate">{{ race.team1Odds }}</span>
                        </button>
                      </div>
                      <div class="quiz-button-content" @click="openQuizRight(index1, index2)">
                        <button class="quiz-button">
                          <span class="team-name">{{ race.team2Name }}</span>
                          <span class="team-rate">{{ race.team2Odds }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="no-more" v-show="hasBottomLoaded">
                已加载完毕~
              </div>
            </mt-loadmore>
          </div>
        </div>
      </div>

      <bet v-if="isQuiz" :matchId="matchId" :teamId="teamId" :teamName="teamName" :teamName1="teamName1"
           :teamName2="teamName2" :teamRate="teamRate"
           @closeQuiz="closeQuiz" @unEnough="openUnEnough"></bet>

      <div class="black-area" v-if="isQuiz" @click="closeQuiz" :style="{ height: blackheight + 'px'}"></div>
      <div class="insufficient-balance-wrapper" v-if="isUnEnough">
        <div class="insufficient-balance">
          <div class="title">余额不足</div>
          <div class="content">当前余额不足，充值才可以继续竞<br>猜，是否去充值
          </div>
          <div class="choose">
            <div class="cancel" @click="cancelBalance">取消</div>
            <div class="confirm" @click="confirmBalance">确定</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import {ajaxRequest} from 'common/js/common';
  import config from 'common/js/config';
  import bet from 'components/bet';
  import {Toast} from 'mint-ui';

  export default {
    data() {
      return {
        matchId: '',
        teamId: '',
        teamRate: '',
        teamName: '',
        team1: '',
        team2: '',
        teamName1: '',
        teamName2: '',
        topStatus: '',
        hasBottomLoaded: false,
        active: '',
        infoShow: false,
        loading: false,
        isQuiz: false,
        isUnEnough: false,
        quizList: []
      };
    },
    components: {
      bet
    },
    computed: {
      blackheight() {
        return document.getElementById('index').offsetHeight;
      }
    },
    methods: {
      cancelBalance() {
        this.isUnEnough = false;
        this.isQuiz = false;
      },
      confirmBalance() {
        this.isUnEnough = false;
        if (typeof window.AndroidToast !== 'undefined') {
          window.AndroidToast.gotoMyPurse();
        } else {
          window.webkit.messageHandlers.gotoMyPurse.postMessage({});
        }
      },
      openUnEnough() {
        this.isUnEnough = true;
      },
      loadTop() {
        var self = this;
        setTimeout(() => {
          ajaxRequest({
            url: config.GET_GUESS_URL,
            type: config.GET_GUESS_TYPE,
            // url: config.GET_GUESS_DOWN_URL,
            // type: config.GET_GUESS_DOWN_TYPE,
            data: JSON.stringify({
              jmid: 1
              // zoneId: self.active
            }),
            successFun(result) {
              self.quizList = result.list;
              self.topStatus = 'finish';
              setTimeout(() => {
                self.$refs.loadmore.onTopLoaded();
              }, 500);
            }
          });
        }, 1000);
      },
      loadBottom() {
        var self = this;
        setTimeout(() => {
          self.$refs.loadmore.onBottomLoaded();
          self.hasBottomLoaded = true;
          setTimeout(() => {
            self.hasBottomLoaded = false;
          }, 1000);
          var eventInfo = this.quizList[(this.quizList.length - 1)].gameScheduleTeamRetList;
          eventInfo = eventInfo[(eventInfo.length - 1)];
          ajaxRequest({
            url: config.GET_GUESS_UP_URL,
            type: config.GET_GUESS_UP_TYPE,
            data: JSON.stringify({
              jmid: this.id,
              zoneId: this.id,
              matchTime: eventInfo.matchTime,
              raceId: eventInfo.Id
            }),
            successFun(result) {
              self.quizList = self.quizList.concat(result.list);
              self.$refs.loadmore.onBottomLoaded();
              self.hasBottomLoaded = true;
              setTimeout(() => {
                self.hasBottomLoaded = false;
              }, 1000);
            }
          });
        }, 1000);
      },
      handleTopChange(state) {
        this.topStatus = state;
      },
      openQuizLeft(index1, index2) {
        var time = this.quizList[index1].gameScheduleTeamRetList[index2].matchTime;
        time = time.replace(/-/g, '/');
        var nowTime = new Date();
        var min = nowTime.getMinutes();
        nowTime.setMinutes(min + 5);
        var matchTime = new Date(Date.parse(time));
        if (nowTime > matchTime) {
          Toast({
            message: '该比赛已截止竞猜！',
            duration: 1500
          });
        } else {
          this.isQuiz = true;
          this.matchId = this.quizList[index1].gameScheduleTeamRetList[index2].id;
          this.teamId = this.quizList[index1].gameScheduleTeamRetList[index2].team1Id;
          this.teamName = this.quizList[index1].gameScheduleTeamRetList[index2].team1Name;
          this.teamRate = this.quizList[index1].gameScheduleTeamRetList[index2].team1Odds;
          this.teamName1 = this.quizList[index1].gameScheduleTeamRetList[index2].team1Name;
          this.teamName2 = this.quizList[index1].gameScheduleTeamRetList[index2].team2Name;
        }
      },
      openQuizRight(index1, index2) {
        var time = this.quizList[index1].gameScheduleTeamRetList[index2].matchTime;
        time = time.replace(/-/g, '/');
        var nowTime = new Date();
        var min = nowTime.getMinutes();
        nowTime.setMinutes(min + 5);
        console.log(nowTime);
        var matchTime = new Date(Date.parse(time));
        if (nowTime > matchTime) {
          Toast({
            message: '该比赛已截止竞猜！',
            duration: 1500
          });
        } else {
          this.isQuiz = true;
          this.matchId = this.quizList[index1].gameScheduleTeamRetList[index2].id;
          this.teamId = this.quizList[index1].gameScheduleTeamRetList[index2].team2Id;
          this.teamName = this.quizList[index1].gameScheduleTeamRetList[index2].team2Name;
          this.teamRate = this.quizList[index1].gameScheduleTeamRetList[index2].team2Odds;
          this.teamName1 = this.quizList[index1].gameScheduleTeamRetList[index2].team1Name;
          this.teamName2 = this.quizList[index1].gameScheduleTeamRetList[index2].team2Name;
        }
      },
      closeQuiz() {
        this.isQuiz = false;
      }
    },
    created() {
      this.id = this.$route.query.jm_id;
      var self = this;
      ajaxRequest({
        url: config.GET_GUESS_URL,
        type: config.GET_GUESS_TYPE,
        data: JSON.stringify({
          jmid: self.id
        }),
        successFun(result) {
          self.state = result.state;
          self.quizList = result.list;
          self.quizList[0].loading = false;
          self.loading = false;
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../../../common/stylus/mixin.styl';
  .index
    .quiz-list-wrapper
      min-height: 750px
    .title-wrapper
      position: relative
      font-size: 0
    .time-wrapper
      height: 50px
      padding-left: 30px
      font-size: 22px
      color: #9E9E9E
      line-height: 50px
      background-color: rgb(236, 236, 236)
    .quiz-wrapper
      display: flex
      height: 150px
      width: 100%
      .team-left
        width: 33%
        text-align: center
        .team-icon
          width: 82px
          height: 82px
          margin: 0 auto
          margin-top: 24px
          img
            width: 82px
            height: 82px
            border-radius: 82px
        .team-name
          margin-top: 20px
          font-size: 24px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          max-width: 100%
      .team-right
        width: 33%
        text-align: center
        .team-icon
          width: 82px
          height: 82px
          margin: 0 auto
          margin-top: 24px
          img
            width: 82px
            height: 82px
            border-radius: 82px
        .team-name
          margin-top: 20px
          font-size: 24px
          text-overflow: ellipsis
          white-space: nowrap
          max-width: 100%
      .match-time
        padding-top: 50px
        width: 33%
        text-align: center
        .icon-time
          display: inline-block
          width: 34px
          height: 34px
          background-size: 34px 34px
          background-repeat: no-repeat
          bg-image('../../../../assets/clock')
        span
          margin-left: 19px
          font-size: 38px
    .quiz-button-wrapper
      display: flex
      margin-top: 0px
      .quiz-button-content
        margin-top: 24px
        margin-bottom: 24px
        flex: 1
        text-align: center
        .quiz-button
          height: 79px
          width: 314px
          text-align: center
          background: rgb(220, 103, 83)
          border: 1px solid rgb(220, 103, 83)
          border-radius: 4px
          .team-name
            display: block
            font-size: 24px
            color: white
            text-overflow: ellipsis
            white-space: nowrap
            max-width: 100%
          .team-rate
            display: block
            margin-top: 1px
            font-size: 20px
            color: white
    .small-title
      font-size: 20px
      color: #9E9E9E
      text-align: center
    .black-area
      z-index: 50
      position: absolute
      top: 0
      left: 0
      width: 100%
      min-height: 100%
      background-color: black
      opacity: 0.5
    .insufficient-balance-wrapper
      position: absolute
      z-index: 2000
      width: 100%
      height: 100%
      left: 0
      bottom: 0
      .insufficient-balance
        position: absolute
        left: 15%
        top: 35%
        width: 70%
        height: 25%
        background: white
        border-radius 40px
        text-align: center
        .title
          height: 85px
          line-height: 85px
          font-weight bold;
          font-size: 32px
        .content
          height: 120px
          font-size: 28px
          padding-top: 30px
        .choose
          position: absolute
          bottom: 0
          width: 100%
          height: 85px
          display: flex
          font-size: 32px
          color: dodgerblue
          font-weight: bold
          margin-top: 10px
          line-height: 85px
          border-top: 1Px solid rgb(243, 242, 242)
          .confirm
            flex: 0.5
          .cancel
            flex: 0.5
            border-right: 1Px solid rgb(243, 242, 242)
</style>
