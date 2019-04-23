import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../components/auth/index.vue'),
      children: [
        {
          path: 'register',
          component: () => import('@/components/auth/SignupForm.vue'),
          name: 'register'
        },
        {
          path: 'login',
          component: () => import('@/components/auth/LoginForm.vue'),
          name: 'login'
        }
      ]
    },
    {
      path: '/',
      redirect: '/dashboard/profile'
    },
    {
      path: '/dashboard',
      // name: 'Dashboard',
      redirect: '/dashboard/profile',
      name: 'route',
      component: () => import('@/components/Dashboard.vue'),
      children: [
        {
          path: 'profile',
          component: () => import('@/components/Profile.vue'),
          name: 'Profile'
        },
        {
          path: 'vote/:id',
          component: () => import('@/components/Vote.vue'),
          name: 'Vote'
        },
        {
          path: 'live-vote-results/:id',
          component: () => import('@/components/shared/LiveVoteResults.vue'),
          name: 'VoteResults'
        },
        {
          path: 'users',
          component: () => import('@/components/Users.vue'),
          name: 'Users',
          meta: {
            restrictedToAdmin: true
          }
        },
        {
          path: 'campaigns',
          component: () => import('@/components/CampaignBase.vue'),
          // name: 'CampaignBase',
          children: [

            {
              path: ':id/verifyusers',
              component: () => import('@/components/campaigns/CampaignVerifyUsersView.vue'),
              name: 'CampaignVerifyUsers',
              // params: true,
              meta: {
                restrictedToAdmin: true
              }
            },
            {
              path: '',
              component: () => import('@/components/campaigns/Campaigns.vue'),
              name: 'Campaigns',
              meta: {
                restrictedToAdmin: false
              }
            },
          ],
          meta: {
            restrictedToAdmin: false
          }
        },
        {
          path: 'campaigns/:id',
          component: () => import('@/components/campaigns/CampaignView.vue'),
          name: 'Campaign',
          // params: true,
          meta: {
            restrictedToAdmin: true
          }
        },
        {
          path: '/analytics',
          component: () => import('@/components/Analytics.vue'),
          // name: 'Analytics'
          name: 'Dashboard',
          meta: {
            restrictedToAdmin: true
          }
        }
      ],
    }
  ]
})
