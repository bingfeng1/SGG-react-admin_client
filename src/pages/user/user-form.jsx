import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types'

const { Item } = Form
const { Option } = Select

// 添加/修改用户的form组件
class UserForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentDidMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { roles, user = {} } = this.props
        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 12
            },
        };

        const { getFieldDecorator } = this.props.form
        return (
            <Form {...formItemLayout}>
                <Item label="用户名">
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username,
                            rules: [
                                {
                                    required: true, message: '用户名称必填'
                                }
                            ]
                        })(
                            <Input placeholder="请输入用户名称" />
                        )
                    }
                </Item>
                {
                    !user._id && (
                        <Item label="密码">
                            {
                                getFieldDecorator('password', {
                                    initialValue: user.password,
                                })(
                                    <Input type="password" placeholder="请输入密码" />
                                )
                            }
                        </Item>
                    )
                }
                <Item label="手机号">
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone,

                        })(
                            <Input placeholder="请输入手机号" />
                        )
                    }
                </Item>
                <Item label="邮箱">
                    {
                        getFieldDecorator('email', {
                            initialValue: user.email,

                        })(
                            <Input placeholder="请输入邮箱" />
                        )
                    }
                </Item>
                <Item label="角色">
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,

                        })(
                            <Select placeholder="请选择角色">
                                {
                                    roles.map(role => (
                                        <Option
                                            value={role._id}
                                            key={role._id}
                                        >
                                            {role.name}
                                        </Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(UserForm);