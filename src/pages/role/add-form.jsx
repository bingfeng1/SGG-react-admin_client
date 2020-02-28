import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types'

const { Item } = Form

class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static propTypes = {
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.setForm(this.props.form)
    }

    render() {
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

                <Item label="角色名称">
                    {
                        getFieldDecorator('roleName', {
                            rules: [
                                {
                                    required: true, message: '角色名称必填'
                                }
                            ]
                        })(
                            <Input placeholder="请输入角色名称" />
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(AddForm);