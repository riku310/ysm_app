<template>
  <SlideShow v-if='slideshow'/>
  <v-btn :loading="loading" :disabled="loading" large fab dark class="mx-2" elevation="2" id="vb-1" v-on:click="start_click" >
    <!-- <v-icon>mdi-cart</v-icon> -->
    ルート作成スタート
  </v-btn>
  <br>

  <br>

  <v-btn :loading="loading" :disabled="loading" large fab dark class="mx-2" elevation="2" id="vb-1" v-on:click="reset" >
    リセット
  </v-btn>
  <br>
  
  <!-- クリックされたらレンダリングされる -->
  <!-- 1 -->
  <div v-if="q1">
      帰りの電車を選択してください．<br>
      現在時刻：{{ time }}
      <div v-for="(q) in q1_list" :key="q.choice">
          <v-btn id="qbtn" elevation="2" v-on:click="qbtn_click(q.dia)">{{ q.time }}</v-btn><br>
      </div>
  </div>

  <!-- 2 -->
  <div v-if="q2">
      どのようなことに興味がありますか？
      <div v-for="(q, index) in q2_list" :key="q.choice">
          <v-btn id="qbtn" elevation="2" v-on:click="qbtn_last_click(index)">{{ q.choice }}</v-btn><br>
      </div>
  </div>

  <div v-if="last">
    おすすめのコースは<br>
    周遊可能時間：{{ diffMin }}分<br>
    帰りの電車：{{ selected_train.time }}<br>
    <div v-if="roulette">
      <Roulette v-bind:props_data="rouletteData" @roulettestop="recommend=$event" @roulettestf="roulette=$event"/>
    </div>
    <div v-else-if="!roulette">
      <div v-if="clicktf">
        <v-btn  v-on:click="this.clicktf =! this.clicktf" id="vb-1">マップを表示</v-btn>
      </div>
      <div v-else-if="!distance.length">
        <v-progress-circular
        indeterminate
        color="red"
        ></v-progress-circular>
      </div>
      <div v-else v-on="this.clicktf =! this.clicktf && displaymap()">
        <v-btn v-on:click="displaymap()" id="vb-1">マップを非表示</v-btn>
      </div>
      <RouteMap v-bind:props_data="recommend" v-bind:mappos="mappos" @route="distance=$event"/>

      <div v-for="(data, index) in recommend" :key="data">
        <div class='rec_spot'>
          <div v-if="index==0">
            <span class="rec_spot_title">START 矢島駅</span>
            <h1>START 矢島駅</h1>
          </div>
          <div v-else-if="index==Object.keys(recommend).length-1">
            <span class="rec_spot_title">END 矢島駅</span>
            <h1>END 矢島駅</h1>
          </div>
          <div v-else>
            <div v-if="distance && distance.length">
              <span class="rec_spot_title">{{ index }}: {{distance[index-1].dis}}/{{distance[distance.length-1].dis}}m 
                {{distance[index-1].time}}/{{distance[distance.length-1].time}}分</span>
            </div>
            <div v-else>
              <span class="rec_spot_title">{{ index }}</span>
            </div>
            <h1>{{ index }} | {{ data.name }}</h1><br>
            <v-img :src="'/img/spot/'+ data.id +'/' + data.id +'.jpg'" height="125"></v-img><br>
            {{ data.detail }}<br>
            <a :href="'/spot/ids/'+data.id">詳しくはこちら</a><br>
          </div>
        </div>
        <div v-if='index!=Object.keys(recommend).length-1'>
          <v-icon size="80">mdi-arrow-down-bold</v-icon>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
import Roulette from '../components/CanvasRoulette.vue';
import SlideShow from '../components/SlideShow.vue';
import RouteMap from '../components/RouteMap.vue';
import axios from 'axios';

export default {
  components: {
    Roulette,
    SlideShow,
    RouteMap,
  },
  data() {
    return {
      q1: false,
      q2: false,
      q1_list: [],
      q2_list: [],
      last: false,
      time: "00:00",
      date: "00",
      loading: false,
      dia_dict: [
        {dia: 1, time: '05:40'}, 
        {dia: 2, time: '06:49'}, 
        {dia: 3, time: '07:46'}, 
        {dia: 4, time: '09:40'}, 
        {dia: 5, time: '10:43'}, 
        {dia: 6, time: '11:55'}, 
        {dia: 7, time: '13:50'}, 
        {dia: 8, time: '14:45'}, 
        {dia: 9, time: '15:45'}, 
        {dia: 10, time: '16:45'}, 
        {dia: 11, time: '17:55'}, 
        {dia: 12, time: '19:00'}, 
        {dia: 13, time: '20:20'}],
      diffMin: 0,
      course_ids: [{course: 'a', ids:[38,1,39,2,3,18,4,38], time: 130}, // 130min
                  {course: 'b', ids:[38,41,5,3,6,7,8,9,10,40,38], time: 210}, // 210min
                  {course: 'c', ids:[38,11,12,13,38], time: 90}], // 90min
      recommend: null,
      selected_train: null,
      hour_select: null,
      rouletteData: null,
      singleSelect: ['g_shopping', 'g_speciality', 'g_sightseeing'],
      roulette: false,
      slideshow: true,
      clicktf: true,
      distance: null,
      mappos: 'absolute',
    };
  },
  mounted: 
    function(){
      this.updateTime()
      setInterval(this.updateTime,1000);
    },
  methods: {
    updateTime: function() { 
      //現在の日付・時刻を取得
      let currentdate = new Date()
      //「時：分：秒」に整形する
      this.time = this.zeroPadding(currentdate.getHours(), 2) + ':' + this.zeroPadding(currentdate.getMinutes(), 2)// + ':' + currentdate.getSeconds()
      //test
      //this.time = '6:30'
      // 「〜年〜月〜日 （曜日）」に整形する 
      this.date = this.zeroPadding(currentdate.getFullYear(), 4) + '年' + this.zeroPadding(currentdate.getMonth() + 1, 2) + '月' + this.zeroPadding(currentdate.getDate(), 2) + '日'
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
    str2date: function(str_date) {
      let date = new Date();
      let hour_mins = str_date.split(":");
      let hour = hour_mins[0];
      let mins = hour_mins[1];
      date.setHours(Number(hour));
      date.setMinutes(Number(mins));
      return date
    },
    fixRoute: function(recommend) {
      // 周遊可能時間，所定時間からルートを再計算
      let recommend_time = recommend['time']
      //周遊可能時間＜所定時間 (つまり時間がない)
      if(this.diffMin < recommend_time){
        //周遊可能スポット数
        var num_spot = Math.floor(this.diffMin / 20)
        let rec_list = Object.values(recommend['ids'])      
        // (start, num)
        //周遊可能時間に応じたスポット数を頭から(矢島駅を除く)抽出
        var b = rec_list.splice(1, num_spot);

        //先頭に矢島駅を追加
        b.unshift(38);
        //最後に矢島駅を追加
        b.push(38);

        return b

      }else{
        //時間がある場合はそのまま
        let rec_list = Object.values(recommend['ids'])
        return rec_list
      }
    },
    start_click() {
      this.slideshow = false
      this.reset()
      for (const dia of this.dia_dict) {
        if(this.str2date(this.time) < this.str2date(dia.time)){
          this.q1_list.push(dia)
        }
      }
      this.q1 = true
    },
    qbtn_click(index) {
      //console.log("選んだダイア",index-1)
      this.selected_train = this.dia_dict[index-1]
      const diff = this.str2date(this.dia_dict[index-1].time) - this.str2date(this.time)
      console.log('かかる時間', this.dia_dict[index-1].time)
      console.log('現在時刻', this.time)
      this.diffMin = parseInt(diff / 1000 / 60)
      console.log('diffmin', this.diffMin)

      if(this.diffMin>60){
        //over 60min
        this.q2_list=[
          {choice: "歴史コース"}, 
          {choice: "寺院コース"}, 
          {choice: "地産コース"}]
          this.hour_select = 'over'
      }else{
        //less 60min
        this.q2_list=[
          {choice: "買い物"}, 
          {choice: "食事"}, 
          {choice: "観光"}]
          this.hour_select = 'less'
      }
      this.q1 = false
      this.q2 = true
    },
    featch_spot_name: function(id){

      return new Promise(resolve => {
        axios.get(`https://ysm.cps.akita-pu.ac.jp/api/spot/?id=${id}`)
          .then((response) => {
            // this.res = response.data;
            // console.log(id, response.data[0]['name'])
            resolve(response.data[0]);
            // return response.data[0]['name']
          })
          .catch(err => {
            console.log("err:", err);
          });
    })
    },
    singreRoute: function(index){
      return new Promise(resolve => {
        axios.get(`https://ysm.cps.akita-pu.ac.jp/api/spot/?${this.singleSelect[index]}=1`)
          .then((response) => {
            resolve(response.data)
          })
          .catch(err => {
            console.log("err:", err);
          });
      }) 
    },
    qbtn_last_click: async function(index) {
      if (this.hour_select === 'over'){
        //abcのコースがそれぞれ歴史，寺院，地産になっている
        this.recommend = this.course_ids[index]
        //console.log(index)
        let li = this.fixRoute(this.recommend)
        //idを入れるとそのnameが帰ってくる
        let name_list = [];
        for (let id of li){
          let name  = await this.featch_spot_name(id)
          name_list.push(name)
        }
        this.recommend = name_list
      }else{
        this.rouletteData = await this.singreRoute(index)
        //console.log('inelse', this.rouletteData)
        //クリックされたスポット一覧を返す

        // 0.9 APIでindexのデータを取得
        // 1 (データを取得後await) 最初にルーレットを表示する
        // 2 決まったら2秒後
          // ルーレット非表示
          // ルーレット結果をもとにルート作成
          // ルートを表示
        this.roulette = true
        //this.recommend = [0,0,0]
      }
      this.q2 = false
      this.last = true
    },
    displaymap: function(){
      this.clicktf =! this.clicktf
      var pos_l = ['absolute','relative'];
      var pos_now = this.mappos
      this.mappos = pos_l.find(function(value){
        return value !== pos_now;
      });
    },
    reset: function(){
      //表示状態のリセット
      this.q1 = false
      this.q2 = false
      this.last = false

      //選択のリセット
      this.recommend = null
      this.selected_train = null
      this.diffMin = 0
      this.q1_list = []
      this.q2_list = []

      //ルートをリセット
      this.roulette = false
      //マップを非表示
      this.clicktf = true
      this.mappos = 'absolute'
      //ローディング表示
      this.distance = []
    }
  }
}
</script>

<style>
#qbtn {
  padding: 5px;
  margin: 10px;
}

.rec_spot {
margin: 15px 10px 30px 10px;        /* 上右下左 */
background-color: powderblue;   /* 背景色指定 */
border: 2px solid #333;
border-radius: 5px;
padding: 30px;
position: relative;
}

.rec_spot_title {
background-color: #fff;
color: #333;
font-weight: bold;
left: 30px;
padding: 3px 10px;
position: absolute;
top: -15px;
border: 2px solid #333;
border-radius: 5px;
font-size: 20px;
}

</style>