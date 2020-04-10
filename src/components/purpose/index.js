import React from 'react'
import { NavBar } from 'antd-mobile'
import './index.scss'
import { withRouter } from 'react-router-dom'
import Types from 'prop-types'

//导入处理类名的包
import cls from 'classnames'
function Navheader(props) {
  console.log('导出的组件', props)

  return (
    <div
      className={cls('navheader', {
        [props.className]: !!props.className
      })}
    >
      <NavBar
        mode="light"
        icon={<i className="iconfont icon-back"></i>}
        onLeftClick={() => props.history.go(-1)}
      >
        {props.children}
      </NavBar>
    </div>
  )
}

//用prop-types 用来校验
Navheader.propTypes = {
  //约定children是字符串和必填项
  children: Types.string.isRequired
}
//导出的是高阶组件被包装后的组件
export default withRouter(Navheader)
