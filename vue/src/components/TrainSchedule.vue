<template>
  電車検索<br>
  出発駅と到着駅を選択してください。<br>

  <v-select
    label="出発"
    :items="st.map((obj) => obj.name)"
    v-model="start_st"
    >
  </v-select>
  <v-select
    label="到着"
    :items="st.map((obj) => obj.name).filter(x => x !== start_st)"
    v-model="end_st">
  </v-select>

  出発時刻選択<br>
  出発：{{ now_time }}<br>
  <v-btn @click="localtimebtn_clicked" class="localtimebtn">現在時刻</v-btn>
  <Datepicker timePicker v-model="date"></Datepicker>

  <v-btn class="search" @click="clicked(start_st,end_st)">検索</v-btn><br>

  <div v-if="search_clicked" class="st_main">
    <div class="dt">
      <p class="time">{{ recommend_info[0][0].time }}</p>
      <p class="updown">発</p>
      <p class="name">{{ recommend_info[0][0].name }}</p>
    </div>
  </div>


  <div v-if="search_clicked">
    <v-btn @click="more = !more">
        <v-icon v-if="more">mdi-arrow-expand-vertical</v-icon>
        <v-icon v-else>mdi-arrow-collapse-vertical</v-icon>
    </v-btn><br>
  </div>

  <ul class="flow" v-if="more">
    <li v-for="(time, index) in recommend_info" :key="time">    
        <div v-if="1 <= index && index < recommend_info.length-1">
          <!-- {{ index }} {{ time[0].name }} | {{ time[0].time }} -->

              <span class="icon">{{ time[0].time }}</span>
              <dl>
                <dt>{{ time[0].name }}</dt>
              </dl>

            </div>
      </li>
  </ul>


  <div v-if="search_clicked" class="st_main">
    <div class="dt">
      <p class="time">{{ recommend_info[recommend_info.length-1][0].time }}</p>
      <p class="updown">着</p>
      <p class="name">{{ recommend_info[recommend_info.length-1][0].name }}</p>
    </div>
  </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
export default {
  components:{ Datepicker },
  name: "TrainSchedule",
  data() {
    return {
      date: null,
      map: null,
      st: [{no:0, name:'羽後本荘駅'},
           {no:1, name:'薬師堂駅'},
           {no:2, name:'子吉駅'},
           {no:3, name:'鮎川駅'},
           {no:4, name:'黒沢駅'},
           {no:5, name:'曲沢駅'},
           {no:6, name:'前郷駅'},
           {no:7, name:'久保田駅'},
           {no:8, name:'西滝沢駅'},
           {no:9, name:'吉沢駅'},
           {no:10, name:'川辺駅'},
           {no:11, name:'矢島駅'}],
        start_st: '',
        end_st: '',
        up_dia: [['05:40', '05:44', '05:49', '05:52', '05:55', '06:00', '06:03', '06:05', '06:08', '06:13', '06:17', '06:20'],
                  ['06:49', '06:53', '06:58', '07:01', '07:04', '07:11', '07:14', '07:16', '07:19', '07:24', '07:28', '07:31'],
                  ['07:46', '07:50', '07:55', '07:58', '08:01', '08:07', '08:10', '08:12', '08:15', '08:20', '08:24', '08:27'],
                  ['09:40', '09:44', '09:49', '09:52', '09:55', '10:01', '10:04', '10:06', '10:09', '10:14', '10:18', '10:21'],
                  ['10:43', '10:47', '10:52', '10:55', '10:58', '11:04', '11:07', '11:09', '11:12', '11:17', '11:21', '11:24'],
                  ['11:55', '11:59', '12:04', '12:07', '12:10', '12:16', '12:19', '12:21', '12:24', '12:29', '12:33', '12:36'],
                  ['13:50', '13:54', '13:59', '14:02', '14:05', '14:11', '14:14', '14:16', '14:19', '14:24', '14:28', '14:31'],
                  ['14:45', '14:49', '14:54', '14:57', '15:00', '15:06', '15:09', '15:11', '15:14', '15:19', '15:23', '15:26'],
                  ['15:45', '15:49', '15:54', '15:57', '16:00', '16:06', '16:09', '16:11', '16:14', '16:19', '16:23', '16:26'],
                  ['16:45', '16:49', '16:54', '16:57', '17:00', '17:06', '17:09', '17:11', '17:14', '17:19', '17:23', '17:26'],
                  ['17:55', '17:59', '18:04', '18:07', '18:10', '18:16', '18:19', '18:21', '18:24', '18:29', '18:33', '18:36'],
                  ['19:00', '19:04', '19:09', '19:12', '19:15', '19:21', '19:24', '19:26', '19:29', '19:34', '19:38', '19:41'],
                  ['20:20', '20:24', '20:29', '20:32', '20:35', '20:41', '20:44', '20:46', '20:49', '20:54', '20:58', '21:01']],
        down_dia: [['06:50', '06:53', '06:57', '07:02', '07:05', '07:07', '07:11', '07:14', '07:18', '07:21', '07:25', '07:29'],
                    ['07:46', '07:49', '07:53', '07:58', '08:01', '08:03', '08:07', '08:10', '08:14', '08:17', '08:21', '08:25'],
                    ['08:40', '08:43', '08:47', '08:52', '08:55', '08:57', '09:01', '09:04', '09:08', '09:11', '09:15', '09:19'],
                    ['10:43', '10:46', '10:50', '10:55', '10:58', '11:00', '11:04', '11:07', '11:11', '11:14', '11:18', '11:22'],
                    ['11:55', '11:58', '12:02', '12:07', '12:10', '12:12', '12:16', '12:19', '12:23', '12:26', '12:30', '12:34'],
                    ['13:00', '13:03', '13:07', '13:12', '13:15', '13:17', '13:21', '13:24', '13:28', '13:31', '13:35', '13:39'],
                    ['14:45', '14:48', '14:52', '14:57', '15:00', '15:02', '15:06', '15:09', '15:13', '15:16', '15:20', '15:24'],
                    ['15:45', '15:48', '15:52', '15:57', '16:00', '16:02', '16:06', '16:09', '16:13', '16:16', '16:20', '16:24'],
                    ['16:45', '16:48', '16:52', '16:57', '17:00', '17:02', '17:06', '17:09', '17:13', '17:16', '17:20', '17:24'],
                    ['17:55', '17:58', '18:02', '18:07', '18:10', '18:12', '18:16', '18:19', '18:23', '18:26', '18:30', '18:34'],
                    ['19:00', '19:03', '19:07', '19:12', '19:15', '19:17', '19:21', '19:24', '19:28', '19:31', '19:35', '19:39'],
                    ['20:20', '20:23', '20:27', '20:32', '20:35', '20:37', '20:41', '20:44', '20:48', '20:51', '20:55', '20:59'],
                    ['21:35', '21:38', '21:42', '21:47', '21:50', '21:52', '21:56', '21:59', '22:03', '22:06', '22:10', '22:14']],
        now_time: '00:00',
        recommend_info: [],
        search_clicked: false,
        more: false,
    };
  },
  mounted() {
    let currentdate = new Date()
    //this.now_time = date()
    this.now_time = this.zeroPadding(currentdate.getHours(), 2) + ':' + this.zeroPadding(currentdate.getMinutes(), 2)// + ':' + currentdate.getSeconds()
    //this.now_time = '12:30'
  },
  methods: {
    localtimebtn_clicked: function(){
      this.date = null
      let currentdate = new Date()
      this.now_time = this.zeroPadding(currentdate.getHours(), 2) + ':' + this.zeroPadding(currentdate.getMinutes(), 2)// + ':' + currentdate.getSeconds()
    },
    clicked: function(start_st, end_st){
      //console.log(start_st, end_st)
      this.check_up_down(start_st, end_st)
      this.search_clicked = true
    },
    //test: function(){
    //  console.log(this.date)
    //},
    check_up_down: function(start_st, end_st){
      var start_num = this.st.find(e => e.name === start_st).no
      var end_num = this.st.find(e => e.name === end_st).no
      
      if (start_num < end_num){
        //下り
        var down_start_time = this.down_dia.map(item => item[start_num])
        this.search_train(down_start_time, 'down', start_num, end_num)
      }else{
        //上り
        var up_start_time = this.up_dia.map(item => item[11 - start_num])
        this.search_train(up_start_time, 'up', start_num, end_num)
      }
    },
    search_train: function(start_time, up_down, start_num, end_num){
      console.log(this.date)
      // nullでなかったら＝選択されたら
      if  (this.date != null){
        this.now_time = this.zeroPadding(this.date.hours, 2) + ':' +this.zeroPadding(this.date.minutes, 2)
      }
      for (const [index, i] of start_time.entries()){
          if (this.str2date(this.now_time) < this.str2date(i)){
            if (up_down==='down'){
              console.log(start_num, end_num)
              let rec_sts = this.st.slice(start_num, end_num+1)
              let rec_times = this.down_dia[index].slice(start_num, end_num+1)
              this.concat(rec_sts, rec_times)

            }else{
              console.log('up')
              console.log(start_num, end_num)
              let rec_sts = this.st.slice(end_num, start_num+1).reverse()
              let rec_times = this.up_dia[index].slice(end_num, start_num+1)
              console.log(rec_sts, rec_times)
              this.concat(rec_sts, rec_times)
            }
            break;
          }
        }
    },
    concat: function(rec_sts, rec_times){
      this.recommend_info = rec_sts.map(function(e, i) {
                e['time'] = rec_times[i] 
                return [e];
              });
      //console.log(this.recommend_info)
    },
    str2date: function(str_date) {
      let date = new Date();
      let hour_mins = str_date.split(":");
      let hour = hour_mins[0];
      let mins = hour_mins[1];
      date.setHours(Number(hour));
      date.setMinutes(Number(mins));
      return date
    },
    zeroPadding: function(num, len) {
      let zero = '';
      //0の文字列を作成
      for(var i = 0; i < len; i++) {
        zero += '0';
      }
      // zeroの文字列と、数字を結合し、後ろ２文字を返す
      return (zero + num).slice(-len);
    },
  },
};
</script>


<style>
.v-select {
  width: 100%;
  background-color: white;
}
.v-time {
  width:50%;
  background-color: white;
}
.st_main {
  width: auto;
  height: 50px;
  background-color: #eee;
  text-align: center;
  vertical-align: middle;
  margin: 5% 5% 5% 5%; /* 上右下左 */
}
.dt{
  line-height: 50px;
}
.time {
  text-align: left;  /* 文章を左寄せする(※) */
  float: left;     /* 左端に寄せて、後続を右側へ回り込ませる */
  padding-left: 10%;
}
.updown {
  text-align: center;
  float: left;
  padding-left: 10%;
}
.name {
  text-align: right;
  padding-right: 15%;
}

/* add */
/* * {
	box-sizing: border-box;
}
body {
	min-height: 100vh;
	margin: 0;
	padding: 0;
	display: flex;
	justify-content: center;
	align-items: center;
} */
ul {
	padding: 0;
}
li {
	list-style-type: none;
}
dd {
	margin-left: 0;
}

.flow {
	padding-left: 120px;
	position: relative;
}
.flow::before {
	content: "";
	width: 15px;
	height: 100%;
	background: #eee;
	margin-left: -8px;
	display: block;
	position: absolute;
	top: 0;
	left: 120px;
}
.flow > li {
	position: relative;
}
.flow > li:not(:last-child) {
	margin-bottom: 1vh;
}
.flow > li .icon {
	/* font-size: 12px; */
	padding: 4px 25%;
	display: block;
	position: absolute;
	top: 0;
	left: -120px;
	z-index: 100;
}

.flow > li dl {
	padding-left: 70px;
	position: relative;
}
.flow > li dl::before,
.flow > li dl::after {
	content: "";
	display: block;
	position: absolute;
	top: 15px;
}
.flow > li dl::before {
	width: 7px;
	height: 7px;
	margin-top: -3px;
	background: #6b90db;
	border-radius: 50%;
	left: -4px;
}
.flow > li dl::after {
	width: 120px;
	border-bottom: 1px dashed #999;
	position: absolute;
	left: 5px;
}
.flow > li dl dt {
	/* font-size: 20px; */
	/* font-weight: 600; */
	color: rgb(0, 0, 0);
	margin-bottom: 1vh;
  padding: 4px 3%;
}
.search {
  margin: 5px;
}
.localtimebtn {
  margin: 5px;
}
</style>