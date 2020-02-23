import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import ProductHome from './home';
import ProductAddUpdate from './add-update';
import ProductDetail from './detail';

import './product.less'

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <Switch>
                <Route path="/product/addupdate" component={ProductAddUpdate}></Route>
                <Route path="/product/detail" component={ProductDetail}></Route>
                <Route path="/product" exact component={ProductHome}></Route>
            </Switch>
        );
    }
}

export default Product;