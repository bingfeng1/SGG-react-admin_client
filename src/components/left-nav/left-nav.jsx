import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import logo from '../../asserts/images/logo.png'
import { Menu, Icon } from 'antd';

import menuList from '../../config/menuConfig'

const { SubMenu } = Menu

class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.path = props.location.pathname
        this.menuNodes = this.getMenuNodes(menuList)
    }

    getMenuNodes = (menuList) => {
        return menuList.map((item) => {
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