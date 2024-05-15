<template>
    <MlCom />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import MlCom from '../components/Img2animeCom.vue';

export default defineComponent({
  name: 'MlView',
  components: {
    MlCom,
  },
});
</script>
