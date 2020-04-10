import React, { Component } from 'react'
import Navheader from '../../components/purpose'
import HouseItem from '../../components/HosItem'
// import './index.scss'
//导入 module的scss
import styles from './index.module.scss'
import axios from 'axios'
import { tag } from '../../utils/index'
import cls from 'classnames'
const BMap = window.BMap

// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}
export default class Map extends Component {
  state = {
    isShow: false,
    list: []
  }
  async componentDidMount() {
    //label表示的是当前城市
    //value表示的是当前城市的id
    const { label, value } = await tag()
    const map = new BMap.Map('container')
    this.map = map
    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图的城市信息和id
    //myGeo.getPoint(第一个参数是城市的地址信息，第二个参数是一个回调函数，第三个参数是所在的城市)
    myGeo.getPoint(
      null,
       point => {
        if (point) {
          map.centerAndZoom(point, 11)
          // map.addOverlay(new BMap.Marker(point))
          this.renderOverlays(value)
          //比利尺的控件
          map.addControl(new BMap.ScaleControl())
          //地图平移的控件
          map.addControl(new BMap.NavigationControl())
        }
      },
      label
    )
    map.addEventListener('movestart', () => {
      if (this.state.isShow) {
        this.setState({
          isShow: false
        })
      }
    })
  }
  //渲染覆盖物
  async renderOverlays(id) {
    //发送请求
    const { type, zoom } = this.getTypeAndZoom()
    const res = await axios.get(`http://localhost:8080/area/map`, {
      params: {
        id: id
      }
    })
    console.log(res)
    //注意这个遍历是因为每一个区都需要覆盖物所以需要遍历所有区的数据 来渲染覆盖物
    res.data.body.forEach(item => {
      //这是因为createOverlays需要区别渲染覆盖物
      this.createOverlays(item, type, zoom)
    })
  }

  // 计算类型和缩放类型
  getTypeAndZoom() {
    const leavel = this.map.getZoom()
    let zoom
    let type
    if (leavel === 11) {
      zoom = 13
      type = 'citcle'
    } else if (leavel === 13) {
      zoom = 15
      type = 'citcle'
    } else {
      type = 'orthogon'
    }
    return {
      zoom,
      type
    }
  }
  //创建覆盖物
  createOverlays(item, type, zoom) {
    const {
      label,
      value,
      count,

      coord: { latitude, longitude }
    } = item
    //获取数据的坐标
    const point = new BMap.Point(longitude, latitude)
    console.log(point);

    if (type === 'citcle') {
     
      //这是区镇的覆盖物

      this.createCircle(label, value, count, point, zoom)
    } else {
      //这是小区的覆盖物
      this.createRect(label, value, count, point)
    }
  }
  //创建区镇的覆盖物
  createCircle(areaname, id, count, point, zoom) {
    //添加文本标注
    const opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-35, -35) //设置文本偏移量
    }
    console.log(opts);
    
    const label = new BMap.Label('', opts) // 创建文本标注对象
   console.log(label);
   
    //给label设置html结构从而进行圆形效果的覆盖
    label.setContent(`
     <div class="${styles.bubble}">
       <p class="${styles.name}">${areaname}</p>
       <p>${count}套</p>
     </div>
     `)

    //给覆盖物添加样式
    label.setStyle(labelStyle)

    //给label添加点击事件
    label.addEventListener('click', () => {
      console.log('惠惠', id, zoom)
      this.map.centerAndZoom(point, zoom)
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
      this.renderOverlays(id)
    })

    //将覆盖物添加到地图中
    this.map.addOverlay(label)
  }
  //创建小区的覆盖物
  createRect(name, id, count, point) {
    //添加文本标注
    const opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -28) //设置文本偏移量
    }
    const label = new BMap.Label('', opts) // 创建文本标注对象

    // 小区长方形效果的覆盖物结构：
    label.setContent(`
    <div class="${styles.rect}">
      <span class="${styles.housename}">${name}</span>
      <span class="${styles.housenum}">${count}</span>
      <i class="${styles.arrow}"></i>
    </div>
    `)

    //给覆盖物添加样式
    label.setStyle(labelStyle)

    //给label添加点击事件
    label.addEventListener('click', e => {
      console.log('惠惠', id)
      // this.map.centerAndZoom(point)
      // this.renderOverlays(id)
      //展示地图的平移将该小区展示到地图中心
      const x1 = window.innerWidth / 2
      const y1 = (window.innerHeight - 330) / 2
      console.log(e)
      const { clientX, clientY } = e.changedTouches[0]
      const x = x1 - clientX
      const y = y1 - clientY
      this.map.panBy(x, y)
      //发送请求获取小区房源列表数据
      this.Parameters(id)
      //展示小区房源的结构
      this.setState({
        isShow: true
      })
    })

    //将覆盖物添加到地图中
    this.map.addOverlay(label)
  }
  async Parameters(id) {
    const res = await axios.get(`http://localhost:8080/houses`, {
      params: {
        cityId: id
      }
    })
    console.log(res)
    this.setState({
      list: res.data.body.list
    })
  }
  renderlist() {
    //注意列表渲染遍历的时候key值是跟遍历对应的
    return this.state.list.map(item => <HouseItem  key={item.houseCode} {...item}></HouseItem>)
  }
  render() {
    return (
      <div className={styles.map}>
        {/* 顶部导航 */}
        <Navheader className={styles.mapheader}>地图找房</Navheader>
        <div id="container" className={styles.container} />
        {/* // 房屋列表结构 */}
        <div
          className={cls(styles.houseList, {
            [styles.show]: this.state.isShow
          })}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>{this.renderlist()}</div>
        </div>
      </div>
    )
  }
}
