import React, { Component } from 'react'

// 导入三个子组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import axios from 'axios'
import { tag } from '../../../../utils/'
import styles from './index.module.css'

export default class Filter extends Component {
  async componentDidMount() {
    const { value } = await tag()
    this.htmlbody = document.body
    const res = await axios.get(`http://localhost:8080/houses/condition`, {
      params: {
        id: value
      }
    })
    console.log(res)
    this.setState({
      Building: res.data.body
    })
  }
  state = {
    titlelistTable: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    openType: '',
    Building: {},
    screen: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }
  //点击table栏的高亮区
  changetitle = type => {
    //点击确定展开对话框的时候让列表不再继续滑动
   this.htmlbody.classList.add('fixed')

    const {screen,titlelistTable} = this.state
    const newtitlelistTable = {
      ...titlelistTable
    }
    Object.keys(screen).forEach(item=>{
      //screen得到的是键返回一个数组

      //screen[item]代表的是当前菜单的选中值
    const newvalue = screen[item]
       console.log(newvalue);
       
      // console.log(item,screen[item]);
      console.log(item,type);
      //这里判断的是当前菜单(type)如果是就高亮
      if (item===type) {  
        newtitlelistTable[type]=true

      } else {
        //再判断每一个菜单分别决定每个菜单的高亮
        if (item === 'area' && (newvalue.length === 3 || newvalue[0] !== 'area')) {
          newtitlelistTable[item]=true

          console.log('区域菜单选中了')
        } else if (item === 'mode' && newvalue[0] !== 'null') {
          newtitlelistTable[item]=true

          console.log('方式菜单选中了')
        } else if (item === 'price' && newvalue[0]!=='null') {
          newtitlelistTable[item]=true

          console.log('租金菜单')
        } else if (item === 'more' && newvalue.length!==0) {
          newtitlelistTable[item]=true
          console.log('筛选菜单')
        }
        else {
          //当没有选中的时候应该让默认值为false
          newtitlelistTable[item]=false
        }
      } 
      
    }) 
  
    
    this.setState({
      titlelistTable: newtitlelistTable,
      openType: type
    })
  }

  //隐藏遮罩层
  mask = () => {
    //点击取消的时候把对话框去掉从而让列表继续滚动
   this.htmlbody.classList.remove('fixed')

    const { openType,screen } = this.state
    //最新的选中值
    const newvalue = screen[openType]
    
    console.log('最新的选中值', newvalue)
    //这里用isShowHand来判断类名是否高亮
    let isShowHand = false
    
    if (openType === 'area' && (newvalue.length === 3 || newvalue[0] !== 'area')) {
    
      isShowHand = true
      console.log('区域菜单选中了')
    } else if (openType === 'mode' && newvalue[0] !== 'null') {
      isShowHand = true
      console.log('方式菜单选中了')
    } else if (openType === 'price' && newvalue[0]!=='null') {
      isShowHand = true
      console.log('租金菜单')
    } else if (openType === 'more') {
      console.log('筛选菜单')
    }

    // console.log(value, openType)
    this.setState({
      //选择器change事件的高亮
      titlelistTable: {
        ...this.state.titlelistTable,
        [openType]: isShowHand
      },
      openType: ''
    })
  
  }
 //选择器的change事件
  Filtertype = value => {
    const { openType,screen } = this.state
    
    
    //最新的选中值
    const newvalue = value
    console.log('最新的选中值', newvalue)
    //这里用isShowHand来判断类名是否高亮

    let isShowHand = false
    // console.log(openType === 'area' && (newvalue.length === 3 || newvalue[0] !== 'area'));

    if (openType === 'area' && (newvalue.length === 3 || newvalue[0] !== 'area')) {
      isShowHand = true
      console.log('区域菜单选中了')
    } else if (openType === 'mode' && newvalue[0] !== 'null') {
      isShowHand = true
      console.log('方式菜单选中了')
    } else if (openType === 'price' && newvalue[0]!=='null') {
      isShowHand = true
      console.log('租金菜单')
    } else if (openType === 'more' && newvalue.length!==0) {
      isShowHand = true

      console.log('筛选菜单')
    }
    //这里需要拿到最新的数据进行转换然后把新数据的内容给到HouseList父组件
      const NewScreen = {
        ...screen,
        [openType]: value
      }
      console.log('最新值',NewScreen);
      
      //这里创建一个空的对象
      const NewObj = {}

      NewObj.rentType = NewScreen.mode[0]
      NewObj.price = NewScreen.price[0]
      NewObj.more = NewScreen.more.join(',')
      // 这里的area和subway虽然在同一个对象中但是不再一个数组中。
      const keys = NewScreen.area[0]
      let valuet
      if ( NewScreen.area.length===2) {
        valuet='null'
      } else {
        //这里判断数组area最后一项是否为null
        if (NewScreen.area[2]==='null') {
          //如果是就返回NewScreen.area[1]
          valuet = NewScreen.area[1]
        } else {
          //如果不是就返回NewScreen.area[2]
          valuet = NewScreen.area[2]
        }
      }
      NewObj[keys] = valuet
      console.log(NewObj);
      //这里把格式化好的数据对象传到父组件
      this.props.OnNewObj(NewObj)
    // console.log(value, openType)
    this.setState({
      screen: NewScreen,
   
      //选择器change事件的高亮
      titlelistTable: {
        ...this.state.titlelistTable,
        [openType]: isShowHand
      },
      openType: ''
    })
  }
  //渲染FilterPicker来对应tab栏
  FilterPicker() {
    const {
      openType,
      Building: { area, subway, rentType, price },
      screen
    } = this.state

    let data, rows

    switch (openType) {
      case 'area':
        data = [area, subway]
        rows = 3
        break
      case 'mode':
        data = rentType
        rows = 1
        break
      case 'price':
        data = price
        rows = 1
        break
      default:
        break
    }
    const selted = screen[openType]
    // console.log(openType === 'area' && ( openType === 'mode' || openType === 'price'));
    
    if (openType === 'area'|| openType === 'mode' || openType === 'price') {
      //FilterPicker通过父组件给传给了子组件onCancel的函数
      return (
        <FilterPicker
          Filtertype={this.Filtertype}
          onCancel={this.mask}
          data={data}
          rows={rows}
          selted={selted}
          key={openType}
        />
      )
    } else {
      return null
    }
  }
  //筛选菜单
  FilterMore () {
    const { openType,Building:{roomType,oriented,floor,characteristic}, screen } = this.state
    const data = {roomType,oriented,floor,characteristic}
    if (openType!=='more') {
       return null
    } else {
      //选中值
      const selted = screen.more
      return <FilterMore mask={this.mask}  selted = {selted} data={data} Filtertype={this.Filtertype} />
    }
  }
  render() {
    const { openType } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className={styles.mask} onClick={this.mask} />
        ) : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titlelistTable={this.state.titlelistTable}
            onClick={this.changetitle}
          />

          {/* 前三个菜单对应的内容： */}
          {this.FilterPicker()}

          {/* 最后一个菜单对应的内容： */}
           {this.FilterMore()}
        </div>
      </div>
    )
  }
}
