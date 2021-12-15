import React from 'react';

import Barra from './Barra';

function Layout(props) {
    return (
        <React.Fragment>
            <Barra />
            {props.children}
        </React.Fragment>
    )
}

export default Layout;