<template>
  <div id="user-post-wrapper">
    <p>{{ title }}</p>
  </div>

  <div class="spot" v-for="(arr, index) in name2" :key=index>
    {{ arr.name }}
    <v-img :src="'/img/spot/'+ arr.id +'/' + arr.id +'.jpg'" height="125"></v-img>
    <a id="spot_link" :href="'/spot/'+$route.params.name+'/'+arr.id"></a>
    <!-- :href="'/spot/speciality/'+index" -->
    <!-- :to="`/spot/:name/${title.value}`" -->
    <div>
      営業時間：{{ arr.open_time }} - {{ arr.close_time }}<br>
      定休日&emsp;：{{ arr.regular_dayoff }}<br>
      電話番号：<a :href="'tel:'+arr.phone_number">{{ arr.phone_number }}</a><br>
      住所&emsp;&emsp;：{{ arr.address }}<br>
      
      <div class="grad-wrap" v-if="arr.detail.length>15">
        <input v-bind:id="'tigger'+index" class="grad-trigger" type="checkbox">
        <div class="grad-item">詳細&emsp;&emsp;：{{ arr.detail }}</div>
        <label class="grad-btn" v-bind:for="'tigger'+index"></label>
      </div>
      <div v-else>詳細&emsp;&emsp;：{{ arr.detail }}</div>
    </div>
  </div>
  <!-- <div @click="click">ボタン</div> -->
  <a @click="$router.back()">戻る</a>
</template>

<script>
import axios from 'axios'
import { useRoute } from 'vue-router'

export default {
  data() {
    return {
      res: null,
      name: null,
      name2: null,
      title: null,
      img: require("../../public/img/genre/lunch.jpg"),
    }
  },

  mounted() {
    
      axios.get(`https://ysm.cps.akita-pu.ac.jp/api/spot/?g_${this.$route.params.name}=1`)
      // thenで成功した場合の処理
      .then((response) => {
          this.res = response.data;
          console.log(typeof(this.res))
          console.log(this.res)
          this.name2 = this.res
          let name_list = [];
          for( var key in this.res ) {
            name_list.push(this.res[key]['name']);
          }
          this.name = name_list;
          //console.log(this.name)
      })

      // catchでエラー時の挙動を定義
      .catch(err => {
          console.log("err:", err);
      });
      const route = useRoute()

      if (route.params.name=='speciality'){
        this.title = '食事'
      }else if(route.params.name=='shopping'){
        this.title = '買い物'
      }else if(route.params.name=='hotel'){
        this.title = '宿泊'
      }else{
        this.title = '観光'
      }
    
  },

  methods: {
    click() {
      axios.get(`https://ysm.cps.akita-pu.ac.jp/api/spot/?g_${this.$route.params.name}=1`)
      // thenで成功した場合の処理
      .then((response) => {
          this.res = response.data;
          //console.log(typeof(this.res))
          //console.log(this.res)

          let name_list = [];
          for( var key in this.res ) {
            name_list.push(this.res[key]['name']);
          }
          this.name = name_list;
      })

      // catchでエラー時の挙動を定義
      .catch(err => {
          console.log("err:", err);
      });

    }
  }

}
</script>

<style>
.spot {
  /*  height: 500px;  */                 /* 高さ指定 */
  /* padding:  50px;  */                /* 余白指定 */
  margin: 15px 10px 30px 10px;        /* 上右下左 */
  /* font-size: 20px; */                /* 文字サイズ指定 */
  background-color: powderblue;   /* 背景色指定 */
  text-align: left;
  position: relative;
}

#spot_link {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.spot_img {
  display: flex;
  justify-content: flex-end;
}
/* ここからはreadmore */

.grad-btn {
  /*.grad-btnのCSSは表示/非表示の動作には関係ないので、ご自由にどうぞ。*/
}
.grad-btn::before {
  content: "続きを読む"
}
.grad-item {
  position: relative;
  overflow: hidden;
  height: 50px; /*隠した状態の高さ*/
}
.grad-item::before {
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px; /*グラデーションで隠す高さ*/
  /* background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.9) 50%, #fff 100%);
  background: linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.9) 50%, #fff 100%); */
  content: "";
}
.grad-trigger {
  display: none; /*チェックボックスは常に非表示*/
}
.grad-trigger:checked ~ .grad-btn::before {
  content: "閉じる" /*チェックされていたら、文言を変更する*/
}
.grad-trigger:checked ~ .grad-item {
  height: auto; /*チェックされていたら、高さを戻す*/
}
.grad-trigger:checked ~ .grad-item::before {
  display: none; /*チェックされていたら、grad-itemのbeforeを非表示にする*/
}
</style>