const KEN = 'itcast_token'
const storageToken = (token)=>localStorage.setItem(KEN,token)
const gainToken = ()=>localStorage.getItem(KEN)
const removeToken = ()=>localStorage.removeItem(KEN)
const isAth = ()=>!!gainToken()
export  {storageToken,gainToken,removeToken,isAth}