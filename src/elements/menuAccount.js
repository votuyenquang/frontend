
import {Menu,message} from 'antd';
import react, { Fragment, useCallback, useEffect } from 'react';
import {Link} from 'react-router-dom';
import * as FetchAPI from '../util/fetchApi';
import { useState } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';
const { db } = require('../util/db')



export default function MenuAccount (props){
    const key = 'updatable';
    const {name, email, id} = props.data;
    
    const handleLogout = ()=>{
        message.loading({ content: 'Signing out...', key });
        setTimeout(()=>{
            localStorage.removeItem("token");
            props.refreshAccount();
            message.success({ content: 'Sign out successfully !', key, duration: 2 });
        },1000)
    }


    return(
        <Menu theme="dark">
            <Menu.Item key="bill" >
                <Link to="/billfollow">
                Order
                </Link>
            </Menu.Item>
            <Menu.Item key="profile" >
                <Link to="/profile">
                    {"Information ("+name+")" }
                </Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
               Log out
            </Menu.Item>
        </Menu>
    )
}