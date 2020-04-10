import axios from 'axios'
import {API} from './http'
import {BASE_URL} from './url'
import { getcity, setcity } from './city'
const tag = () => {
  const memory = getcity()
  if (!memory) {
    return new Promise(resolve => {
      const myCity = new window.BMap.LocalCity()
      myCity.get(async result => {
        const cityName = result.name
        const res = await axios.get(`http://localhost:8080/area/info`, {
          params: {
            name: cityName
          }
        })
        setcity(res.data.body)
        resolve(res.data.body)
      })
    })
  } else {
    return new Promise(resolve => {
      resolve(memory)
    })
  }
}
export { tag, getcity, setcity ,  API, BASE_URL}
export * from './token'