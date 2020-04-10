/**
 * 封装 鉴权路由组件，来实现登录访问控制
 *  只有登录了，才允许访问该路由；
 *  如果没有登录，就重定向到 登录页面 让用户登录
 */

// 创建函数组件
import React from 'react'

import { Route, Redirect } from 'react-router-dom'
import { isAth } from '../../utils'

// 1 在react路由中，路由就是通过 Route 组件来封装的，所以，AuthRoute组件
//   仅仅是对 Route 组件的一个封装而已
//   所以，需要导入 Route 组件

// 2 Route 组件的使用方式：
//   <Route path="/a" copmonent={A} />
//   为了使用方便，我们自己封装的 AuthRoute 组件需要与 Route 组件的使用方式完全相同
//   <AuthRoute path="/a" component={A} />
//   那么，component 属性的值，就是要渲染的组件
//   因为 component 属性表示一个组件，所以，要当成组件来渲染，就必须保证首字母大写
//   所以，我们给 component 属性，进行重命名修改为 首字母大写的方式
export default function Atken({ component: Component, ...rest }) {
  // props => { path: '/a', component: A }
  // ...res 表示： 获取到 props 对象中，除了 component 意外的所有属性

  // 3 render 属性，可以通过一个回调函数来使用
  //   回调函数的参数： 就是当前的路由信息
  //   回调函数的返回值： 就是当前路由要渲染的内容
  return (
    <Route
      {...rest}
      render={data => {
        // 4 判断有没有登录
        //  4.1 如果登录了，就渲染当前组件
        //  4.2 如果没有登录，就重定向到 登录页面，让用户登录
        if (isAth()) {
          // 登录
          // 渲染当前组件，问题： 当前组件是谁？？？
          // 因为 component 属性的值，就是 A 组件，所以，此处，componet 是一个组件
          // 相当于就是在： return <A />
          return <Component {...data} />
        } else {
          // 没有登录
          // 重定向到 登录页面，那么，就需要使用 Redirect 组件
          // 注意： to 属性的值可以是一个对象，用来表示要跳转到路由的信息
          return (
            <Redirect
              to={{
                // 表示： 要跳转到的路由，/login 就表示登录页面的路由
                pathname: '/login',
                // 添加一个额外的信息，用来告诉 登录页面，登录成功后，跳转到哪
                state: { from: data.location }
              }}
            />
          )
        }
        // return ???
      }}
    />
  )
}

