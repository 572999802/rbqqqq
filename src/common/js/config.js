/**
 * Created by dell on 2017/6/22.
 */
var IP = document.location.hostname;
var UG_URL;
if (IP === 'app.ugaming.com.cn' || IP === 'http://api.jinmailife.com') { // 正式
  UG_URL = 'http://ugaming-web.jinmailife.com';
  // UG_URL = 'http://api.jinmailife.com/ugaming-web';
} else if (IP === 'app-test.ugaming.com.cn' || IP === 'http://api-test.jinmailife.com') { // 测试
  // UG_URL = 'http://ugaming-web-test.jinmailife.com';
  UG_URL = 'http://api-test.jinmailife.com/ugaming-web';
} else {
  // UG_URL = 'http://ugaming-web-app-dev.jinmailife.com';
  // UG_URL = 'http://ugaming-web-test.jinmailife.com';
  // UG_URL = 'http://ugaming-web.jinmailife.com';
  UG_URL = 'http://api-app-dev.jinmailife.com/ugaming-web';
}
const POST = 'POST';
// const PUT = 'PUT';
const GET = 'GET';
const DELETE = 'DELETE';
export default {
  IsApp: true,
  /* ********资讯************* */
  /* 喜欢资讯 */
  NEWS_LIKE_URL(userId, id) {
    return `${UG_URL}/gamenews/app/like/${userId}/${id}`;
  },
  NEWS_LIKE_TYPE: GET,
  /* 不喜欢资讯 */
  NEWS_UNLIKE_URL: UG_URL + '/gamenews/app/unlike',
  NEWS_UNLIKE_TYPE: GET,
  /* 阅读资讯 */
  NEWS_READ_URL(id) {
    return `${UG_URL}/gamenews/app/read/${id}`;
  },
  NEWS_READ_TYPE: GET,
  /* 获取轮播图列表 */
  LOOP_REPLAY_URL: UG_URL + '/gamenews/loopReplay',
  LOOP_REPLAY_TYPE: GET,
  /* 资讯列表 */
  NEWS_URL(userId) {
    return `${UG_URL}/gamenews/app/news/${userId}`;
  },
  /* 资讯列表上拉 */
  MORE_NEWS_URL: UG_URL + '/gamenews/app/news/pulldown',
  MORE_NEWS_TYPE: POST,
  /* 查询资讯 */
  GAME_NEWS_ID_URL(userId, id) {
    return `${UG_URL}/gamenews/app/${userId}/${id}`;
  },
  GAME_NEWS_ID_TYPE: GET,
  /* 英雄列表 */
  ALL_HERO_URL: UG_URL + '/heroe/list',
  ALL_HERO_TYPE: GET,
  /* 攻略列表 */
  STRATEGY_URL: UG_URL + '/gamenews/app/tips',
  STRATEGY_TYPE: POST,
  /* 攻略列表上拉 */
  MORE_STRATEGY_URL: UG_URL + '/gamenews/app/tips/pulldown',
  MORE_STRATEGY_TYPE: POST,
  // /* 查询游戏列表 */
  // HERO_LIST_URL(type) {
  //   return `${UG_URL}/heroe/list/type/${type}`;
  // },
  // HERO_LIST_TYPE: GET,
  /* 视频列表 */
  VIDEO_URL(id) {
    return `${UG_URL}/gamenews/app/video/${id}`;
  },
  VIDEO_TYPE: GET,
  /* 视频列表上拉 */
  MORE_VIDEO_URL: UG_URL + '/gamenews/app/video/pulldown',
  MORE_VIDEO_TYPE: POST,
  /* 账户信息 */
  USER_URL: UG_URL + '/user/ok',
  USER_TYPE: POST,
  /* ********赛事************* */
  /* 赛事对阵 */
  GET_BATTLE_URL: UG_URL + '/gamescheduleteam/app',
  GET_BATTLE_TYPE: POST,
  /* 赛事对阵下拉 */
  GET_BATTLE_DOWN_URL: UG_URL + '/gamescheduleteam/app/down',
  GET_BATTLE_DOWN_TYPE: POST,
  /* 赛事对阵上拉 */
  GET_BATTLE_UP_URL: UG_URL + '/gamescheduleteam/app/up',
  GET_BATTLE_UP_TYPE: POST,
  /* 预约比赛 */
  GET_APPOINTMENT_URL: UG_URL + '/appointment',
  GET_APPOINTMENT_TYPE: POST,
  /* 预约比赛 */
  DELETE_APPOINTMENT_URL: UG_URL + '/appointment',
  DELETE_APPOINTMENT_TYPE: DELETE,
  /* 对阵详情 */
  BATTLE_DETAIL_URL(id) {
    return `${UG_URL}/gamescheduleteam/detailInfo/${id}`;
  },
  BATTLE_DETAIL_TYPE: GET,
  /* 竞猜 */
  GET_GUESS_URL: UG_URL + '/gamescheduleteam/guess',
  GET_GUESS_TYPE: POST,
  /* 竞猜上拉 */
  GET_GUESS_UP_URL: UG_URL + '/gamescheduleteam/guess/up',
  GET_GUESS_UP_TYPE: POST,
  /* 竞猜下拉 */
  GET_GUESS_DOWN_URL: UG_URL + '/gamescheduleteam/guess/down',
  GET_GUESS_DOWN_TYPE: POST,
  /* 余额 */
  GET_BALANCE_URL(id) {
    return `${UG_URL}/balance/${id}`;
  },
  GET_BALANCE_TYPE: GET,
  /* 竞猜（下注） */
  GET_GUESS_BET_URL: UG_URL + '/guess',
  GET_GUESS_BET_TYPE: POST,
  /* 竞猜记录 */
  GET_GUESS_RECORD_URL: UG_URL + '/guess',
  GET_GUESS_RECORD_TYPE: GET,
  /* 竞猜分享 */
  GET_GUESS_SHARE_URL(id) {
    return `${UG_URL}/guess/share/${id}`;
  },
  GET_GUESS_SHARE_TYPE: GET
};
