import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/Login'
import Home from 'components/Home'
import Users from 'components/users/Users'
import Rights from 'components/rights/Rights'
import Roles from 'components/rights/Roles'
import Category from 'components/product/Category'
import Goods from 'components/product/goods'
import GoodAdd from 'components/product/GoodAdd'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',

      redirect: '/login'
    },
    {
      path: '/login',
      component: Login

    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Category
        },
        {
          path: '/goods',
          component: Goods

        },
        {
          path: '/goods-add',
          component: GoodAdd
        }
      ]
    }

  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to', to)
  // console.log('from', from)
  if (to.path === '/login') {
    next()
    return
  }
  let token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router
