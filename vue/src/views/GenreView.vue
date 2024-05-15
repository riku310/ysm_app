<template>
  <v-container
    class="fill-height"
    fluid
    style="min-height: 434px"
  >
    <v-fade-transition mode="out-in">
      <v-row>  
        <v-col cols="6" v-for="title in titles" :key="title.name"> 
          <v-card :to="`/spot/${title.value}`">
            <v-img
              :src="title.src"
              height="125"
              class="grey darken-4"
            ></v-img>
            <v-card-title class="text-subtitle-1">
              {{title.name}}
            </v-card-title>
          </v-card>
      </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    titles: [ 
      { name: '食事'    ,src: require("../../public/img/genre/lunch.jpg")             ,value:'speciality'  },
      { name: '買い物'  ,src: require("../../public/img/genre/shop.jpg")              ,value:'shopping' },
      { name: '宿泊'    ,src: require("../../public/img/genre/hotel.jpg")             ,value:'hotel' },
      { name: '観光'    ,src: require("../../public/img/genre/history_ryugenji.jpeg") ,value:'sightseeing' }
    ]
  }),
}

</script>