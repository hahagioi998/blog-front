import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, setTokenTobs, removeToken, setCookieInfo, getCookieInfo,removeCookieInfo} from '@/utils/auth'
import {resetRouter} from '@/router'
import store from "../index";

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
            login({username: username.trim(), password: password}).then(response => {
                let success = response.success;
                if (success) {
                    const {data} = response;
                    commit('SET_TOKEN', data.username)
                    let rolesResult = [];
                    for (let i = 0; i < data.authorities.length; i++) {
                        rolesResult.push(data.authorities[i].authority);
                    }
                    let stringify = JSON.stringify(rolesResult);
                    setToken(data.username)
                    setCookieInfo("user_username",  data.username);
                    setCookieInfo("user_avatar", store.getters.avatar);
                    setCookieInfo("user_roles", stringify);
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })


        })
    },

      // get user info
      getInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            let username = getCookieInfo("user_username");
            let avatar = getCookieInfo("user_avatar");
            let rolesStr = getCookieInfo("user_roles");
            let roles = JSON.parse(rolesStr);
            commit('SET_TOKEN',username);
            commit('SET_NAME', username);
            commit('SET_AVATAR', avatar);
            commit('SET_ROLES', roles);
            resolve()
        })
      },

    // user logout
    logout({commit, state}) {
        return new Promise((resolve, reject) => {

            logout().then(() => {
                removeToken() // must remove  token  first
                removeCookieInfo("user_username")
                removeCookieInfo("user_avatar")
                removeCookieInfo("user_roles")
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

