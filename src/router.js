import VueRouter from 'vue-router'
import homeBlog from './components/HomeBlog'
import Login from './components/login/login'
import certify from './components/certify/index'
import checkin from './components/checkin/index'
import dynamic from './components/dynamic/index'
import order from './components/order/index'
import service from './components/service/index'
import user from './components/user/index'
import version from './components/version/index'

// 1、创建路由对象
var router = new VueRouter( {
    routes:[ 
        {
            path:'/homeBlog', 
            redirect:'/certify',
            component:homeBlog,
             meta: {
                requireAuth:true, 
            },
            children:[
                {
                    path:'/certify',
                    component:certify,
                    meta:{
                        requireAuth:true
                    }
                },
                {
                    path:'/checkin',
                    component:checkin,
                    meta:{
                        requireAuth:true
                    }
                },
                {
                    path:'/dynamic',
                    component:dynamic,
                    meta:{
                        requireAuth:true
                    }
                },
                {
                    path:'/order',
                    component:order,
                    meta:{
                        requireAuth:true
                    }
                },
                {
                    path:'/service',
                    component:service,
                    meta:{
                        requireAuth:true
                    }
                },
                {
                    path:'/user',
                    component:user,
                    meta:{
                        requireAuth:true
                    }
                },
                {
                    path:'/version',
                    component:version,
                    meta:{
                        requireAuth:true
                    }
                }
            ]
        },  
        {
            path:'/', 
            component:Login 
        }
    ]
})

// 2、把路由对象暴露出去
export default router