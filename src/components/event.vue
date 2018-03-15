<template>
  <div class="event">
    <div v-for="eventItem in info">
      <div class="event-content" v-for="(event,index) in eventItem.gameScheduleTeamRetList">
        <div class="time-wrapper">
          {{eventItem.date}} {{event.scheduleName}}-{{event.groupName}} {{event.rule||'B01'}}
        </div>
        <div class="area-wrapper">
          <div class="time">
            <i class="icon-time"></i>
            <span v-if="event.matchTime">{{event.matchTime.substring(11,17)}}</span>
          </div>
          <!--matchState: 比赛状态: 0未开始 1开始 2结束-->
          <!--已结束-->
          <i class="event-icon end" v-show="event.matchState == 2"></i>
          <!--预约-->
          <i class="event-icon order" v-show="event.matchState == 0&&!event.booked"
             @click="book(event)"></i>
          <!--已预约-->
          <i class="event-icon ordered" v-show="event.matchState == 0&&event.booked"
             @click="cancelBook(event)"></i>
          <!--进行中-->
          <i class="event-icon going" v-show="event.matchState == 1"></i>
        </div>
        <div class="event-info">
          <div class="team1-wrapper">
            <div class="team-content">
              <img v-if="event.team1Logo" :src="event.team1Logo" alt="" class="team-logo">
              <img v-else src="./img/default.png" alt="" class="team-logo">
              <p class="team-name">{{event.team1Name}}</p>
              <!--放弃比赛-->
              <i class="icon-cancel give-up" v-show="event.bye==1||event.isTeam1Drop"></i>
              <!--取消资格-->
              <i class="icon-cancel disqualified" v-show="event.isTeam1Punish"></i>
            </div>
          </div>
          <div class="score-wrapper">
            {{event.team1Score}}
            <span class="score">:</span>
            {{event.team2Score}}
            <!--matchState: 比赛状态: 0未开始 1开始 2结束-->
            <!--回放-->
            <i class="score-icon playback" v-show="event.matchState == 2" @click="replay(event.id)"></i>
            <!--直播-->
            <i class="score-icon live" v-if="event.matchState == 1 && event.videoRoom"
               @click="livePlay(event.videoRoomUrl)"></i>
          </div>
          <div class="team2-wrapper">
            <div class="team-content">
              <img v-if="event.team2Logo" :src="event.team2Logo" alt="" class="team-logo">
              <img v-else src="./img/default.png" alt="" class="team-logo">
              <p class="team-name">
                {{event.team2Name}}
              </p>
              <!--放弃比赛-->
              <i class="icon-cancel give-up" style="left: 0" v-show="event.bye==1||event.isTeam2Drop"></i>
              <!--取消资格-->
              <i class="icon-cancel disqualified" v-show="event.isTeam2Punish"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ajaxRequest} from 'common/js/common';
  import config from 'common/js/config';
  import {Toast} from 'mint-ui';

  export default {
    props: {
      jmId: {
        type: String
      },
      info: {
        type: Array
      }
    },
    methods: {
      book(event) {
        ajaxRequest({
          url: config.GET_APPOINTMENT_URL,
          type: config.GET_APPOINTMENT_TYPE,
          data: JSON.stringify({
            raceId: event.id,
            jmid: this.jmId
          }),
          successFun() {
            event.booked = true;
            Toast({
              message: '预约成功！',
              duration: 1000
            });
          }
        });
      },
      cancelBook(event) {
        ajaxRequest({
          url: config.DELETE_APPOINTMENT_URL,
          type: config.DELETE_APPOINTMENT_TYPE,
          data: {
            raceId: event.id,
            jmid: this.jmId
          },
          successFun() {
            event.booked = false;
            Toast({
              message: '取消成功！',
              duration: 1000
            });
          }
        });
      },
      replay(id) {
        if (config.IsApp === true) {
          // 跳转url
          var url = 'http://' + document.location.hostname +
            '/ugaming/event.html#/battle-detail?id=' + id;
          if (typeof window.AndroidToast !== 'undefined') {
            window.AndroidToast.nextOne(url);
          } else {
            window.webkit.messageHandlers.nextOne.postMessage({
              url: url
            });
          }
        } else {
          this.$router.push({path: '/battle-detail', query: {id: id}});
        }
      },
      livePlay(url) {
        if (config.IsApp === true) {
          if (typeof window.AndroidToast !== 'undefined') {
            window.AndroidToast.setMediaPlayer(url, '1');
          } else {
            window.webkit.messageHandlers.setMediaPlayer.postMessage({
              mediaUrl: url
            });
          }
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../common/stylus/mixin.styl';
  .event
    text-align: left
    .time-wrapper
      position: relative
      line-height: 70px
      padding-left: 25px
      background: #ECECEC
      color: #9e9e9e
      font-size: 22px
    .event-content
      border-1px(rgba(0, 0, 0, 0.1))
      background: white
      .area-wrapper
        position: relative
        line-height: 80px
        text-align: center
        font-size: 20px
        color: #9E9E9E
        .time
          font-size: 24px
          color: #1D1D1D
          .icon-time
            width: 22px
            height: 22px
            margin-right: 12px
            display: inline-block
            background-size: 22px 22px
            background-repeat: no-repeat
            bg-image('../assets/clock')
        .event-icon
          position: absolute
          top: 27px
          right: 64px
          width: 78px
          height: 32px
          display: inline-block
          background-size: 78px 32px
          background-repeat: no-repeat
          &.end
            bg-image('../assets/eventEnd')
          &.order
            bg-image('../assets/eventOrder')
          &.ordered
            bg-image('../assets/eventOrdered')
          &.going
            bg-image('../assets/eventGoing')
      .event-info
        display: flex
        padding: 41px 30px 33px
        .team1-wrapper, .team2-wrapper, .score-wrapper
          flex: 1
          .team-content
            position: relative
            display: inline-block
            text-align: center
            .icon-cancel
              position: absolute
              right: -20px
              bottom: 14px
              width: 90px
              height: 90px
              display: inline-block
              background-size: 90px 90px
              background-repeat: no-repeat
              &.give-up
                right: 4px
                bg-image('../assets/giveUp')
              &.disqualified
                bg-image('../assets/disqualified')
            .team-logo
              height: 82px
              width: 82px
              border-radius: 50%
            .team-name
              width: 180px
              overflow: hidden
              word-space: nowrap
              white-space: nowrap
              text-overflow: ellipsis
              margin-top: 20px
              margin-bottom: 0
              font-size: 24px
        .score-wrapper
          text-align: center
          font-size: 40px
          font-weight: 600
          .score
            display: inline-block
            padding: 0 40px
          .score-icon
            display: inline-block
            width: 92px
            height: 40px
            margin-top: 50px
            background-size: 92px 40px
            background-repeat: no-repeat
            &.playback
              bg-image('../assets/playback')
            &.live
              bg-image('../assets/live')
        .team2-wrapper
          text-align: right
</style>
