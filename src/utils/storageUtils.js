/**
 * 进行local数据存储管理的工具模块
 */
const USER_KEY = 'user_key'

const dealUser = {
    saveUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    getUser() {
        return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    },
    removeUser(){
        localStorage.removeItem(USER_KEY)
    }
}

export {
    dealUser,

}