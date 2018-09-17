import Vue from 'vue'
import Router from 'vue-router'

import bottomtab from'@/page/bottomtabPage/bottomtab'
import vote from'@/page/votePage/vote'
import home from'@/page/homePage/home'
import me from'@/page/mePage/me'
import loginAndRegister from'@/page/LoginAndRegister/loginAndRegister'
import oneForgetThePassword from'@/page/forgetThePassword/oneForgetThePassword'
import towForgetThePassword from'@/page/forgetThePassword/towForgetThePassword'
import userCenter from'@/page/userCenter/userCenter'
import modifyUserName from'@/page/userCenter/modifyUserName'
import oneReplacePhone from'@/page/replacePhone/oneReplacePhone'
import towReplacePhone from'@/page/replacePhone/towReplacePhone'
import threeReplacePhone from'@/page/replacePhone/threeReplacePhone'
import passwordManagement from'@/page/userCenter/passwordManagement'
import meReleaseProject from'@/page/mePage/meReleaseProject'
import meCollection from'@/page/mePage/meCollection'
import invitingFriends from'@/page/mePage/invitingFriends'
import newCoinList from'@/page/mePage/newCoinList'
import callCustomerService from'@/page/mePage/callCustomerService'
import feedback from'@/page/mePage/feedback'
import meAssets from'@/page/mePage/meAssets'
import purse from'@/page/mePage/purse'
import rresentRecord from'@/page/mePage/rresentRecord'
import giveDetails from'@/page/mePage/giveDetails'
import acquisitionOfRecords from'@/page/mePage/acquisitionOfRecords'
import invitingDetails from'@/page/mePage/invitingDetails'
import invitationToRegister from'@/page/mePage/invitationToRegister'
import YqZcFl from'@/page/mePage/YqZcFl'
import realName from'@/page/mePage/realName'
import bulletinCenter from'@/page/homePage/bulletinCenter'
import recommendableProjects from'@/page/votePage/recommendableProjects'
import post from'@/page/homePage/post'
import details from'@/page/homePage/details'
import announcement from'@/page/homePage/announcement'
import signIn from'@/page/signInPage/signIn'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/', redirect: '/bottomtab/vote'
    },
    {
      path: '/bottomtab',
      name: 'bottomtab',
      component: bottomtab,
      children:[
        { path: 'vote', component: vote },
        { path: 'home', component: home, /*meta:{keepAlive: true}*/ },
        { path: 'me', component: me },
      ]
    },{
      path: '/loginAndRegister',
      name: 'loginAndRegister',
      component: loginAndRegister
    },{
      path: '/oneForgetThePassword',
      name: 'oneForgetThePassword',
      component: oneForgetThePassword
    },{
      path: '/towForgetThePassword',
      name: 'towForgetThePassword',
      component: towForgetThePassword
    },{
      path: '/userCenter',
      name: 'userCenter',
      component: userCenter
    },{
      path: '/modifyUserName',
      name: 'modifyUserName',
      component: modifyUserName
    },{
      path: '/oneReplacePhone',
      name: 'oneReplacePhone',
      component: oneReplacePhone
    },{
      path: '/towReplacePhone',
      name: 'towReplacePhone',
      component: towReplacePhone
    },{
      path: '/threeReplacePhone',
      name: 'threeReplacePhone',
      component: threeReplacePhone
    },{
      path: '/passwordManagement',
      name: 'passwordManagement',
      component: passwordManagement
    },{
      path: '/meReleaseProject',
      name: 'meReleaseProject',
      component: meReleaseProject
    },{
      path: '/meCollection',
      name: 'meCollection',
      component: meCollection
    },{
      path: '/invitingFriends',
      name: 'invitingFriends',
      component: invitingFriends
    },{
      path: '/newCoinList',
      name: 'newCoinList',
      component: newCoinList
    },{
      path: '/callCustomerService',
      name: 'callCustomerService',
      component: callCustomerService
    },{
      path: '/feedback',
      name: 'feedback',
      component: feedback
    },{
      path: '/bulletinCenter',
      name: 'bulletinCenter',
      component: bulletinCenter
    },{
      path: '/meAssets',
      name: 'meAssets',
      component: meAssets
    },{
      path: '/purse',
      name: 'purse',
      component:purse
    },{
      path: '/rresentRecord/:isUserId',
      name: 'rresentRecord',
      component:rresentRecord
    },{
      path: '/giveDetails/:myindex',
      name: 'giveDetails',
      component:giveDetails
    },{
      path: '/acquisitionOfRecords',
      name: 'acquisitionOfRecords',
      component:acquisitionOfRecords
    },{
      path: '/recommendableProjects',
      name: 'recommendableProjects',
      component:recommendableProjects
    },{
      path: '/signIn',
      name: 'signIn',
      component:signIn
    },{
      path: '/post',
      name: 'post',
      component:post
    },{
      path: '/details',
      name: 'details',
      component:details
    },{
      path: '/announcement',
      name: 'announcement',
      component:announcement
    },{
      path: '/invitingDetails',
      name: 'invitingDetails',
      component:invitingDetails
    },{
      path: '/invitationToRegister/:code',
      name: 'invitationToRegister',
      component:invitationToRegister
    },{
      path: '/YqZcFl',
      name: 'YqZcFl',
      component:YqZcFl
    },{
      path: '/realName',
      name: 'realName',
      component:realName
    }
  ],
})
