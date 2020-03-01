import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin';

import './App.less'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <Router>
                <Switch>    {/*只能匹配其中一个 */}
                    <Route path="/login" component={Login}></Route>
                    <Route path="/" component={Admin}></Route>
                </Switch>
            </Router>
        );
    }
}

export default App;