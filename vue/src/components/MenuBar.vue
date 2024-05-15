<template>
  <v-bottom-navigation
    input-value="value" color="teal"
  >
    <v-btn v-for="(menu,index) in menus" :key="menu.name" :to="menu.url"
      dark retain-focus-on-click v-bind:disabled="menu.isActive" v-on:click="push(index)"
    >
      <v-icon>{{ menu.icon }}</v-icon>
      <span>{{ menu.name }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: false,
    menus: [
      { name: 'Home', icon: 'mdi-home',          url: '/',          isActive:false },
      { name: 'Map',  icon: 'mdi-map-marker',    url: '/map',       isActive:false },
      { name: 'Spot', icon: 'mdi-apple-safari',  url: '/spot',      isActive:false },
      //{ name: 'ex',   icon: 'mdi-shape-outline', url: '/test',      isActive:false },
      { name: 'Router',   icon: 'mdi-map-marker-path', url: '/router',      isActive:false }
    ]
  }),
  methods: {
    // メニューバーのボタンを押した時に，そのボタンを非活性にする処理
    // 一旦全てのボタンを"false:活性"にした後に 該当するボタンを"true:非活性"にしている．
    push: function(index){
      for (let i=0; i < this.menus.length; i++){
        this.menus[i].isActive = false;
        this.menus[index].isActive = true;}
    }
  }
}

</script>

<style>

</style>