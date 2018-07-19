import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
        path: '/auth',
        name: 'auth',
        component: () => import('@/components/auth/index'),
        children: [
            {
                path: 'register',
                component: () => import('@/components/auth/SignupForm'),
                name: 'register',
                meta: {}
            },
            {
                path: 'login',
                component: () => import('@/components/auth/LoginForm'),
                name: 'login',
                meta: {}
            }
        ]
    },
    {
        path: '/dashboard',
        name: 'route',
        component: () => import('@/components/Dashboard'),
        children: [
            {
              path: 'profile',
              component: () => import('@/components/Profile'),
              name: 'Profile'
            },
            {
              path: 'users',
              component: () => import('@/components/Users'),
              name: 'Users'
            },
            {
              path: 'analytics',
              component: () => import('@/components/Analytics'),
              name: 'Analytics'
          }
        ],
    }
  ]
})
