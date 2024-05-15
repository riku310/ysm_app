<template>

  <div id="slider">
    <img v-for="src in imgs" :key='src' :src="src">
  </div>

</template>

<script>

export default {
  name: 'SlideShow',
  data() {
    return {
      imgs: [require('../../public/img/bg/1.png'),
              require('../../public/img/bg/2.png'),
              require('../../public/img/bg/3.png'),
              require('../../public/img/bg/4.png'),
              require('../../public/img/bg/5.png'),
              require('../../public/img/bg/6.png'),
              require('../../public/img/bg/7.png'),
              require('../../public/img/bg/8.png'),
              require('../../public/img/bg/9.png'),
            ]
    }
  },
  mounted() {
    console.log('mounted')
    // 時間の指定
    var timer = 3000;
    // スライドする要素を取得
    var imgs = document.querySelectorAll('#slider img');
    // 最初の画像を表示
    imgs[0].classList.add('show');
    // 画像の番号
    var imgNum = 0;
    function showImg () {
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].classList.remove('show');
      }
      if (imgNum >= imgs.length - 1) {
        imgNum = 0;
      } else {
        imgNum++;
      }
      imgs[imgNum].classList.add('show');
      showImgTimer();
    }
    function showImgTimer () {
      setTimeout(showImg, timer);
    }
    showImgTimer()
    }
  }
</script>

<style>
#slider {
  position: static;
  top: 0;
}
#slider img {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: 2.0s;
  background-size: cover;
  height: 100vh;
  object-fit: cover;
}
#slider img.show {
  opacity: 0.5;
}
</style>