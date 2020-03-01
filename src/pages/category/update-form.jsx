import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types'

const { Item } = Form

class UpdateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static propTypes = {
        category: PropTypes.object.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: this.props.category.name,
                            rules:[
                                {
                                    required:true,message:'分类名称必填'
                                }
                            ]
                        })(
                            <Input placeholder="请输入分类名字" />
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(UpdateForm);