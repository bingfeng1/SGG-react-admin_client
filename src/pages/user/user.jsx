import React, { Component } from 'react';
import { Card, Button, Table, Modal, message } from 'antd';
import { formateDate } from '../../utils/dateUtils';
import { PAGE_SIZE } from '../../utils/constants';
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api';
import UserForm from './user-form';
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
                render: (user) => {
                    return (
                        <span>
                            <Button type="link"
                                onClick={() => this.showUpdate(user)}>
                                修改
                            </Button>
                            <Button type="link"
                                onClick={() => { this.deleteUser(user) }}>
                                删除
                            </Button>
                        </span >
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
    addOrUpdateUser = async () => {
        // 收集输入数据
        const user = this.form.getFieldsValue()
        this.form.resetFields()

        if (this.user) {
            user._id = this.user._id
        }

        // 提交添加提示
        const { data } = await reqAddOrUpdateUser(user)

        // 更新列表显示
        if (data.status === 0) {
            message.success(`${this.user?'修改':'添加'}用户成功`)
            this.getUsers()
            this.setState({
                isShow: false
            })
        } else {
            message.error(`${this.user?'修改':'添加'}用户失败`)
        }
    }

    // 显示修改界面
    showUpdate = (user) => {
        this.user = user

        this.setState(
            {
                isShow: true
            }
        )
    }

    // 删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            onOk: async () => {
                const { data } = await reqDeleteUser(user._id)
                if (data.status === 0) {
                    message.success('删除用户成功！')
                    this.getUsers()
                }
            }
        })
    }

    render() {
        const { users, isShow, roles } = this.state
        const title = (
            <Button
                type="primary"
                onClick={
                    () => {
                        this.setState({ isShow: true });
                        this.user = undefined
                    }
                } >
                创建用户
            </ Button>
        )
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
                    title={this.user ? '修改用户' : "添加用户"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => this.setState({ isShow: false })}
                >
                    <UserForm
                        setForm={form => this.form = form}
                        roles={roles}
                        user={this.user}
                    />
                </Modal>
            </Card>
        );
    }
}

export default User;