<template>
    <ImgSlide />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import ImgSlide from '../components/ImgSlide.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    ImgSlide,
  },
});
</script>
