import React from 'react'

import { Flex } from 'antd-mobile'
import classnames from 'classnames'
import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default function FilterTitle(props) {
  console.log(props)

  return (
    <Flex align="center" className={styles.root}>
      {titleList.map(item => {
        // console.log(item.type, props.titlelistTable[item.type])
        // console.log(item.type, props.titlelistTable[item.type])
        const isselected = props.titlelistTable[item.type]
        // console.log(isselected)

        return (
          <Flex.Item key={item.type} onClick={() => props.onClick(item.type)}>
            {/* 选中类名： selected */}
            <span
              className={classnames(styles.dropdown, {
                [styles.selected]: isselected
              })}
            >
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        )
      })}
    </Flex>
  )
}
