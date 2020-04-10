import React, { Component } from 'react'
//标签栏的组件
import { TabBar } from 'antd-mobile'
import { Route } from 'react-router-dom'
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'
import './home.css'

const tabs = [
  { path: '/home', title: '首页', icon: 'icon-ind' },
  { path: '/home/houseList', title: '找房', icon: 'icon-findHouse' },
  { path: '/home/news', title: '咨询', icon: 'icon-infom' },
  { path: '/home/profile', title: '我的', icon: 'icon-my' }
]
export default class Home extends Component {
  //selectedTab 表示标签栏的图标是否当前被选中
  //hidden 表示标签栏是否隐藏
  //fullScreen 表示标签栏是否调整高度
  state = {
    selectedTab: this.props.location.pathname,
    hidden: false,
    fullScreen: true
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
  render() {
    return (
      <div className="home">
        <Route path="/home" exact component={Index}></Route>
        <Route path="/home/houseList" component={HouseList}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        <div className="home_position">
          <TabBar
            tintColor="blue"
            barTintColor="#fff"
            hidden={this.state.hidden}
          >
            {tabs.map(item => {
              return (
                <TabBar.Item
                  title={item.title}
                  key="Life"
                  icon={<i className={` iconfont ${item.icon} `}></i>}
                  selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                  selected={this.state.selectedTab === item.path}
                  onPress={() => {
                    // console.log('惠惠', this.props)
                    this.props.history.push(item.path)
                  }}
                  data-seed="logId"
                ></TabBar.Item>
              )
            })}
          </TabBar>
        </div>
      </div>
    )
  }
}
