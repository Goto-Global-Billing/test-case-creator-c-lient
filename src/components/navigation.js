import React from 'react';
import { NavLink } from 'react-router-dom';
import './navigation.css';

const Navigation = () => (
    <header className='main-navigation'>
        <nav>
            <ul>
                <li>
                    <NavLink to='/'>Input Details</NavLink>                   
                </li>
                <li>
                    <NavLink to='/output'>Test Case Results</NavLink>
                </li>
            </ul>
        </nav>
    </header>
);

export default Navigation;