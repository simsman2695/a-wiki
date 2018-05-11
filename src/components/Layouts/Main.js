import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navbar from './../ui/navigation/navbar';

class MainLayout extends Component {

    render () {
        return (
            <div className="container">
                <div className="row">
                    <Navbar/>
                </div>
                {this.props.children}
            </div>
        );
    }
}

MainLayout.propTypes = {
    children: PropTypes.object
};
export default MainLayout;
