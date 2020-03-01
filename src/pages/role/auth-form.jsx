import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd';
import menuList from '../../config/menuConfig';

const { Item } = Form
const { TreeNode } = Tree

class AuthForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedKeys: []
        }
        this.treeNode = this.createTreeNode(menuList)
    }

    static getDerivedStateFromProps(props, state) {
        if (props.role._id !== state.roleId) {
            return {
                roleId: props.role._id,
                checkedKeys: [...props.role.menus]
            }
        }
        return null
    }

    static propTypes = {
        role: PropTypes.object.isRequired
    }

    createTreeNode = arr => {
        return arr.map((item) => {
            return (
                <TreeNode title={item.title} key={item.key}>
                    {
                        item.children && this.createTreeNode(item.children)
                    }
                </TreeNode>
            )
        })
    }

    onCheck = checkedKeys => {
        this.setState({
            checkedKeys
        })
    }

    getCheckList = () => {
        return this.state.checkedKeys
    }

    render() {
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 15
            }
        }
        const { role } = this.props
        const { checkedKeys } = this.state
        return (
            <div >
                <Item {...formItemLayout}
                    label="角色名称">
                    <Input value={role.name} disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {
                            this.treeNode
                        }
                    </TreeNode>
                </Tree>
            </div>
        );
    }
}

export default AuthForm;