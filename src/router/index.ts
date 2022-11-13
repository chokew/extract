import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../views/layout/index.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: 'task',
    children: [
      {
        path: 'task',
        name: 'task',
        component: () => import('../views/task/index.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
