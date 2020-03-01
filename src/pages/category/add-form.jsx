import React, { Component } from 'react';
import { Form, Select, Input } from 'antd';
import PropTypes from 'prop-types'

const { Item } = Form
const { Option } = Select

class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static propTypes = {
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { categorys, parentId } = this.props
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId
                        })(
                            <Select>
                                <Option value="0">一级分类表</Option>
                                {
                                    categorys.map(c => (
                                        <Option
                                            value={c._id}
                                            key={c._id}>{c.name}</Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                </Item>

                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            rules: [
                                {
                                    required: true, message: '分类名称必填'
                                }
                            ]
                        })(
                            <Input placeholder="请输入名称" />
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(AddForm);