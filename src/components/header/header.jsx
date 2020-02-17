import React, { Component } from 'react';
import { Button, Row, Col, Modal } from 'antd';
import { formateDate } from '../../utils/dateUtils';
import { dealUser } from '../../utils/storageUtils';
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig';

class MyHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: formateDate(new Date()),
            username: dealUser.getUser().username
        }
    }

    componentDidMount() {
        this.currentTime()
    }

    componentWillUnmount() {
        this.delCurrentTime()
    }

    currentTime() {
        this.timer = setInterval(() => {
            this.setState({
                time: formateDate(new Date())
            })
        }, 1000)
    }

    delCurrentTime() {
        clearInterval(this.timer)
    }

    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title;
        for (let item of menuList) {
            if (item.key === path) {
                title = item.title
                return title;
            } else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem) {
                    title = cItem.title
                    return title;
                }
            }
        }
    }

    logout = () => {
        Modal.confirm({
            content: '确定退出吗？',
            onOk: () => {
                // console.log('退出')
                // 删除保存的user数据
                dealUser.removeUser()
                // 跳转到Login
                this.props.history.replace('/login')
            }
        })
    }

    render() {
        return (
            <div className="my-header">
                <div className="header-top right">
                    <span>欢迎，</span>
                    <span>{this.state.username}</span>
                    <Button type="link" onClick={this.logout}>退出</Button>
                </div>
                <Row type="flex" align="middle" className="header-bottom">
                    <Col span={8}>
                        <div className="header-bottom-left center">{this.getTitle()}</div>
                    </Col>
                    <Col span={16}>
                        <div className="header-bottom-right right">
                            {this.state.time}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(MyHeader);