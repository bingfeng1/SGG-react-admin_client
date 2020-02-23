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

/**
 * 获取一级/二级接口
 * @param {String} parentId 
 */
const reqCategorys = (parentId = '0') => {
    return axios.get('/manage/category/list', { params: { parentId } })
}

/**
 * 添加一级/二级接口
 * @param {Object} parentId 
 */
const reqAddCategorys = ({ categoryName, parentId }) => {
    return axios.post('/manage/category/add', { categoryName, parentId })
}


/**
 * 更新一级/二级接口
 * @param {Object} parentId 
 */
const reqUpdateCategorys = ({ categoryId, categoryName }) => {
    return axios.post('/manage/category/update', { categoryId, categoryName })
}

// 获取商品分页列表
const reqProducts = ({ pageNum, pageSize }) => {
    return axios.get('/manage/product/list', {
        params: {
            pageNum,
            pageSize
        }
    })
}

/**
 * 搜索商品分页列表
 */
const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => {
    return axios.get('/manage/product/search', {
        params: {
            pageNum,
            pageSize,
            [searchType]: searchName
        }
    })
}

/**
 * 获取一个分类
 */
const reqCategory = (categoryId) => {
    return axios.get('/manage/category/info', {
        params: {
            categoryId
        }
    })
}

/**
 * 更新商品的状态（上架/下架）
 */
const reqUpdateStatus = (productId, status) => {
    return axios.post('/manage/product/updateStatus', { productId, status })
}

export {
    reqLogin,
    reqAddUser,
    reqCategorys,
    reqAddCategorys,
    reqUpdateCategorys,
    reqProducts,
    reqSearchProducts,
    reqCategory,
    reqUpdateStatus
}