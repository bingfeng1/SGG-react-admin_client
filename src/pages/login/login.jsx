import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd'
import logo from '../../asserts/images/logo.png'
import { reqLogin } from '../../api'
import { dealUser } from '../../utils/storageUtils';

/**
 * 登录的路由组件
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const user = dealUser.getUser()
        if (Object.keys(user).length) {
            this.props.history.replace('/')
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        // 得到form对象
        const { form, history } = this.props
        // 获取表单项的输入数据
        form.validateFields(async (err, values) => {
            if (!err) {
                const res = await reqLogin(values)
                if (typeof res === 'object') {
                    const { data, msg } = res.data
                    if (msg) {
                        message.error(msg)
                    } else {
                        message.success('登陆成功')
                        dealUser.saveUser(data)
                        // 保存用户数据

                        // 跳转到管理界面
                        history.replace('/admin')
                    }
                } else {
                    message.error("可能是后台服务问题",res)
                }
            }
        })

    }

    // 对密码进行自定义验证
    validatePwd = (rule, value, cb) => {
        if (!value) {
            cb('密码必须输入')
        } else if (value.length < 4) {
            cb('密码长度不能小于4')
        } else if (value.length > 12) {
            cb('密码长度不能大于12')
        } else if (!(/^[a-zA-Z0-9]+$/.test(value))) {
            cb('密码长度不能小于4')
        } else {
            cb()
        }
    }

    render() {
        const { form } = this.props
        const { getFieldDecorator } = form

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {
                                    getFieldDecorator('username', {
                                        rules: [{
                                            required: true,
                                            message: "用户名必须输入",
                                        }, {

                                            min: 4, message: "用户名至少4位"
                                        }, {
                                            max: 12, message: '用户名最多12位'
                                        }, {
                                            pattern: /^[a-zA-Z0-9]+$/,
                                            message: '用户名必须是英文、数字或下划线'
                                        }],
                                        // 指定初始值
                                        initialValue: 'admin'
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Username"
                                        />
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                {
                                    getFieldDecorator('password', {
                                        rules: [
                                            {
                                                validator: this.validatePwd
                                            }
                                        ]
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            type="password"
                                            placeholder="Password"
                                        />
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        );
    }
}

/**
 * 前台表单数据
 * 校验表单数据
 */
const WrapLogin = Form.create()(Login)

export default WrapLogin;