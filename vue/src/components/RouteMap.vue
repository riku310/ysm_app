<template>
<div id="mapContainer">
</div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

//現在地アイコンのカスタム
import "@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css";
import "@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.js";

import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

//leaflet-routing-machine
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.js";

//ジャンルのカスタムアイコン
import "leaflet.icon.glyph/Leaflet.Icon.Glyph.js";

export default {
  name: "MapCom",
  props: {
    props_data: Object,
    mappos: String,
  },
  data() {
    return {
      map: null,
      icon_tf:{'speciality':false,'shopping':false},
      icon_v:{'speciality':'mdi-silverware-fork-knife','shopping':'mdi-cart','hotel':'mdi-bed'},
      genre_dic: {},
      searchmark: null,
      info_list: [],
      model: null,
      search: null,
    };
  },
  async mounted() {
    this.map = L.map("mapContainer", { zoomControl: false });
    /* setTimeout(function (){
        this.map.invalidateSize();
      },200) */
    this.map.setView([39.230133, 140.139262], 9);
    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
    
    //現在地取得
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
        L.marker([this.lat, this.lon],{icon: pulsingIcon2}).addTo(this.map);
        //this.map.setView([this.lat, this.lon], 15);
        //一時的に
        this.map.setView([39.230133, 140.139262], 15);
    }
    
    function error() {
        alert('error');
    }
    navigator.geolocation.getCurrentPosition(success,error)
    
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

    //ルート表示
    var waylist = [];    
    var dislist = [];
    let totaldis = 0;
    let totaltime = 0;
    for (var data in this.props_data) {
        waylist.push([this.props_data[data]['lat'],this.props_data[data]['lon']]);
        if (data>0){
            const name = this.props_data[data-1]['name']
            const lenlist = this.props_data.length
            L.Routing.control({
                waypoints: waylist,
                lineOptions : {
                    styles : [{color: 'black', opacity: 0.05, weight: 9}, {color: 'white', opacity: 0.8, weight: 6}, {color: '#398aca', opacity: 1, weight: 4}],
                },
                fitSelectedRoutes: false,
                addWaypoints: false,
                createMarker:function(i, wp){
                    const location = data =>{
                        if (Number(data)+1 == lenlist && i==1 || data==1 && i==0){
                            return ['S/G','矢島駅']
                        } else if (i==0){
                            return [data-1,name]
                        }else{
                            return [data,name]
                        }
                    }
                    const icons = L.icon.glyph({ prefix: '', cssClass:'sans-serif', glyph: location(data)[0],glyphSize: '14px'})
                    return L.marker(wp.latLng, {icon: icons}).bindPopup(location(data)[1]);},
                }).addTo(this.map);
            
            await fetch(`https://router.project-osrm.org/route/v1/driving/${waylist[0][1]},${waylist[0][0]};${waylist[1][1]},${waylist[1][0]}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.distance = Math.floor(data.routes[0].distance);
                this.pedtime = Math.round(this.distance/ 67.2);
            });
            waylist.shift();
            totaldis += this.distance;
            totaltime += this.pedtime;
            dislist.push({'dis':totaldis, 'time':totaltime})
        }
    }
    this.$emit('route',dislist);
  },
  methods:{
    mapposition: function(){
      return this.mappos
    }
  }
}
</script>

<style scoped>
#mapContainer {
  /* staticだと並んでしまうのでabで上にくっつける */
  /*position: absolute;*/
  position: v-bind(mapposition());
  top: -100%;
  /* width: 100%; */
  height: 300px;
  width: 100%;
}
#mapContainer::v-deep .leaflet-routing-container{
    display: none;
}
</style>