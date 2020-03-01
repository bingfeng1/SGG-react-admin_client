import React, { Component } from 'react';
import { Card, Button, Table, Modal } from 'antd';
import { formateDate } from '../../utils/dateUtils';
import { PAGE_SIZE } from '../../utils/constants';
import { reqUsers } from '../../api';
class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],    // 所有的用户列表
            isShow: false,  //是否显示确认框
            roles: [],   // 所有角色的列表
        }
        this.columns = [
            {
                title: "用户名",
                dataIndex: 'username'
            }, {
                title: '邮箱',
                dataIndex: 'email'
            }, {
                title: "电话",
                dataIndex: 'phone'
            }, {
                title: '注册时间',
                dataIndex: "create_time",
                render: formateDate
            }, {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => {
                    return this.roleNames[role_id]
                }
            }, {
                title: '操作',
                render(user) {
                    return (
                        <span>
                            <Button type="link">
                                修改
                            </Button>
                            <Button type="link">
                                删除
                            </Button>
                        </span>
                    )
                }
            }
        ]
    }

    componentDidMount() {
        this.getUsers()
    }

    getUsers = async () => {
        const { data } = await reqUsers()
        console.log(data)
        if (data.status === 0) {
            const { users, roles } = data.data
            this.initRoleNames(roles)
            this.setState({ users, roles })
        }
    }

    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    /**
     * 添加或更新用户
     */
    addOrUpdateUser = () => {

    }

    render() {
        const { users, isShow } = this.state
        const title = <Button type="primary">创建用户</Button>
        return (
            <Card
                title={title}>
                <Table
                    dataSource={users}
                    columns={this.columns}
                    rowKey="_id"
                    bordered
                    pagination={{
                        defaultPageSize: PAGE_SIZE
                    }} />

                <Modal
                    title="添加用户"
                    visible={isShow === 1}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => this.setState({ isShow: false })}
                >
                    <div></div>
                </Modal>
            </Card>
        );
    }
}

export default User;