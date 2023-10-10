import {
  constantRoutes
} from '@/router'
import {
  getRouters
} from '@/api/menu'
import Layout from '@/layout/index'

const permission = {
  state: {
    routes: [],
    sideRoutes: [],
    navMenus: [{
      icon: null,
      name: "首页",
      menuId: -100,
      path: "/"
    }],
    activeNavMenu: {
      icon: null,
      name: "首页",
      menuId: -100,
      path: "/"
    }
  },
  mutations: {
    SET_NAVMENUS: (state, navMenus) => {
      state.navMenus = state.navMenus.concat(navMenus)
    },
    SET_ACTIVENAVMENU: (state, activeNavMenu) => {
      state.activeNavMenu = activeNavMenu
    },
    SET_ROUTES: (state, routes) => {
      state.routes = constantRoutes.concat(routes)
    },
    SET_SIDEROUTES: (state) => {
      state.sideRoutes = state.routes.filter(function (value) {
        if (value.meta && value.meta != null) {
          const meta = value.meta
          if (meta.navMenuId && meta.navMenuId != null) {
            const navMenuId = meta.navMenuId
            if (navMenuId === state.activeNavMenu.menuId) {
              return true
            } else {
              return false
            }
          }
        }
        return true
      })
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({
      commit
    }) {
      return new Promise((resolve, reject) => {
        // 向后端请求路由数据
        getRouters().then(routers => {
          if (routers.menuList && routers.menuList.length) {
            const {
              navMenus,
              sideRoutes
            } = reorganizing(routers.menuList)
            commit('SET_NAVMENUS', navMenus)
            const accessedRoutes = accessing(sideRoutes.flat())
            commit('SET_ROUTES', accessedRoutes)
            commit('SET_SIDEROUTES')
            resolve(accessedRoutes)
          } else {
            reject('该用户暂无任何菜单权限，如需更多功能服务请先设置菜单权限')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 切换顶部导航菜单
    SwitchNavMenu({
      commit
    }, navMenu) {
      commit('SET_ACTIVENAVMENU', navMenu)
      commit('SET_SIDEROUTES')
    },
    // 根据路由刷新顶部导航菜单
    RefreshNavMenu({
      state,
      dispatch
    }, {
      route
    }) {
      if (route.meta && route.meta != null) {
        const meta = route.meta;
        if (meta.navMenuId && meta.navMenuId != null) {
          const navMenuId = meta.navMenuId;
          if (navMenuId !== state.activeNavMenu.menuId) {
            const menu = state.navMenus.filter(
              item => item.menuId === navMenuId
            )[0];
            dispatch("SwitchNavMenu", menu);
          }
        }
      }
    }
  }
}

// 重组后端数据生成顶部导航菜单信息及左侧栏路由信息
function reorganizing(data) {
  const navMenus = data.map(item => {
    return {
      ...item,
      path: startPath(item.children)
    }
  }).map(m => {
    return {
      menuId: m.menuId,
      name: m.name,
      path: m.path,
      icon: m.icon
    }
  })
  const sideRoutes = data.map(item => formatAsyncRouter(item.children, item.menuId))
  return {
    navMenus, //[,]
    sideRoutes //[[],[]]
  }
}

// 获取路由起始path
function startPath(asyncRoutes) {
  if (asyncRoutes && asyncRoutes.length) {
    const start = asyncRoutes[0]
    if (start.url && start.url.length) {
      return `/${start.url}`
    } else {
      return startPath(start.children)
    }
  } else {
    return "/"
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
// navMenuId:指明路由归属哪个顶部导航菜单
// isRoot:最顶层组件为Layout
function formatAsyncRouter(asyncRouterMap, navMenuId, isRoot = true) {
  var formatRouter = []
  for (var i = 0; i < asyncRouterMap.length; i++) {
    formatRouter.push(format(asyncRouterMap[i], navMenuId, isRoot))
  }
  return formatRouter
}

function format(asyncRoute, navMenuId, isRoot) {
  var route = {
    name: asyncRoute.url,
    meta: {
      menuId: asyncRoute.menuId,
      title: asyncRoute.name,
      icon: asyncRoute.icon,
      navMenuId
    }
  }
  if (asyncRoute.url && asyncRoute.url.length > 0) {
    if (isRoot) {
      route.path = uniquePath()
      route.name = null
      route.component = Layout
      route.children = formatAsyncRouter([asyncRoute], navMenuId, false)
    } else {
      route.path = `/${asyncRoute.url}`
      route.component = loadView(asyncRoute.url)
    }
  } else {
    route.path = uniquePath()
    if (isRoot) {
      route.component = Layout
    }
  }
  if (asyncRoute.children != null && asyncRoute.children && asyncRoute.children.length) {
    route.children = formatAsyncRouter(asyncRoute.children, navMenuId, false)
  }
  return route
}

// 生成唯一路由path,以提供左侧菜子菜单单个展开功能
function uniquePath(length = 8) {
  return "/" + Number(Math.random().toString().substr(3, 3) + Date.now()).toString(length)
}

// 最终路由:404置尾
function accessing(routes = homeRoutes) {
  const accessed = routes
  accessed.push({
    path: '*',
    redirect: '/404',
    hidden: true
  })
  return accessed
}

// function filterAsyncRouter(asyncRouterMap) {
//   return asyncRouterMap.filter(route => {
//     if (route.component) {
//       // Layout组件特殊处理
//       if (route.component === 'Layout') {
//         route.component = Layout
//       } else {
//         route.component = loadView(route.component)
//       }
//     }
//     if (route.children != null && route.children && route.children.length) {
//       route.children = filterAsyncRouter(route.children)
//     }
//     return true
//   })
// }

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/modules/${view}`], resolve)
}

export default permission
