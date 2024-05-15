<template>
    <qrCom />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import qrCom from '../components/QrcameraCom.vue';

export default defineComponent({
  name: 'QrView',
  components: {
    qrCom,
  },
});
</script>