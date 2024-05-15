<template>

  <input type="file" name="example" accept="image/*, image/png" ref="image" @changed="sendimg">
  <br>
  <v-btn v-on:click="sendimg">
    <v-icon>mdi-send</v-icon>
  </v-btn>
  
  <v-img :src="img_url"></v-img>

</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      img_url: null
    }
  },
  mounted() {
    //this.runModel()
  },
  methods: {
    clicked: function() {
      console.log('clicked')
    },
    sendimg: async function() {
      const url = `https://ysm.cps.akita-pu.ac.jp/`;
      const data = new FormData();
      data.append("image", this.$refs.image.files[0]);
      const headers = { "content-type": "image/png" };
      const res  = await axios.post(url+'imgapi', data, { headers });
      
      await console.log(res.data)
      this.img_url = url + res.data
      console.log(this.img_url)
      //並列テスト
      //this.test(url, data, headers )
    },
    test: function(url, data, headers ){
      for (let i = 0; i < 10; i++) {
        console.log(i)
        axios.post(url, data, { headers });
      }
    }
  }
}
</script>