<template>
  <div id="mapContainer">
      <v-row>
        <v-col >
        <div class='search-input'>
        <v-autocomplete
            v-model="model"
            v-model:search="search"
            :items="info_list"
            :loading="isLoading"
            item-title="name"
            hide-no-data
            hide-selected
            variant="solo"
            label="Search here"
            append-inner-icon="mdi-magnify"
            single-line
            return-object
          ></v-autocomplete>
          <v-icon v-if="model" class="delete" :disabled="!model" v-on:click="deleteClick()"> mdi-close-circle</v-icon>
        </div>
        <v-expand-transition v-if="model" v-on:click="fields"></v-expand-transition>
        </v-col>
      </v-row> 
    <v-btn retain-focus-on-click elevation="2" id="vb-1" v-on:click="buttonClicked('speciality')">
      <v-icon>mdi-silverware-fork-knife</v-icon>
    </v-btn>
    <v-btn large fab dark class="mx-2" elevation="2" id="vb-1" v-on:click="buttonClicked('shopping')" >
      <v-icon>mdi-cart</v-icon>
    </v-btn>
    <v-btn elevation="2" id="vb-1" v-on:click="buttonClicked('hotel')">
      <v-icon>mdi-bed</v-icon>
    </v-btn>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import axios from 'axios'

//現在地アイコンのカスタム
import "@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css";
import "@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.js";

import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

//ジャンルのカスタムアイコン
import "leaflet.icon.glyph/Leaflet.Icon.Glyph.js";

/* eslint-disable */
import "leaflet.locatecontrol/src/L.Control.Locate.js";

export default {
  name: "MapCom",
  components: {
    
  },
  data() {
    return {
      map: null,
      icon_tf:{'speciality':false,'shopping':false},
      icon_v:{'speciality':'mdi-silverware-fork-knife','shopping':'mdi-cart','hotel':'mdi-bed'},
      genre_dic: {},
      isLoading: false,
      searchmark: null,
      info_list: [],
      model: null,
      search: null,
    };
  },
  mounted() {
    this.css_setup()
    // zoomすると現在地がバグるため，animate falseにする
    this.map = L.map("mapContainer", { zoomControl: false, zoomAnimation: false });
    this.map.setView([39.230133, 140.139262], 9);
    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
    
    /* //現在地取得
    if (navigator.geolocation == false){
        alert('現在地を取得できませんでした。');
        return;
    }
    const success = (e) => {
        this.lat  = e.coords.latitude;
        this.lon = e.coords.longitude;
        
        var pulsingIcon2 = L.icon.pulse({
            iconSize:[20,20]
            ,color:'#57c6fd'
            ,fillColor:'#4285F4'
            ,heartbeat: 2
            });
        //L.marker([this.lat, this.lon],{icon: pulsingIcon2}).addTo(this.map);
        //this.map.setView([this.lat, this.lon], 15);
        //一時的に
        this.map.setView([39.230133, 140.139262], 15);
    }
    
    function error() {
        alert('error');
    }
    navigator.geolocation.getCurrentPosition(success,error) */
    
    //矢島駅にsetview
    this.map.setView([39.230133, 140.139262], 15);
    
    // Locate
    var option = {
      position: 'bottomleft',
      cacheLocation: false,
      strings: {
          title: "現在地を表示",
          popup: "いまここ"
      },
      locateOptions: {
        maxZoom: 16
      }
    }
    // create control and add to map
    var lc = L.control.locate(option).addTo(this.map);

    // request location update and set location
    //lc.start();
    
    //defaultのicon設定
    let DefaultIcon = L.icon({
      iconUrl: icon,
      iconRetinaUrl: iconRetina,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
      });
    L.Marker.prototype.options.icon = DefaultIcon;
  },
  methods: {
    buttonClicked: function (genre) {
      this.icon_tf[genre] = !this.icon_tf[genre];
      //Trueのとき，マップにマーカーを追加
      if (this.icon_tf[genre]) {
        axios.get(`https://ysm.cps.akita-pu.ac.jp/api/spot/?g_${genre}=1`)
        // thenで成功した場合の処理
        .then((response) => {
          this.res = response.data;
          this.genre_dic[genre] = L.layerGroup();
          for( var key in this.res ) {
            var popup_page = `<a href='/spot/${genre}/${this.res[key]['id']}'> ${this.res[key]['name']} </a>`;
            this.genre_dic[genre].addLayer(L.marker([this.res[key]['lat'], this.res[key]['lon']], 
              {icon: L.icon.glyph({ prefix: 'mdi', glyph: this.icon_v[genre] })}).bindPopup(popup_page));
          }
          this.map.addLayer(this.genre_dic[genre])
          //一時的にsetview(hotelの場合は，範囲が広いので縮小)
          if (genre==='hotel'){
            this.map.setView([39.230133, 140.139262], 12);
          }else{
            this.map.setView([39.230133, 140.139262], 14);
          }
        })
        // catchでエラー時の挙動を定義
        .catch(err => {
          console.log("err:", err);
        })
      }else{
        //Falseのとき，マーカーを削除
        this.map.removeLayer(this.genre_dic[genre]);
      }
    },
    deleteClick: function () {
      this.map.removeLayer(this.searchmark)
      this.model = null;
      this.searchmark = null;
    },
    searchfunc (){
      for (var key in this.model ){
        if (key.slice(0,2)==='g_' && this.model[key]===1 ){
          var genre = key
        }
      }
      if (!this.searchmark){
        const popup_page = `<a href='/spot/${genre}/${this.model['id']}'> ${this.model['name']} </a>`;
        this.searchmark = L.marker([this.model['lat'], this.model['lon']]).bindPopup(popup_page);
        this.searchmark.addTo(this.map);
        this.map.setView([this.model['lat'], this.model['lon']], 15);
      }
    },
    css_setup: function(){
      var ut = navigator.userAgent;
      const box = document.getElementById("mapContainer");
      if (ut.indexOf('iPhone')>0){
        // chromeのiPhoneではうまく動かない．
        // iPhone上のsafariなら動く
        box.style.height = 'calc(100dvh - 56px)';
      }else{
        box.style.height = 'calc(100vh - 56px)';
      }
    }
  },
  computed: {
    fields () {
      if (!this.model) return []
      return this.searchfunc();
    },
  },
  watch: {
    search () {
      if (this.search.length < 1){return}

      if (this.isLoading) {return}

      if (this.searchmark){
        this.map.removeLayer(this.searchmark)
        this.searchmark = null
      }

      this.isLoading = true
      this.info_list = []
      axios.get(`https://ysm.cps.akita-pu.ac.jp/api/spot/`)
        // thenで成功した場合の処理
        .then((response) => {
          this.info = response.data
          for( var key in this.info ) {
            if (this.search.length > 0 && this.info[key]['name'].includes(this.search)){
              this.info_list.push(this.info[key])          
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
  }, 
};
</script>


<style>
#mapContainer {
  /* staticだと並んでしまうのでabで上にくっつける */
  position: absolute;
  top: 0;
  width: 100%;
}
.leaflet-pulsing-icon {
    border-radius: 100%;
    box-shadow: 1px 1px 8px 0 rgba(0,0,0,0.75);
    border: 4px solid #ffffff;
}
.leaflet-pulsing-icon:after {
    content: "";
    border-radius: 100%;
    height: 300%;
    width: 300%;
    position: absolute;
    /* バグ修正 */
    margin: -100% 0 0 -150%;
}
#vb-1 {
  position: relative;
  top: 0;
  z-index: 999;
}
#vbt {
  z-index: 999
}
.search-input{
  position: relative;  
  max-width: 80%;
  top: 5px;
  z-index: 900;
}
.delete {
  position: absolute;
  height: 50px;
  width: 50px;
  top: 5%;
  left: 70%;
  z-index: 1000;
}

/* ADD*/
.leaflet-control-locate a {
  cursor: pointer;
}
.leaflet-control-locate a .leaflet-control-locate-location-arrow {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 7px;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="black" d="M445 4 29 195c-48 23-32 93 19 93h176v176c0 51 70 67 93 19L508 67c16-38-25-79-63-63z"/></svg>');
}
.leaflet-control-locate a .leaflet-control-locate-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 7px;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="black" d="M304 48a48 48 0 1 1-96 0 48 48 0 0 1 96 0zm-48 368a48 48 0 1 0 0 96 48 48 0 0 0 0-96zm208-208a48 48 0 1 0 0 96 48 48 0 0 0 0-96zM96 256a48 48 0 1 0-96 0 48 48 0 0 0 96 0zm13 99a48 48 0 1 0 0 96 48 48 0 0 0 0-96zm294 0a48 48 0 1 0 0 96 48 48 0 0 0 0-96zM109 61a48 48 0 1 0 0 96 48 48 0 0 0 0-96z"/></svg>');
  animation: leaflet-control-locate-spin 2s linear infinite;
}
.leaflet-control-locate.active a .leaflet-control-locate-location-arrow {
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="rgb(32, 116, 182)" d="M445 4 29 195c-48 23-32 93 19 93h176v176c0 51 70 67 93 19L508 67c16-38-25-79-63-63z"/></svg>');
}
.leaflet-control-locate.following a .leaflet-control-locate-location-arrow {
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="rgb(32, 116, 182)" d="M445 4 29 195c-48 23-32 93 19 93h176v176c0 51 70 67 93 19L508 67c16-38-25-79-63-63z"/></svg>');
}

.leaflet-touch .leaflet-bar .leaflet-locate-text-active {
  width: 100%;
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 10px;
}
.leaflet-touch .leaflet-bar .leaflet-locate-text-active .leaflet-locate-icon {
  padding: 0 5px 0 0;
}

.leaflet-control-locate-location circle {
  animation: leaflet-control-locate-throb 4s ease infinite;
}

@keyframes leaflet-control-locate-throb {
  0% {
    stroke-width: 1;
  }
  50% {
    stroke-width: 3;
    transform: scale(0.8, 0.8);
  }
  100% {
    stroke-width: 1;
  }
}
@keyframes leaflet-control-locate-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}



</style>