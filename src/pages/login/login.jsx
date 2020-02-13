import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd'
import './login.less'
import logo from './images/logo.png'

/**
 * 登录的路由组件
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        // 得到form对象
        const { form } = this.props
        // 获取表单项的输入数据
        form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
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
                                        }]
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