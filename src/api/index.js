import axios from './axios'

/**
 * 登录接口 POST
 * @param {Object} user
 * {username,password}
 */
const reqLogin = ({ username, password }) => {
    return axios.post('/login', {
        username,
        password
    })
}

/**
 * 增加用户接口 POST
 * @param {Object} user 
 */
const reqAddUser = (user) => {
    return axios.post('/manager/user/add', {
        data: user
    })
}

export {
    reqLogin,
    reqAddUser
}