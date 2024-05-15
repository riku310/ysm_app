<template>
  <v-carousel
  cycle
  interval="5000"
  height="auto"
  :show-arrows="false"
  hide-delimiters
  class='carousel'
  >
    <v-carousel-item
      v-for="(item,i) in items"
      :key="i"
      reverse-transition="fade-transition"
      transition="fade-transition"
    >
    <img :src="item.src" :alt="item.src" :key="i"/>
    </v-carousel-item>

  </v-carousel>

  <div id="appname">
    Chokai-Sanroku<br>
    Footpath<br>
    Tourist<br>
    Guide<br>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          {
            src: require('../../public/img/home/station_entrance.jpg'),
          },
          {
            src: require('../../public/img/home/station_platform.jpg'),
          },
          {
            src: require('../../public/img/home/train_scenery.jpeg'),
          },
        ],
      }
    },
    mounted() {
      this.css_setup()
    },
    methods: {
      css_setup: function(){
        var ut = navigator.userAgent;
        const box = document.getElementById("appname");
        if (ut.indexOf('iPhone')>0){
          // chromeのiPhoneではうまく動かない．
          // iPhone上のsafariなら動く
          console.log('iphone')
          box.style.top = 'calc(100dvh - 56px - 260px)';
        }else{
          box.style.top = 'calc(100vh - 56px - 260px)';
        }
      }
    }
  }
</script>

<style scoped>
img {
  height: calc(100vh - 56px);
  margin-left: -60px;
  margin-right: -60px;
}

.carousel{
  position: absolute;
  top: 0;
}

#appname {
  position: absolute;
  text-align: left;
  font-size: 45px;
  font-family: "Arial", "メイリオ";
  font-weight: bold;
  color: #ffffff;
  z-index: 700;
}
</style>