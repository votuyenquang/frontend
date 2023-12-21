import React from 'react';
import {Dropdown,Button,Menu} from 'antd'
import { FilterOutlined ,FieldTimeOutlined,RiseOutlined,FallOutlined,HistoryOutlined} from '@ant-design/icons';
export default function FilterProduct (props) {

    const handleChooseFilter = (e)=>{
        let arr = [...props.data]
        props.setCurrentKey(e.key)
        if(e.key=="1"){
            arr.sort((a,b)=>b.price-a.price)
        }else if(e.key=="2"){
            arr.sort((a,b)=>a.price-b.price)
        }else if(e.key=="3"){
            arr.sort((a,b)=>new Date(b.create_at)-new Date(a.create_at))
        }else if(e.key=="4"){
            arr.sort((a,b)=>new Date(a.create_at)-new Date(b.create_at))
        }
        props.replaceData(arr)
    }
    const menu = (
        <Menu 
            onClick={handleChooseFilter}
            selectedKeys={props.currentKey}
        >
          <Menu.Item key="1" icon={<FallOutlined />}>
          Prices gradually decrease
          </Menu.Item>
          <Menu.Item key="2" icon={<RiseOutlined />}>
          Prices gradually increase
          </Menu.Item>
          <Menu.Item key="3" icon={<HistoryOutlined />}>
          Newest
          </Menu.Item>
          <Menu.Item key="4" icon={<FieldTimeOutlined />}>
          Latest
          </Menu.Item>
        </Menu>
    );
    return(
        <Dropdown overlay={menu}>
            <Button>
            Filter <FilterOutlined />
            </Button>
        </Dropdown>
    )
}