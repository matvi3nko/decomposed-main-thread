import React, { Component } from 'react';
import SubTitle from './SubTitle';
import Title from './Title';

import './app.styl';
import List from "./List";

export default class App extends Component {

    render () {
        return (
            <div>
                <Title/>
                <SubTitle/>
                <List data={this.props.list}/>
            </div>

        );
    }

}
