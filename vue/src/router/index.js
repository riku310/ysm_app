import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import MapView from '../views/MapView.vue'
import GenreView from '../views/GenreView.vue'
import SpotTableView from '../views/SpotTableView.vue'
import SpotView from '../views/SpotView.vue'
import TrainSchedule from '../views/TrainScheduleView.vue'
import RouterView from '../views/RouterView.vue'
import MlView from '../views/MlView.vue'
import QrView from '../views/QrView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // ユーザーの読み込みをトリガーにする．
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    component: AboutView
  },
  {
    path: '/map',
    name: 'map',
    component: MapView
  },
  {
    // ユーザーにはspotと見せて，表示はジャンルを表示する
    path: '/spot',
    component: GenreView
  },
  {
    path: '/spot/:name',
    component: SpotTableView
  },
  {
    path: '/spot/:name/:spot_id',
    component: SpotView
  },
  {
    path: '/schedule',
    component: TrainSchedule
  },
  {
    path: '/router',
    component: RouterView
  },
  {
    path: '/ml',
    component: MlView
  },
  {
    path: '/qr',
    component: QrView
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
