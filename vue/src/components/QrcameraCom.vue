<template>
QRスキャンページ<br>
現在は，<a href="https://www.city.yurihonjo.lg.jp/bunka-sport/bunka/c1336/9520">矢島郷土資料館(由利本荘市)</a>にアクセスすると，<br>
<a href="https://ysm.cps.akita-pu.ac.jp/spot/sightseeing/13">観光アプリの郷土資料館情報</a>に飛ばされます．

<p class="decode-result">Last result: <b>{{ result }}</b></p>
<QrcodeStream @decode="onDecode" @init="onInit">
</QrcodeStream>
</template>

<script>
/* eslint-disable */
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue3-qrcode-reader'

export default {

  components: {     
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture 
  },

  data() {
    return {
    result: null,
    error: '',
    showScanConfirmation: false
    }
  },
  
  methods: {
    onDecode (result) {
      this.result = result
      if (this.result==='https://www.city.yurihonjo.lg.jp/bunka-sport/bunka/c1336/9520') {
        location.href = 'https://ysm.cps.akita-pu.ac.jp/spot/sightseeing/13';
      }
      //window.open(this.result, '_blank')
/*       if(!window.open(this.result)) {
        location.href = this.result;
      } else {
        window.open(this.result, '_blank');
      } */
    },

    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      }
    }
  }

}

</script>

<style scoped>

</style>