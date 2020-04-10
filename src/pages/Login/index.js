import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

import { withFormik } from 'formik';

import * as yup from 'yup';

import { API,storageToken } from '../../utils'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  // state = {
  //   // 账号
  //   username: 'test2',
  //   // 密码
  //   password: 'test2'
  // }

  // // 处理账号
  // handleUserName = e => {
  //   this.setState({
  //     username: e.target.value
  //   })
  // }

  // // 处理密码
  // handlePassword = e => {
  //   this.setState({
  //     password: e.target.value
  //   })
  // }

  // // 表单提交
  // handleSubmit = async e => {
  //   // 注意： 表单有一个行为，就是自动提交表单，刷新页面。 而现在，我们希望自己发送 ajax 请求
  //   //       来实现登录，所以，就需要阻止浏览器的默认行为
  //   e.preventDefault()

  //   const { username, password } = this.state

  //   const res = await API.post('/user/login', {
  //     username,
  //     password
  //   })

  //   const { status, description, body } = res.data

  //   if (status === 200) {
  //     // 登录成功
  //     // 1 保存token到本地缓存中
  //     localStorage.setItem('itcast_token', body.token)
  //     // 2 返回到上一个页面
  //     this.props.history.go(-1)
  //   } else if (status === 400) {
  //     // 登录失败
  //     Toast.info(description, 1)
  //   }
  //   // else if (status == xxx) {} ...
  // }

  render() {
  //  console.log(this.props);
   const {values,handleSubmit,handleChange,errors,touched,handleBlur} = this.props
   //touched失去焦点为布尔值
  //  console.log(touched);
   
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                placeholder="请输入账号"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
          {touched &&  <div className={styles.error}>{errors.username}</div>}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
           {touched  &&  <div className={styles.error}>{errors.password}</div>}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

Login = withFormik({
  //该提供项是给表单提供的状态，也是指定表单项对应的值
  mapPropsToValues: ()=>({
    username:'test2',
    password:'test2'
  }),
  //添加表单的校验
  //shape表示校验什么样的结构也就是说有什么属性就校验什么类型的属性
  //matches表单的校验规则
  validationSchema:yup.object().shape({
    username:yup.string().required('请输入账号为必填项').matches(REG_UNAME,'长度为5到8位，只能出现数字、字母、下划线'),
    password:yup.string().required('密码不能为空').matches(REG_PWD,'长度为5到12位，只能出现数字、字母、下划线')
  }),
  //表单的提交事件
  handleSubmit: async (values, {props}) =>{
    const { username, password } = values

    const res = await API.post('/user/login', {
      username,
      password
    })


    const { status, description, body } = res.data

    if (status === 200) {
      // 登录成功
      // 1 保存token到本地缓存中
      storageToken(body.token)
      // 2 返回到上一个页面

      //判断是否从定项来的
      if ( props.location.state) {
        props.history.replace(props.location.state.from.pathname)
        console.log('返回上重订项');
        
      } else {
        props.history.go(-1)
      }
    } else if (status === 400) {
      // 登录失败
      Toast.info(description, 1)
    }
    
    
  }
 
})(Login)
export default Login
