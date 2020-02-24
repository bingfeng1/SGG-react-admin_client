import React, { Component } from 'react';
import { Card, Select, Input, Button, Icon, Table, message } from 'antd';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api';
import { PAGE_SIZE } from '../../utils/constants';

const { Option } = Select
class ProductHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],    //商品的数组
            total: 0,    //商品总数量
            loading: true,  //加载
            searchName: '',  //搜索关键字
            searchType: 'productName',  //搜索类型
        }

        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            }, {
                title: '商品描述',
                dataIndex: 'desc'
            }, {
                title: '价格',
                dataIndex: 'price',
                render: (price) => {
                    return '￥' + price
                }
            }, {
                title: "状态",
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    const newStatus = status === 1 ? 2 : 1

                    return (
                        <span>
                            <Button type='primary'
                                onClick={() => { this.updateStatus(_id, newStatus) }}>
                                {
                                    status === 1 ? '下架' : "上架"
                                }
                            </Button>
                            <span>
                                {
                                    status === 1 ? '在售' : "已下架"
                                }
                            </span>
                        </span>
                    )
                }
            }, {
                title: "操作",
                render: (product) => {
                    return (
                        <div>
                            <Button
                                type="link"
                                onClick={
                                    () => this.props.history.push('/product/detail', product)
                                }>详情</Button>
                            <Button
                                type="link"
                                onClick={
                                    () => this.props.history.push('/product/addupdate', product)
                                }>
                                修改
                                </Button>
                        </div>
                    )
                }
            }
        ]
    }

    componentDidMount() {
        this.getProducts()
    }

    updateStatus = async (productId, status) => {
        const { data } = await reqUpdateStatus(productId, status)
        if (data.status === 0) {
            message.success('更新成功')
            this.getProducts(this.pageNum)

        }
    }

    getProducts = async (pageNum = 1) => {
        this.pageNum = pageNum
        await this.setState({
            loading: true
        })

        let result;
        const { searchName, searchType } = this.state
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts({ pageNum, pageSize: PAGE_SIZE })
        }

        const { data = {} } = result
        if (data.status === 0) {
            const { total, list } = data.data
            this.setState({
                total,
                products: list
            }, () => {
                this.setState({
                    loading: false
                })
            })
        }
    }


    render() {
        // 取出状态数据
        const { products, total, loading, searchType, searchName } = this.state

        const title = (
            <span>
                <Select value={searchType} onChange={value => this.setState({ searchType: value })}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    placeholder="关键字"
                    style={{ width: '150px', margin: '0 15px' }}
                    value={searchName}
                    onChange={e => this.setState({ searchName: e.target.value })} />
                <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type="primary"
                onClick={() => { this.props.history.push('/product/addupdate') }}>
                <Icon type="plus">

                </Icon>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={products}
                    columns={this.columns}
                    rowKey='_id'
                    bordered
                    loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total,
                        onChange: this.getProducts
                    }}
                >

                </Table>
            </Card>
        );
    }
}

export default ProductHome;