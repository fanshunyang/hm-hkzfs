import React, { Component } from 'react'

import { Carousel, Flex, Modal, Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HosItem from  '../../components/HosItem'

import HousePackage from '../../components/HousePackage'

import { BASE_URL,isAth, API,removeToken } from '../../utils'
import axios from 'axios'

import styles from './index.module.scss'

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    houseImg: '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    houseImg: '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    houseImg: '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}

export default class HouseDetail extends Component {
  state = {
    isLoading: false,
    isFavorite:false,
    houseInfo: {
      // 房屋图片
      slides: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '两室一厅',
      // 房屋面积
      size: 89,
      // 装修类型
      renovation: '精装',
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    }
  }

 async componentDidMount() {

    //发送请求拿数据
    const {id} = this.props.match.params
    this.id = id
    const res =  await axios.get(`http://localhost:8080/houses/${id}`)
   console.log(res);
   const { houseImg,title,tags,price,roomType,size,oriented,floor,community,coord,supporting,houseCode,description} = res.data.body
   this.setState({
     
    houseInfo : {
        // 房屋图片
        slides:houseImg ,
        // 标题
        title ,
        // 标签
        tags ,
        // 租金
        price,
        // 房型
        roomType,
        // 房屋面积
        size,
        // 装修类型
      
        // 朝向
        oriented ,
        // 楼层
        floor ,
        // 小区名称
        community ,
        // 地理位置
        coord,
        // 房屋配套
        supporting,
        // 房屋标识
        houseCode,
        // 房屋描述
        description
    }
   })
    
    this.renderMap(community, coord )
   
    this.checkFavorite()
  }
 //收藏页面
 async checkFavorite() {
      //判断有没有登录
      if (!isAth) {
        return
      } else {
        //没有收藏反请求拿数据
       const res = await API.get(`/user/favorites/${this.id}`)
       console.log(res);
       const {status,body} = res.data
        if (status===200) {
          this.setState({
          isFavorite:body.isFavorite
       })
     } 
  }
}

//登录收藏页面
handleFavorite= async () =>{
  if (!isAth()) {
    //没有登录弹出对应的提示框
   return Modal.alert('提示','登录后才能收藏房源，您确定要登录吗',[
      {text:'取消'},

      {
        text:'去登录',
      onPress: ()=>{
       this.props.history.replace('/login',{
         from:this.props.location
       })
       }
      }
    ])
  }
  //点击登录
  const {isFavorite} = this.state
  if (isFavorite) {
    const res = await API.delete(`/user/favorites/${this.id}`)
     const {status} = res.data
     if (status===200) {
        Toast.info('删除成功',1)
        this.setState({
          isFavorite:false
        })
     } else {
      //添加失败
      this.setState({
        isFavorite:false
      })

      //弹窗提示

      Modal.alert('提示','登录后才能收藏房源，您确定要登录吗',[
        {text:'取消'},
  
        {
          text:'去登录',
        onPress: ()=>{
         this.props.history.replace('/login',{
           from:this.props.location
         })
         }
        }
      ])
     }
  } else {
    //如果未收藏就添加
    const res = await API.post(`/user/favorites/${this.id}`)
    console.log(res);
    const {status}= res.data
    if (status===200) {
      Toast.info('添加成功')
      this.setState({
        isFavorite:true
      })
    } else {
      //添加失败
      //提示对话框
      Modal.alert('提示','登录后才能收藏房源，您确定要登录吗',[
        {text:'取消'},
        {
          text:'去登录',
        onPress: ()=>{
         this.props.history.replace('/login',{
           from:this.props.location
         })
         }
        }
      ])
    }
  }
  
}
  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { slides }
    } = this.state

    return slides.map(item => (
      <a
        key={item}
        href="http://itcast.cn"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 252
        }}
      >
        <img
          src={BASE_URL + item}
          alt=""
          style={{ width: '100%', height:252, verticalAlign: 'top' }}
        />
      </a>
    ))
  }

   // 渲染地图
   renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }
  render() {
    const {
     isLoading,
     isFavorite,
      houseInfo:{
        // 标题
        title ,
        // 标签
        tags ,
        // 租金
        price,
        // 房型
        roomType,
        // 房屋面积
        size,
        // 装修类型
      
        // 朝向
        oriented ,
        // 楼层
        floor ,
        // 小区名称
        community ,
        // 地理位置
        coord,
        // 房屋配套
        supporting,
        // 房屋标识
        houseCode,
        // 房屋描述
        description
    } } = this.state
    return (
      <div className={styles.root}>
        {/* 顶部导航栏 */}
        <NavHeader
          className={styles.navHeader}
          rightContent={<i className="iconfont icon-share" />}
        >
        { community}
        </NavHeader>

        {/* 轮播图 */}
        <div className={styles.slides}>
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>
         {title}
          </h3>
          <Flex className={styles.tags}>
            {tags.map((item,index)=>{  
              const tagClass = index > 2 ? styles.tag3 :styles[`tag${index+1}`]   
             return <span key={item} className={[styles.tag, tagClass].join(' ')}>
               {item}
              </span>
            })}
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
               {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span> {floor}
                低楼层
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
          <span className={styles.title}>朝向：</span>南 {oriented}
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
          <span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
         {supporting.length===0?  
          <div className="title-empty">暂无数据</div>
          : <HousePackage
          list={supporting}
        />
        }
        
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={ 'http://localhost:8080/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {description || '暂无房屋描述'}
            
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              <HosItem {...item} key={item.id} onClick={a => a} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          <Flex.Item onClick={this.handleFavorite} >
           {
           isFavorite
            ? <>  
            <img
              src='http://localhost:8080/img/star.png'
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>已收藏</span>
            </>
             : 
              <> 
              <img
              src='http://localhost:8080/img/unstar.png'
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>未收藏</span>
            </>
            }
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}








