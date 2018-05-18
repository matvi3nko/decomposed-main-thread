import React, { Component } from 'react';
import Item from './Item';

export default class List extends Component {

    render () {
        let items = [];
        for (let i = 0; i < 100; i++) {
            // note: we add a key prop here to allow react to uniquely identify each
            // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
            items.push(<Item data={this.props.data} />);
        }

        return (
            <div>{items}</div>
        );
    }

}
