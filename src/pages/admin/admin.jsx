import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { dealUser } from '../../utils/storageUtils';
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav/left-nav';
import MyHeader from '../../components/header/header';
import Home from '../home/home';
import Category from '../category/category';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';

const { Header, Footer, Sider, Content } = Layout;

/**
 * 用户的组件
 */
class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const user = dealUser.getUser()
        if (Object.keys(user).length === 0) {
            this.props.history.replace('/login')
        }
    }

    render() {
        return (
            <Layout className="adminPages">
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0, height: '80px' }}>
                        <MyHeader></MyHeader>
                    </Header>
                    <Content className="content">
                        <Switch>
                            <Route path='/home' component={Home}></Route>
                            <Route path='/category' component={Category}></Route>
                            <Route path='/product' component={Product}></Route>
                            <Route path='/role' component={Role}></Route>
                            <Route path='/user' component={User}></Route>
                            <Route path='/charts/bar' component={Bar}></Route>
                            <Route path='/charts/line' component={Line}></Route>
                            <Route path='/charts/pie' component={Pie}></Route>
                            <Redirect to="/home"></Redirect>
                        </Switch>
                    </Content>
                    <Footer className="footer">
                        推荐使用谷歌浏览器
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Admin;