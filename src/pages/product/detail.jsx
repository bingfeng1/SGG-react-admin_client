import React, { Component } from 'react';
import {
    Card,
    Icon,
    List,
    Button
} from 'antd'
import { reqCategory } from '../../api';
import { BASE_IMG_URL } from '../../utils/constants';

const { Item } = List

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cName1: '',  //一级分类名称
            cName2: '',  //二级分类名称
        }
    }

    async componentDidMount() {
        const { categoryId, pCategoryId } = this.props.location.state
        if (pCategoryId === '0') {
            const result = await reqCategory(categoryId)
            const cName1 = result.data.data.name
            this.setState({
                cName1
            })
        } else {
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            const result1 = results[0]
            const result2 = results[1]
            const cName1 = result1.data.data.name
            const cName2 = result2.data.data.name

            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {
        const { cName1, cName2 } = this.state
        // 读取携带过来state数据
        const { name, desc, price, detail, imgs } = this.props.location.state

        const title = (
            <Button type="link" onClick={() => this.props.history.goBack()}>
                <Icon
                    type="arrow-left"
                    style={{ color: 'green', marginRight: '15px', fontSize: '20px' }} />
                <span>商品详情</span>
            </Button>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <div>
                            <span className="left">商品名称：</span>
                            <span>{name}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品描述：</span>
                            <span>{desc}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">所属分类：</span>
                            <span>{cName1}{`-->${cName2}`}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品价格：</span>
                            <span>{price}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品图片：</span>
                            <span>
                                {
                                    imgs.map(img => (
                                        <img
                                            key={img}
                                            src={`${BASE_IMG_URL}${img}`}
                                            alt={img}
                                        />
                                    ))
                                }
                            </span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                            <span className="left">商品详情：</span>
                            <span>{detail}</span>
                        </div>
                    </Item>
                </List>
            </Card>
        );
    }
}

export default ProductDetail;