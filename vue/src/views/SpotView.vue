<template>

  <!-- このforは一回だけ回る -->
  <div v-for="(value, index) in res" :key=index >
    <p>{{ value.name }}</p>
    <v-img :src="'/img/spot/'+ $route.params.spot_id +'/' + $route.params.spot_id +'.jpg'" height="125"></v-img>
    <table border="1" class="detail_info">
      <tr>
        <th>住所</th>
        <td>{{ value.address }}</td>
      </tr>
      <tr>
        <th>営業時間</th>
        <td>{{ value.open_time }} - {{ value.close_time }} </td>
      </tr>
      <tr v-if="$route.params.spot_id==32">
        <th>リアルタイム開店状況</th>
        <td> {{ spot_status }} </td>
      </tr>
      <tr>
        <th>定休日</th>
        <td>{{ value.regular_dayoff }}</td>
      </tr>
      <tr>
        <th>電話番号</th>
        <td>{{ value.phone_number }}</td>
      </tr>
      <tr>
        <th>URL</th>
        <td>{{ value.url }}</td>
      </tr>
      <tr>
        <th>詳細</th>
        <td>{{ value.detail }}</td>
      </tr>              
    </table>
  </div>

  <a @click="$router.back()">戻る</a>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            res: null,
            img: require("../../public/img/genre/lunch.jpg"),
            spot_status: null,
        };
    },
    mounted() {
      this.get_spot_info()
      this.get_spot_status()
    },
    methods: {
      get_spot_info: function(){
        axios.get(`https://ysm.cps.akita-pu.ac.jp/api/spot/?id=${this.$route.params.spot_id}`)
          .then((response) => {
          this.res = response.data;
        })
            // catchでエラー時の挙動を定義
        .catch(err => {
          console.log("err:", err);
        });
      },
      get_spot_status: function(){
        const API_KEY = '3c5c56221ac5e84e579789e4891555b819531a1c869cdfd0724df071d4b73dc3b579e7afbb17fbeba16de4509b8db05a'
        //CAAC77149CBA 観光案内所
        //E13C3FF25FAC まつ子さん
        axios.get('/devices/E13C3FF25FAC/status', { headers: { 'Authorization': API_KEY, 'content-type': 'application/json'} })
          .then((response) => {
            if(response.data.body.openState==='close'){
              this.spot_status = 'CLOSE'
            }else{
              this.spot_status = 'OPEN'
            }
         })
          .catch(err => {
            console.log("err:", err);
          });
      }
    }

}
</script>


<style>
table {
  border-collapse:collapse;
  border-spacing:0;
  margin: 15px 10px 30px 10px;        /* 上右下左 */
  /* text-align: left; */
  }

.detail_info tr th	{
	padding: 5px 10px;
	border-top: 1px solid #000000;
	border-bottom: 1px solid #000000;
	background-color: #f3f3f3;
	color: #3d9828;
	white-space: nowrap;
}
</style>