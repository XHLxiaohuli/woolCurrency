import * as types from '../types'
import api from '../../api'
import {Toast} from 'mint-ui'

export default{
  state:{
    position:""
  },
  mutations:{
    [types.SAVE_POSITION](state,action){
      state.position=action.position
    }
  },
  actions: {
    /*getOpenId({commit}, params){
      api.wx.getOpenId(params).then((res)=>{
          commit(types.GET_OPEN_ID,res.data.openid)
          Toast(res.data.openid)
      }).catch((error)=>{
          // Toast("网络")
      })
    },*/
  },
  getters:{
    /*getOpenId:state=>{
      return state.openid
    }*/
  }

}
