import Vue from 'vue'
import Router from 'vue-router'
//const _import = require('./_import_' + process.env.NODE_ENV)
const _import = require('./_pages_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../pages/layout/Layout'
import Second from '../pages/layout/Second'
import Login from '../pages/login/login.vue'
import Permission from '../pages/set/permissions/permission.vue'
import Role from '../pages/role/roleList.vue'
import session from '@/utils/session'

function fillThirdlyRuoterMap(routers, ps, parentPermission, parentRouter) {
    var parentId = parentPermission.permissionId;
    ps.forEach((permission) => {
      if (permission.parentId != null && permission.parentId == parentId && permission.type == 2) {
        try {
          routers.push({
            path: permission.path,
            component: _import(permission.component),
            name: permission.name,
            permissionId:permission.permissionId,
            noDropdown: true
          });
        } catch(error) {}
      }
    });
}

function fillSecondRuoterMap(routers, ps, parentPermission, parentRouter) {
  var parentId = parentPermission.permissionId;
  ps.forEach((permission) => {
    if (permission.parentId != null && permission.parentId == parentId && permission.type == 1) {
      var router = {
        path: parentRouter.path + '/' + permission.path,
        component: Second,
        // redirect: permission.path + '/index',
        name: permission.name,
        permissionId:permission.permissionId,
        icon: '',
        noDropdown: false,
        children:[]
      };
      fillThirdlyRuoterMap(router.children, ps, permission, router);
      if (router.children.length > 0) {
        router.redirect = parentRouter.path + '/' + permission.path + '/' + router.children[0].path;
      }
      routers.push(router);
    }
    if (permission.parentId != null && permission.parentId == parentId && permission.type == 2) {
      try {
        routers.push({
          path: permission.path,
          component: _import(permission.component),
          name: permission.name,
          permissionId:permission.permissionId,
          noDropdown: true
        });
      } catch (error) { }
    }
  });
}

function fillRouterMap(routers, ps) {
  ps.forEach((permission) => {
    if (permission.parentId == null && permission.type == 1) {
      var router = {
        path: '/' + permission.path,
        component: Layout,
        // redirect: '/' + permission.path + '/index',
        name: permission.name,
        permissionId:permission.permissionId,
        icon: '',
        noDropdown: false,
        children:[]
      };
      fillSecondRuoterMap(router.children, ps, permission, router);
      if (router.children.length > 0) {
        var crouter = router.children[0];
        if (crouter.redirect) {
          router.redirect = crouter.redirect;
        } else {
          router.redirect = '/' + permission.path + '/' + crouter.path;
        }
      }
      routers.push(router);
    }
    if (permission.parentId == null && permission.type == 2) {
      try {
        routers.push({
          path: '/' + permission.path,
          component: Layout,
          redirect: '/' + permission.path + '/index',
          name: permission.name,
          permissionId:permission.permissionId,
          icon: '',
          noDropdown: true,
          children:[{ path: 'index', component: _import(permission.component), name: permission.name }]
        });
      } catch (e) { }
    }
  });
}

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
export const constantRouterMap = [
    { path: '/login', name: 'login', component: Login,hidden:true},
    { path: '/404', component: _import('errorPage/404'), hidden: true },
    {
      path: '/error',
      component: Layout,
      redirect: '/404',
      name: '404',
      hidden: true,
      children: [{ path: '404', component: _import('errorPage/404') }]
    },
    { path: '/401', component: _import('errorPage/401'), hidden: true },
    { path: '*', redirect: '/error/404', hidden: true },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      name: '首页',
      hidden: true,
      children: [{ path: 'home', component: _import('dashboard/index') }]
    },
    { path: '/permission', name: 'permission', component: Permission,hidden:true},
    { path: '/role', name: 'role', component: Role,hidden:true},
]

if (session.isLogin()) {
  fillRouterMap(constantRouterMap, session.getUser().permissionVos)
}

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

//右侧测试
export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]
