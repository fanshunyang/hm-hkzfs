import React, { Component } from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import axios from 'axios'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import './index.scss'
import SearchHeader from '../../components/searchheader'

import { tag } from '../../utils/index'
const navbar = [
  { title: '整租', imgsrc: nav1, path: '/home/houseList' },
  { title: '合租', imgsrc: nav2, path: '/home/houseList' },
  { title: '地图找房', imgsrc: nav3, path: '/home/map' },
  { title: '去出租', imgsrc: nav4, path: '/rent/add ' }
]

export default class Index extends Component {
  state = {
    rotation: [],
    isloding: false,
    imgHeight: 212,
    //租房小组
    groups: [],
    //最新咨询
    news: [],
    //当前城市
    cityName: '上海'
  }

  async componentDidMount() {
    this.Carousels()
    this.renting()
    this.advisory()
    const { label } = await tag()
    this.setState({
      cityName: label
    })
  }
  async Carousels() {
    const res = await axios.get(`http://localhost:8080/home/swiper`)
    console.log(res)
    if (res.data.status === 200) {
      this.setState({
        rotation: res.data.body,
        isloding: true
      })
    }
  }
  async renting() {
    const res = await axios.get(`http://localhost:8080/home/groups`, {
      params: 'area=AREA%7C88cff55c-aaa4-e2e0'
    })
    console.log(res)
    if (res.data.status === 200) {
      this.setState({
        groups: res.data.body
      })
    }
  }
  async advisory() {
    const res = await axios.get(`http://localhost:8080/home/news`, {
      params: 'area=AREA%7C88cff55c-aaa4-e2e0'
    })
    if (res.data.status === 200) {
      this.setState({
        news: res.data.body
      })
    }
    console.log(res)
  }
  carousels = () => {
    if (!this.state.isloding) {
      return null
    } else {
      return (
        <Carousel autoplay={true} infinite>
          {this.state.rotation.map(item => (
            <a
              key={item.id}
              href="http://baidu.cn/"
              style={{
                display: 'inline-block',
                width: '100%',
                height: this.state.imgHeight
              }}
            >
              <img
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'))
                  this.setState({ imgHeight: 'auto' })
                }}
              />
            </a>
          ))}
        </Carousel>
      )
    }
  }
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  render() {
    return (
      <div className="index">
        <div className="search">
          <SearchHeader cityName={this.state.cityName}></SearchHeader>
          {this.carousels()}
        </div>

        {/* //小导航页 */}
        <Flex className="navigation">
          {navbar.map(item => {
            return (
              <Flex.Item
                key={item.title}
                onClick={() => this.props.history.push(item.path)}
              >
                <img src={item.imgsrc} alt="" />
                <h3>{item.title}</h3>
              </Flex.Item>
            )
          })}
        </Flex>
        {/* 租房小组 */}
        <div className="groups">
          <Flex className="groups-title" justify="between">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>
          {/* rendeItem 属性：用来 自定义 每一个单元格中的结构 */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            activeStyle
            hasLine={false}
            renderItem={item => (
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* // 最新资讯 结构： */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}
