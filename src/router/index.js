import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/Login'
import PageNotFound from '@/components/404'
import Users from '@/components/Users'
import Videos from '@/components/Videos'
import Agents from '@/components/Agents'
import Accounts from '@/components/Accounts'
import News from '@/components/News'

Vue.use(Router)

function requireAuth(to, from, next) {
  var authenticated = localStorage.getItem('adminsession')
  if (authenticated === null || authenticated === '[]') {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
}

export default new Router({
  mode: 'history',
  routes: [{
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        plainLayout: true
      }
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Login,
      meta: {
        plainLayout: true
      }
    },
    {
      path: '/',
      name: 'Home',
      component: Dashboard,
      beforeEnter: requireAuth
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: requireAuth
    },
    {
      path: '/videos',
      name: 'Videos',
      component: Videos,
      beforeEnter: requireAuth
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      beforeEnter: requireAuth
    },
    {
      path: '/agents',
      name: 'Agents',
      component: Agents,
      beforeEnter: requireAuth
    },
    {
      path: '/accounts',
      name: 'Chart Accounts',
      component: Accounts,
      beforeEnter: requireAuth
    },
    {
      path: '/news',
      name: 'News',
      component: News,
      beforeEnter: requireAuth
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})
