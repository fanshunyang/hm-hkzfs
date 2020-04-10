//项目根组件
import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import Citylist from './pages/Citylist'
import Map from './pages/Map'
import Details from './pages/Details'
import Login from './pages/Login'
import Atken from './components/Atken'
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'


export default function App() {
  return (
    <Router>
      <div className="app">
        <Route
          path="/"
          exact
          render={() => <Redirect to="/home"></Redirect>}
        ></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={Citylist}></Route>
        <Route path="/map" component={Map}></Route>
        <Route path="/detail/:id" component={Details}></Route>
        <Route path="/login" component={Login}></Route>
        {/* 配置需要登录的路由 */}
        <Atken exact path='/rent' component={Rent}></Atken>
        <Atken path='/rent/add' component={RentAdd}></Atken>
        <Atken path='/rent/search' component={RentSearch}></Atken>

      </div>
    </Router>
  )
}
