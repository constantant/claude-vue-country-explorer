import { createRouter, createWebHistory } from 'vue-router'
import CountryList from '../views/CountryList.vue'
import CountryDetail from '../views/CountryDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CountryList
    },
    {
      path: '/country/:code',
      name: 'country-detail',
      component: CountryDetail,
      props: true
    }
  ]
})

export default router
