const city = 'ZSH'
const getcity = () => JSON.parse(localStorage.getItem(city))
const setcity = stored => localStorage.setItem(city, JSON.stringify(stored))
export { getcity, setcity }
