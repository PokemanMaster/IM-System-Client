import React from 'react';
import {useNavigate} from 'react-router-dom';
import "./style.less";

const Header = ({name}) => {
    const navigate = useNavigate();

    return (
        <div className="header-container">
            <div className="header">{name}</div>
        </div>
    );
};

export default Header;
