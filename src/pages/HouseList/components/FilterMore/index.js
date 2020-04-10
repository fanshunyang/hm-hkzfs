import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

import classnames from 'classnames'

export default class FilterMore extends Component {
 state = {
   screen:this.props.selted
 }
 handclick= (id)=> {
   const {screen} = this.state
   let newscreen
 if (screen.indexOf(id) > -1) {
  //screen数组中存储的是id item就是选中项id
  newscreen =  screen.filter(item=> item !==id)
     
  } else {
    newscreen = [...screen,id]
    this.setState({
      screen: newscreen
    })
  }
 }
  // 渲染标签
  renderFilters(data) {
    console.log(data);
    
    // 高亮类名： styles.tagActive
    return data.map(item => {
      //如果类名在数组中就高亮
     const isselted = this.state.screen.indexOf(item.value) > -1
    return  <span onClick={() =>this.handclick(item.value)} key={item.value} 
    className={classnames(styles.tag,{
    [ styles.tagActive]:isselted
    })}>{item.label}</span>
    })
  }

  render() {
    // console.log(this.props);
   const {data:{roomType,oriented,floor,characteristic},mask} = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={()=>mask()} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter className={styles.footer} cancelText='清除' onCancel={()=> {
          this.setState({
            screen:[]
          })                      
        }} onOk={()=> this.props.Filtertype(this.state.screen)} />
      </div>
    )
  }
}
