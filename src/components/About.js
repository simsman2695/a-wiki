import React from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = (state) => {
    return {
        statistics: state.statistics
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

const About = (props) => {

    return (
        <div>
            <p>
                Vestibulum laoreet condimentum sem quis convallis. Nullam quis tortor mauris. Pellentesque orci sapien,
                fermentum non porta a, lobortis vitae mi. Integer quis enim at nunc commodo egestas. Maecenas et tortor
                ut
                diam consectetur malesuada. Curabitur posuere, diam at pulvinar cursus, diam diam imperdiet risus, vel
                ullamcorper sapien lectus vitae turpis. Sed posuere lectus at dictum ultrices. Nulla in congue ipsum.
                Praesent commodo venenatis arcu non lacinia. Integer placerat odio eget metus posuere, id placerat orci
                tristique. Nulla nec lorem sit amet diam luctus tempor ac sit amet mi. Vivamus tortor tortor, ornare a
                risus
                eget, efficitur vestibulum augue. Nunc vulputate faucibus purus, eget convallis urna porta eget. In
                faucibus
                tristique mauris eu gravida.
            </p>
        </div>
    );
};

About.propTypes = {
    classes: PropTypes.object,
    statistics: PropTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(About));
