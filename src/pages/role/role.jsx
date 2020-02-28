import React, { Component } from 'react';
import { Card, Button, Table, Modal, message } from 'antd';
import { PAGE_SIZE } from '../../utils/constants';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api';
import AddForm from './add-form';
import AuthForm from './auth-form';
import { dealUser } from '../../utils/storageUtils';
import { formateDate } from '../../utils/dateUtils';

class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [

            ],
            role: {},// 选中的对象
            isShowAdd: false,   //是否显示添加界面
            isShowAuth: false    //设置角色权限
        }
        this.initColumn()

        this.checkList = React.createRef()
    }

    componentDidMount() {
        this.getRoles()
    }

    getRoles = async () => {

        const { data } = await reqRoles()
        if (data.status === 0) {
            const roles = data.data
            this.setState({
                roles
            })

        }
    }

    initColumn = () => {
        this.columns = [
            {
                title: "角色名称",
                dataIndex: 'name'
            }, {
                title: "创建时间",
                dataIndex: 'create_time',
                render(text){
                    return formateDate(text)
                }
            }, {
                title: '授权时间',
                dataIndex: 'auth_time',
                render(text){
                    return formateDate(text)
                }
            }, {
                title: "授权人",
                dataIndex: 'auth_name'
            }
        ]
    }

    onSelect = (role) => {
        console.log(role)
        this.setState({
            role
        })
    }

    // 添加角色
    addRole = () => {
        // 进行表单验证

        this.form.validateFields(async (error, values) => {
            if (!error) {
                // 收集输入数据
                const { roleName } = values
                this.form.resetFields()

                // 获取form数据
                const { data } = await reqAddRole(roleName)
                // 请求添加
                if (data.status === 0) {
                    // 根据结果提示/更新列表显示
                    this.setState(state => ({
                        roles: [...state.roles, data.data],
                        isShowAdd: false
                    }))
                    message.success('添加角色成功')
                } else {
                    message.error('添加角色失败')
                }


            }
        })

    }

    // 更新角色
    updateRole = async () => {
        const { role } = this.state
        // 得到子组件数据
        let menu = this.checkList.current.getCheckList()
        role.menus = menu
        role.auth_time = Date.now().toString()
        role.auth_name = dealUser.getUser().username
        const { data } = await reqUpdateRole(role)
        if (data.status === 0) {
            message.success('更新权限成功')
            
            this.setState({
                roles:[...this.state.roles],
                isShowAuth:false,
            })
        }else{
            message.error(data.msg)
        }
    }

    handleCancel = () => {
        this.setState({
            isShowAdd: false
        })
        this.form.resetFields()
    }

    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button type="primary" style={{ marginRight: '20px' }} onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button>
                <Button type="primary" disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>创建角色权限</Button>
            </span>
        )
        return (
            <Card
                title={title}>
                <Table
                    dataSource={roles}
                    columns={this.columns}
                    rowKey="_id"
                    bordered
                    rowSelection={{
                        type: 'radio',
                        onSelect: this.onSelect
                    }}
                    pagination={{
                        defaultPageSize: PAGE_SIZE
                    }} />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        setForm={(form) => { this.form = form }}
                    >

                    </AddForm>
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={
                        () => {
                            this.setState({
                                isShowAuth: false
                            })
                        }
                    }
                >
                    <AuthForm
                        role={role}
                        ref={this.checkList}
                    />

                </Modal>
            </Card>
        );
    }
}

export default Role;