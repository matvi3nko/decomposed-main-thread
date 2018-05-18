import React, { Component } from 'react';

import './app.styl';

export default class Item extends Component {

    render () {
        return (
            <div>Data: {this.props.data}</div>
        );
    }

}
