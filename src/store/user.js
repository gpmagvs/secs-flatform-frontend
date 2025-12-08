import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    name: '',
    email: ''
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,

    userInfo: (state) => {
      return `${state.name} (${state.email})`
    }
  },

  actions: {
    setToken(token) {
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    setUser(name, email) {
      this.name = name
      this.email = email
    },

    login(token, userInfo) {
      this.setToken(token)
      if (userInfo) {
        this.setUser(userInfo.name, userInfo.email)
      }
    },

    logout() {
      this.token = ''
      this.name = ''
      this.email = ''
      localStorage.removeItem('token')
    },

    clearUser() {
      this.name = ''
      this.email = ''
    }
  }
})

