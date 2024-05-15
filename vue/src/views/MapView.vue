<template>
  <div class="map">
    <Map/>
  </div>
</template>

<script>
// @ is an alias to /src
import Map from '@/components/MapCom.vue'

export default {
  name: 'MapView',
  components: {
    Map
  }
}
</script>