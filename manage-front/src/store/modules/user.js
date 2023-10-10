import {
  login,
  logout,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    logging: false,
    name: '',
    ifAdmin: null,
    ifGov: undefined,
    deptId: null,
    avatar: '',
    roles: [],
    version: 1,
    coordinate: {
      lng: undefined,
      lat: undefined
    },
    permissions: [],
    companyId: undefined,
    area: null,
    provinceName: undefined,
    cityName: undefined,
    areaName: undefined,
    province_city_area_Name: undefined
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_LOGGING: (state, logging) => {
      state.logging = logging
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_VERSION: (state, version) => {
      state.version = version
    },
    SET_COORDINATE: (state, coordinate) => {
      state.coordinate = coordinate
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_IFADMIN: (state, ifAdmin) => {
      state.ifAdmin = ifAdmin
    },
    SET_IFGOV: (state, ifGov) => {
      state.ifGov = ifGov
    },
    SET_DEPTID: (state, deptId) => {
      state.deptId = deptId
    },
    SET_COMPANYID: (state, companyId) => {
      state.companyId = companyId
    },
    SET_AREA: (state, area) => {
      state.area = area
    },
    SET_PROVINCENAME: (state, provinceName) => {
      state.provinceName = provinceName
    },
    SET_CITYNAME: (state, cityName) => {
      state.cityName = cityName
    },
    SET_AREANAME: (state, areaName) => {
      state.areaName = areaName
    },
    SET_province_city_area: (state, province_city_area_Name) => {
      state.province_city_area_Name = province_city_area_Name
    },
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        commit('SET_LOGGING', true)
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          commit('SET_LOGGING', false)
          resolve()
        }).catch(error => {
          commit('SET_LOGGING', false)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const result = res.result
          const avatar = !result.avatar ? require("@/assets/image/profile.jpg") : process.env.VUE_APP_BASE_API + result.avatar;
          if (result.roles && result.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', result.roles)
            commit('SET_PERMISSIONS', result.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_IFADMIN', result.ifAdmin)
          commit('SET_IFGOV', result.ifGov)
          commit('SET_DEPTID', result.deptId)
          commit('SET_NAME', result.name)
          commit('SET_AVATAR', avatar)
          commit('SET_VERSION', result.version || 1)
          commit('SET_COMPANYID', result.companyId)
          commit('SET_COORDINATE', {
            lng: result.posX ? result.posX : 116.404844,
            lat: result.posY ? result.posY : 39.897445
          })
          commit('SET_AREA', {
            provinceId: result.provinceId,
            cityId: result.cityId,
            areaId: result.areaId,
            streetId: result.streetId,
          })
          commit('SET_PROVINCENAME', result.provinceName || undefined)
          commit('SET_CITYNAME', result.cityName || undefined)
          commit('SET_AREANAME', result.areaName || undefined)
          if (result.areaName) {
            commit('SET_province_city_area', result.provinceName + result.cityName + result.areaName || undefined)
          } else if (result.cityName && !result.areaName) {
            commit('SET_province_city_area', result.provinceName + result.cityName || undefined)
          } else {
            commit('SET_province_city_area', result.provinceName || undefined)
          }
          resolve(res.result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_LOGGING', false)
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          commit('SET_LOGGING', false)
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_LOGGING', false)
        removeToken()
        resolve()
      })
    }
  }
}

export default user
