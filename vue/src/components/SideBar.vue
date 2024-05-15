<template>
  <div class="text-right sidebar_layer" >
    <v-btn
      class="mx-2" app fab dark retain-focus-on-click
      color="#80CBC4" v-on:click.stop="drawer = !drawer"
    >
      <v-icon>mdi-format-list-bulleted-square</v-icon>
    </v-btn>
  </div>
  <v-navigation-drawer
      v-model="drawer" fixed temporary right location="right"
  >
  <v-row class="justify-start">
    <v-btn
      class="mx-2" app color="#FFFFFF"
      outlined v-on:click.stop="drawer = !drawer"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-row>
    <v-list nav dense >
      <v-list-item-group>
        <v-list-item color="teal" v-for="menu in menus" :key="menu.name" :to="menu.url">
          <v-list-item-title><v-icon>{{ menu.icon }}</v-icon> {{ menu.name }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>

</template>
 
<script>
export default {
  name: 'App',
  data: () => ({
    drawer: false,
    menus: [
      { name: 'Home' , icon: 'mdi-home'         , url: '/' },
      { name: 'Map'  , icon: 'mdi-map-marker'   , url: '/map' },
      { name: 'Spot' , icon: 'mdi-apple-safari' , url: '/spot' },
      { name: 'Router' , icon: 'mdi-map-marker-path' , url: '/router' },
      { name: '時刻表検索', icon: 'mdi-train', url: '/schedule' },
      { name: 'ML', icon: 'mdi-image-sync', url: '/ml' },
      { name: 'QR', icon: 'mdi-qrcode-scan', url: '/qr' },
    ]
  })
}
</script>

<style>
.text-right{
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
}

.sidebar_layer{
  top: 0;
  z-index: 800;
}
</style>