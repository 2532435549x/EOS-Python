import _Promise from 'babel-runtime/core-js/promise';
import { login, logout, getInfo } from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';

var user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: function SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_NAME: function SET_NAME(state, name) {
      state.name = name;
    },
    SET_AVATAR: function SET_AVATAR(state, avatar) {
      state.avatar = avatar;
    },
    SET_ROLES: function SET_ROLES(state, roles) {
      state.roles = roles;
    }
  },

  actions: {
    // 登录
    Login: function Login(_ref, userInfo) {
      var commit = _ref.commit;

      var username = userInfo.username.trim();
      return new _Promise(function (resolve, reject) {
        login(username, userInfo.password).then(function (response) {
          var data = response.data;
          setToken(data.token);
          commit('SET_TOKEN', data.token);
          resolve();
        }).catch(function (error) {
          reject(error);
        });
      });
    },


    // 获取用户信息
    GetInfo: function GetInfo(_ref2) {
      var commit = _ref2.commit,
          state = _ref2.state;

      return new _Promise(function (resolve, reject) {
        getInfo(state.token).then(function (response) {
          var data = response.data;
          if (data.roles && data.roles.length > 0) {
            // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles);
          } else {
            reject('getInfo: roles must be a non-null array !');
          }
          commit('SET_NAME', data.name);
          commit('SET_AVATAR', data.avatar);
          resolve(response);
        }).catch(function (error) {
          reject(error);
        });
      });
    },


    // 登出
    LogOut: function LogOut(_ref3) {
      var commit = _ref3.commit,
          state = _ref3.state;

      return new _Promise(function (resolve, reject) {
        logout(state.token).then(function () {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve();
        }).catch(function (error) {
          reject(error);
        });
      });
    },


    // 前端 登出
    FedLogOut: function FedLogOut(_ref4) {
      var commit = _ref4.commit;

      return new _Promise(function (resolve) {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    }
  }
};

export default user;