import Vue from 'vue'
import Vuex from 'vuex'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import config from '../firebase/config'

firebase.initializeApp(config)
Vue.use(Vuex)


/* 
	Vuex store is a singleton object that holds the state of the application 
	and can be accessed by all components of the application via this.$store. 
*/
export default new Vuex.Store({
  state: {    
    user: firebase.auth().currentUser,
    db: firebase.firestore(),
    messages: []
  },
  getters: {
    db: state => state.db
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload
    },
    SET_MESSAGES(state, payload) {
			state.messages = payload;
		}
  },
  actions: {
    async login(context) {
			const provider = new firebase.auth.GoogleAuthProvider();
			const res = await firebase.auth().signInWithPopup(provider);
			if (res) {
				context.commit('SET_USER', res.user)
			} else {
				throw new Error("couldn't login")
			}
		},
    async logout(context) {
      await firebase.auth().signOut();
      context.commit('SET_USER', firebase.auth().currentUser)
    },
    async sendMsg(context, mgsInfo) {
      this.getters.db.collection('messages').add(mgsInfo)
    },
    async updateMsg(context, messages) {
      context.commit('SET_MESSAGES', messages);
    },
    async updateUser(context, payload) {
			context.commit('SET_USER', payload);
		},
  },

  // modules are used to split the state into smaller parts
  modules: {}
})
