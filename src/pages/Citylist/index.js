import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import './index.scss'
import axios from 'axios'

// import 'react-virtualized/styles.css'
import { tag, setcity } from '../../utils/'
import { List, AutoSizer } from 'react-virtualized'
import Navheader from '../../components/purpose'
//可视区
// const list = Array(100).fill('惠惠')

function getlist(list) {
  const pairlist = {}
  list.forEach(item => {
    const count = item.short.slice(0, 1)
   
    //判断对象中是否有该属性
    if (count in pairlist) {
      //如果对象里面有分类的话就把数据添加到对应数组中
      pairlist[count].push(item)
    } else {
      //如果没有当前的分类就往{}里创建对应的分类并且把城市里的数据添加到数组
      pairlist[count] = [item]
    }
  })
  //根据城市列表获取到对应的索引
  const indexes = Object.keys(pairlist).sort()
  // console.log(indexes)

  return {
    pairlist,
    indexes
  }
}



//城市分类
function classification(name) {
  switch (name) {
    case '#':
      return '当前城市'
    case 'hot':
      return '热门城市'
    default:
      return name.toUpperCase()
  }
}
const constant = 36
const Planck = 50
export default class Citylist extends Component {
  async componentDidMount() {
    await this.getCityList()
    this.listRef.current.measureAllRows()
  }
  state = {
    pairlist: {},
    indexes: [],
    setIndex: 4
  }
  //城市列表渲染
  async getCityList() {
    const res = await axios.get(`http://localhost:8080/area/city`, {
      params: {
        level: 1
      }
    })
    console.log(res)
    const { pairlist, indexes } = getlist(res.data.body)
    console.log(pairlist)
    console.log(indexes)

    //热门城市
    const hotspot = await axios.get(`http://localhost:8080/area/hot`)
    console.log(hotspot)
    pairlist['hot'] = hotspot.data.body
    indexes.unshift('hot')
    const newtag = await tag()
    // tag().then(data => {
    //   console.log('通过promise获取定位', data)
    // })
    pairlist['#'] = [newtag]
    indexes.unshift('#')

    console.log('通过promise获取定位', newtag)
    this.setState({
      pairlist,
      indexes
    })
  }

  //可视区
  //key:key值
  //index:每一项的城市索引

  rowRenderer = ({ key, index, style }) => {
    const { pairlist, indexes } = this.state

    //拿到城市列表后渲染数据
    const cities = pairlist[indexes[index]]
    // console.log(cities)

    return (
      // 城市列表结构：
      <div key={key} style={style} className="city">
        <div className="title">{classification(indexes[index])}</div>
        {cities.map(item => {
          return (
            <div
              className="name"
              key={item.value}
              onClick={() => this.town(item)}
            >
              {item.label}
            </div>
          )
        })}
      </div>
    )
  }
  //当前定位城市
  town = item => {
    // console.log('惠惠', item)

    if (['北京', '上海', '广州', '深圳'].indexOf(item.label) > -1) {
      const stored = {
        label: item.label,
        value: item.value
      }
      setcity(stored)
      this.props.history.go(-1)
    } else {
      Toast.info('没有该数据', 1)
    }
  }

  //城市列表高度
  calcRowHeight = ({ index }) => {
    const { pairlist, indexes } = this.state
    const cities = pairlist[indexes[index]]
    console.log(cities.length)

    return constant + Planck * cities.length
  }
  skim = index => {
    this.listRef.current.scrollToRow(index)
  }
  //右侧索引高亮
  hightlist = () => {
    const { indexes, setIndex } = this.state
    return indexes.map((item, index) => {
      return (
        <li
          className="city-index-item"
          key={item}
          onClick={() => this.skim(index)}
        >
          <span className={setIndex === index ? 'index-active' : ''}>
            {item === 'hot' ? '热门' : item.toUpperCase()}
          </span>
        </li>
      )
    })
  }
  //通过滑动获取右侧的索引
  onRowsRendered = ({ startIndex }) => {
    if (this.state.setIndex !== startIndex) {
      this.setState({
        setIndex: startIndex
      })
    }
  }
  listRef = React.createRef()
  render() {
    return (
      <div className="citylist">
        <Navheader>城市选择</Navheader>
        {/* // 右侧城市索引列表： */}
        <ul className="city-index">{this.hightlist()}</ul>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.listRef}
              onRowsRendered={this.onRowsRendered}
              height={height - 45}
              rowCount={this.state.indexes.length}
              rowHeight={this.calcRowHeight}
              rowRenderer={this.rowRenderer}
              width={width}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}
