<template>
  <v-btn large fab dark class="mx-2" elevation="2" id="vb-1" v-on:click="api_test" >
    Weather API test
  </v-btn>
</template>

<script>
import axios from 'axios';
export default {
  methods: {
    api_test: function() { 
      
      let date_info = this.get_time()
      let date = date_info[0]
      console.log(date_info)

      axios.get(`https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&hourly=precipitation&timezone=Asia%2FTokyo&start_date=${date}&end_date=${date}`)

      // thenで成功した場合の処理
      .then((response) => {
          console.log(response['data']['hourly']['precipitation']);
          console.log(response['data']['hourly']['time']);
      })
      // catchでエラー時の挙動を定義
      .catch(err => {
          console.log("err:", err);
      });

    },
    get_time: function() {
      //現在の日付・時刻を取得
      let currentdate = new Date()
      //「時：分」に整形する
      let time = this.zeroPadding(currentdate.getHours(), 2) + ':' + this.zeroPadding(currentdate.getMinutes(), 2)// + ':' + currentdate.getSeconds()
      // 「年-月-日」に整形する 
      let date = this.zeroPadding(currentdate.getFullYear(), 4) + '-' + this.zeroPadding(currentdate.getMonth() + 1, 2) + '-' + this.zeroPadding(currentdate.getDate(), 2)
      //console.log(time,date)
      return [date,time]
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
  }
}
</script>