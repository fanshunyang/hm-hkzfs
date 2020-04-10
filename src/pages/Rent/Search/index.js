import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import {API, getcity } from '../../../utils'
import _ from 'lodash'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getcity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  searchlost = _.debounce( async (searchTxt)=>{
    const res = await API.get(`/area/community`,{
      params:{
        name:searchTxt,
        id:this.cityId
      }
    })
    console.log(res);
    this.setState({
      tipsList:res.data.body
    })
  },500)
  hanndchange = async (searchTxt)=>{
    this.setState({
      searchTxt
    })

    if (!searchTxt.trim()) {
      return this.setState({
        tipsList: []
      })
    }
     this.searchlost(searchTxt)
  }

   
  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip} onClick={()=>{
        console.log(item);
        const {community:communityId, communityName } = item
        this.props.history.replace('/rent/add',{
          communityId,
          communityName
        })
      }}>
        {item.communityName}
      </li>
    ))
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.hanndchange}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}




