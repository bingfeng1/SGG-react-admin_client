import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import logo from '../../asserts/images/logo.png'
import { Menu, Icon } from 'antd';

import menuList from '../../config/menuConfig'
import { dealUser } from '../../utils/storageUtils';

const { SubMenu } = Menu

class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.path = props.location.pathname
        this.menuNodes = this.getMenuNodes(menuList)
    }

    // 判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        const { key, isPublic } = item
        const menus = dealUser.getUser().role.menus
        const username = dealUser.getUser().username
        /**
         * 1、如果是admin，开方所有权限
         * 2、如果当前item是公开的
         * 3、当前用户有此item权限，则开放
         */
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
            // 4、如果此item有某个字item权限
            return !!item.children.find(child => {
                return menus.indexOf(child.key) !== -1
            })
        }

    }

    getMenuNodes = (menuList) => {
        return menuList.map((item) => {
            if (this.hasAuth(item)) {
                if (item.children) {
                    item.children.find(citem => citem.key === this.path) && (this.defaultOpenKeys = item.key)
                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {
                                this.getMenuNodes(item.children)
                            }
                        </SubMenu>
                    )
                } else {
                    return (
                        <Menu.Item key={item.key} >
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item >
                    )
                }
            }

        })
    }

    render() {
        return (
            <div className="left-nav">
                <Link to="/">
                    <header className="left-nav-header">
                        <img src={logo} alt="logo" />
                        <h2>react</h2>
                    </header>
                </Link>
                <section>
                    <Menu
                        defaultOpenKeys={[this.defaultOpenKeys]}
                        defaultSelectedKeys={[this.path]}
                        mode="inline"
                        theme="dark"
                    >
                        {
                            this.menuNodes
                        }
                    </Menu>
                </section>
            </div>
        );
    }
}

export default withRouter(LeftNav);