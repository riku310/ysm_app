<template>
  <v-app>
    <v-main>
      <SideBar />
      <router-view/>
    </v-main>
    <MenuBar />
  </v-app>
</template>

<script>

import MenuBar from './components/MenuBar.vue';
import SideBar from './components/SideBar.vue';

export default {
  name: 'App',
  components:{
    MenuBar,
    SideBar
  },
  data: () => ({
    //
  }),
  mounted() {
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

html {
  position: fixed;
  height: 100%;
  overflow: hidden;
}
body {
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>