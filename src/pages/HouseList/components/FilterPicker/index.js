import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  state = {
    value: this.props.selted
  }
  handchange = value => {
    this.setState({
      value
    })
  }
  render() {
    // console.log(this.props)
    const { data, rows } = this.props
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data}
          value={this.state.value}
          cols={rows}
          onChange={this.handchange}
        />

        {/* 底部按钮 */}
        {/* 这里的子组件拿到了父组件FilterPicker的onCancel的函数然后进行调用 */}
        <FilterFooter
          onCancel={() => this.props.onCancel()}
          onOk={() => this.props.Filtertype(this.state.value)}
        />
      </>
    )
  }
}
