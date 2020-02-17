import React, { Component } from 'react';
import { Card, Button, Icon, Table, message, Modal } from 'antd';
import { reqCategorys, reqUpdateCategorys, reqAddCategorys } from '../../api';
import AddForm from './add-form';
import UpdateForm from './update-form';

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categorys: [],   //一级分类列表
            loading: true,
            parentId: '0',   //当前需要显示分类的列表ID
            parentName: '', //当前需要显示分类的父类名称
            subCategorys: [], //当前需要显示的子分类
            showStatus: 0,   //标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
        }
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                dataIndex: 'age',
                key: 'age',
                render: (text, record, index) => (
                    <span>
                        <Button type="link" onClick={() => this.showUpdate(record)}>修改分类</Button>
                        {
                            this.state.parentId === '0' && (
                                <Button
                                    type="link"
                                    onClick={() => {
                                        this.showSubCategorys(record)
                                    }}>
                                    查看子分类
                                </Button>
                            )
                        }

                    </span>
                )
            }
        ]

    }



    componentDidMount() {
        this.getCategorys()
    }

    // 获取分类
    getCategorys = async () => {
        const parentId = this.state.parentId
        const { data = {} } = await reqCategorys(parentId)
        if (data.status === 0) {
            // 取出分类数组（可能一级也可能二级）
            const categorys = data.data
            if (parentId === '0') {
                this.setState({
                    categorys,
                    loading: false
                })
            }
            else {
                this.setState({
                    subCategorys: categorys,
                    loading: false
                })
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    // 获取二级列表
    showSubCategorys(category) {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategorys()
        })
    }

    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    // 响应隐藏确认框
    handleCancel = () => {
        this.form.resetFields()
        this.setState({
            showStatus: 0
        })
    }

    // 显示修改确认框
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        this.setState({
            showStatus: 2
        })
    }

    // 增加分类
    addCategory = () => {
        // 进行表单验证，只有通过了才处理
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })
                // 收集数据，并提交添加分类请求
                const { parentId, categoryName } = this.form.getFieldsValue()
                const { data = {} } = await reqAddCategorys({ categoryName, parentId })

                this.form.resetFields()

                if (data.status === 0) {
                    if (parentId === '0') {
                        this.getCategorys()
                    } else {
                        this.showSubCategorys({
                            _id: parentId,
                            name: categoryName
                        })
                    }
                }
            }
        })
    }

    // 更新分类
    updateCategory = () => {
        // 进行表单验证，只有通过了才处理
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })

                const categoryId = this.category._id
                const categoryName = this.form.getFieldValue('categoryName')

                // 发请求更新分类
                const { data = {} } = await reqUpdateCategorys({ categoryId, categoryName })
                this.form.resetFields()
                // 刷新列表
                if (data.status === 0) {
                    this.getCategorys()
                }
            }
        })
    }


    render() {
        const { parentName, parentId, categorys, subCategorys, loading, showStatus } = this.state

        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <Button type="link" onClick={this.showCategorys}>一级分类列表</Button>
                <Icon type="arrow-right" style={{ margin: '0 20px' }}></Icon>
                <span>{parentName}</span>
            </span>
        );

        return (
            <div>
                <Card
                    title={title}
                    extra={(
                        <Button type="primary" onClick={this.showAdd}>
                            <Icon type="plus">
                            </Icon>
                            新增
                        </Button>
                    )}>

                    <Table
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={this.columns}
                        rowKey="_id"
                        bordered
                        pagination={{
                            defaultPageSize: 5,
                            showQuickJumper: true
                        }}
                        loading={loading} />
                </Card>

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => { this.form = form }}
                    >

                    </AddForm>
                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        category={this.category}
                        setForm={(form) => { this.form = form }} />
                </Modal>
            </div >
        );
    }
}

export default Category;