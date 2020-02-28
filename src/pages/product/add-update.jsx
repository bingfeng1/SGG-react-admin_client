import React, { Component } from 'react';
import { Card, Form, Input, Cascader, Button, Icon, message } from 'antd';
import { reqCategorys, reqAddOrUpdateProduct } from '../../api';
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor';

const { Item } = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
        this.judgeAddUpdate()

        // 创建用来保存ref表示的标签对象容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    componentDidMount() {
        this.getCategorys()
    }

    // 判断增还是改
    judgeAddUpdate = () => {
        const product = this.props.location.state
        // 保存是否更新的标识
        this.isUpdate = !!product
        this.product = product || {}
    }

    submit = () => {
        // 进行表单验证，如果通过了，才发送请求
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // 收集数据,并封装成product对象
                const { name, desc, price, categoryIds } = values
                let pCategoryId, categoryId;
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {
                    name,
                    desc,
                    price,
                    imgs,
                    detail,
                    pCategoryId,
                    categoryId
                }

                // 如果是更新，需要添加_id
                if (this.isUpdate) {
                    product._id = this.product._id
                }

                // 调用接口请求函数去添加/更新
                const { data } = await reqAddOrUpdateProduct(product)

                // 根据结果提示
                if(data.status ===0){
                    message.success(`${this.isUpdate?'更新':'添加'}商品成功`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate?'更新':'添加'}商品失败`)
                }


            }
        })
    }

    /**
     * 验证价格的自定义验证函数
     */
    validatePrice = (rule, value, cb) => {
        // cb() 验证通过
        // cb('aaa')    //验证没通过，并报aaa错误
        if (value * 1 > 0) {
            cb()
        } else {
            cb('错误的数字格式')
        }


    }

    /**
     * 异步获取一级/二级分类列表，并显示
     */
    getCategorys = async (parentId = '0') => {
        const { data } = await reqCategorys(parentId)
        if (data.status === 0) {
            const categorys = data.data
            // 如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {  // 二级列表
                return categorys
            }
        }
    }

    initOptions = async categorys => {
        //根据category生成options数组，并更新options状态
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        const { isUpdate, product } = this;
        const { pCategoryId } = product

        if (isUpdate && pCategoryId !== '0') {
            // 商品是二级分类商品
            const subCategory = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategory.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 找到当前商品对应的一级option对象
            const targetOption = options.find(options => options.value === pCategoryId)

            // 关联到一级option上
            targetOption.children = childOptions
        }

        this.setState({
            options
        })
    }

    /**
     * 用于加载下一级列表的回调
     */
    loadData = async selectedOptions => {
        console.log(selectedOptions)
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // 根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;

        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 关联到当前option上
            targetOption.children = childOptions
        } else {  // 没有二级分类
            targetOption.isLeaf = true
        }

        this.setState({
            options: [...this.state.options],
        });
    };

    render() {
        const { isUpdate, product } = this;
        const { name, desc, price, pCategoryId, categoryId, imgs, detail } = product
        let categoryIds;
        if (isUpdate) {
            // 商品是一级分类商品
            if (pCategoryId === '0') {
                categoryIds = [categoryId]
            } else {
                categoryIds = [pCategoryId, categoryId]
                this.getCategorys(pCategoryId)
            }
        }
        const formItemLayout = {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 8
            },
        };
        const title = (
            <span>
                <Button type="link" onClick={() => this.props.history.goBack()}>
                    <Icon type="arrow-left" style={{ fontSize: '20px' }} />
                </Button>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        const { getFieldDecorator } = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item
                        label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: name,
                                rules: [
                                    {
                                        required: true,
                                        message: "商品名称必填"
                                    }
                                ]
                            })(
                                <Input placeholder="请输入商品名称" />
                            )
                        }
                    </Item>
                    <Item
                        label="商品描述">
                        {
                            getFieldDecorator('desc', {
                                initialValue: desc,
                                rules: [
                                    {
                                        required: true,
                                        message: "商品描述必填"
                                    }
                                ]
                            })(
                                <TextArea placeholder="请输入商品描述" autoSize />
                            )
                        }
                    </Item>
                    <Item
                        label="商品价格">
                        {
                            getFieldDecorator('price', {
                                initialValue: price,
                                rules: [
                                    {
                                        required: true,
                                        message: "商品价格必填"
                                    }, {
                                        validator: this.validatePrice
                                    }
                                ]
                            })(
                                <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
                            )
                        }
                    </Item>
                    <Item
                        label="商品分类">
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    {
                                        required: true,
                                        message: "商品类型必填"
                                    }
                                ]
                            })(
                                <Cascader
                                    options={this.state.options}
                                    loadData={this.loadData}
                                />
                            )
                        }
                    </Item>
                    <Item
                        label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
                    </Item>
                    <Item
                        label="商品详情" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(ProductAddUpdate);