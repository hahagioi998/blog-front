import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken,setTokenTobs, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
      roles: [],
      introduction: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
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
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {


     /*   setTokenTobs('csrftoken','VqP4TydAW3uftdzEVZvxLDhoQXhbvfX2cERSatrl6SAcDUHaUtaMciNn2NMUjHyk')
        setTokenTobs('sessionid','ep0udvbc02j00he4ghhsycms4qleqk7g')*/
      login({ username: username.trim(), password: password }).then(response => {
        let success = response.success;
        if(success){
          const { data } = response;
          commit('SET_TOKEN', data.username)
          commit('SET_NAME',data.username)
          setToken(data.username)
          //avatar
          commit('SET_AVATAR','@/assets/img/freedom.js')
          //roles
          let rolesResult = [];
          for (let i = 0; i < data.authorities.length; i++) {
            rolesResult.push(data.authorities[i].authority);
          }
          commit('SET_ROLES', rolesResult)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })



    })
  },

/*
  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      const data = {
        roles: ['test'],
        introduction: 'I am a super administrator',
        avatar: '@/assets/img/freedom.js',
        name: 'Super Admin'
      }
        commit('SET_NAME',data.name)
        commit('SET_AVATAR',data.avatar)
        commit('SET_ROLES', data.roles)
        commit('SET_INTRODUCTION', data.introduction)
        resolve(data)
      /!* getInfo(state.token).then(response => {
         const {data} = response

         if (!data) {
           reject('Verification failed, please Login again.')
         }

         const {name, avatar} = data

         commit('SET_NAME', name)
         commit('SET_AVATAR', '@/assets/img/freedom.js')
         resolve(data)
       }).catch(error => {
         reject(error)
       })*!/
    })
  },
*/

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {

      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        commit('SET_ROLES', [])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

