import React, { Component } from 'react'

import { Flex,Toast } from 'antd-mobile'
import { List, AutoSizer,WindowScroller,InfiniteLoader } from 'react-virtualized'
import NoHouse from '../../components/NoHouse'
import SearchHeader from '../../components/searchheader'
import Filter from './components/Filter'
import styles from './index.module.scss'
import axios from 'axios'
import {tag} from '../../utils'
import HosItem from  '../../components/HosItem'
import Stkin from '../../components/Stkin'
export default class HouseList extends Component {
  state = {
    //列表数据
    list: [],
    count: 0,
    isloding:false,
    //这里提供一个状态方便调取
    cityName:''
  }
 async componentDidMount() {
   const {label} = await tag()

   this.setState({
    cityName:label
   })
    //进入房源获取到数据
    this.juqerobj()
  }
  //每次筛选条件的时候让数据返回到最顶部
  
  OnNewObj = (NewObj)=> {
    // console.log(NewObj);
    window.scrollTo(0,0)
    this.NewObj = NewObj
    this.juqerobj()
  }
  //发请求
  async juqerobj() {
    const {value} = await tag() 
    //开启loading
    Toast.loading('加载中',0)
   //数据没有加载的时候让isloding为false
     this.setState({
       isloding:false
     })
     const res = await axios.get(`http://localhost:8080/houses`,{
       params : {
         //这里把NewObj存起来
         ...this.NewObj,
         cityId:value,
         start : 1,
         end: 20
       }
     })
     //关闭
     Toast.hide()
     console.log(res);
     const {list,count, } = res.data.body
    if (count!==0) {
     Toast.info(`共找到 ${count} 套房源`,1)
    } 
     this.setState({
       list,
       count,
       isloding:true
     })
  }

  rowRenderer=({ key, index, style })=>{
    const {list} = this.state
    const data = list[index]
    //这是因为数组的下标最大为35如果你将继续快速滑动的话会超过这个索引导致组件的校验会报错
  // console.log(list,index);
     if (data) {
       //如果有数据的话就让它继续执行
    return <HosItem 
    onClick={()=>this.props.history.push(`/detail/${data.houseCode}`)} 
    {...data}  
    key={key} style={style}
    ></HosItem>
     } else {
      //如果没有数据的话放个占位符就可以了
      return <div key={key} style={style} >
        <div className={styles.loding} />
      </div>
     }
  }


//渲染房源列表
  NOplaeHouse() {
    const {count,isloding} = this.state
  
    console.log(count ===0);
    //这里的 && 和|| 是根据自己需要的数据状态如果&&的话那么就执行后面数据如果是||的话会执行前面的数据状态.
    if (isloding && count ===0) {
    
    return <NoHouse>没有该数据请换个搜索条件吧~~</NoHouse>
    } else {
    return  <InfiniteLoader
      isRowLoaded={this.isRowLoaded}
      loadMoreRows={this.loadMoreRows}
      rowCount={this.state.count}
      minimumBatchSize = {15}
      > 
         {({onRowsRendered, registerChild})=>(
             <WindowScroller>
             {({height, isScrolling, scrollTop})=>(
                  <AutoSizer>
                  {({  width }) => (
                    <List
                      autoHeight
                      ref={ registerChild}
                      isScrolling = {isScrolling}
                      scrollTop = {scrollTop}
                      width={width}
                      height={height - 45}
                      rowCount={this.state.count}
                      rowHeight={120}
                      rowRenderer={this.rowRenderer}
                      onRowsRendered={onRowsRendered}
    
                    />
                  )}
                </AutoSizer>
             )}
           </WindowScroller>
         )}
      </InfiniteLoader>
    }
    
  }

  
    //确定列表中是否完成
    isRowLoaded=({ index })=> {
      return !!this.state.list[index]
    }
     //加载更多数据
   loadMoreRows=({ startIndex, stopIndex })=> {
    return new Promise ( async resolve => {
      console.log(startIndex, stopIndex);
      
      //发送请求拿数据
      const {value} = await tag() 
      const res = await axios.get(`http://localhost:8080/houses`,{
        params : {
          //这里把NewObj存起来
          ...this.NewObj,
          cityId:value,
          start : startIndex,
          end: stopIndex
        }
      })
      console.log(res);
      
     const {list,count } = res.data.body
       this.setState({
        list:[...this.state.list, ...list],
        count
       })
       console.log(list,count);
       
      //数据加载完成
      resolve()
    })  
  }
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部搜索导航栏 */}
        <Flex className={styles.headerWrap}>
          <i className="iconfont icon-back"></i>
          <SearchHeader className={styles.header} cityName={this.state.cityName} />
        </Flex>
        {/* //条件栏目组件 */}
        {/* <Filter OnNewObj={this.OnNewObj}></Filter> */}
        {/* 固定导航栏 */}
        <Stkin height={40}>
        <Filter OnNewObj={this.OnNewObj}></Filter>
        </Stkin>
        {/* 房源列表 */}
        
     {this.NOplaeHouse()}
      </div>
    )
  }
}
