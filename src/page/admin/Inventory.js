import React ,{useEffect,useState,useRef} from 'react';
import {InputNumber,Table,Image,message,Button,Modal} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {DeleteOutlined,PlusCircleOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {getColumnSearchProps} from '../../elements/SearchFilter';
import moment from 'moment';
import { useSelector } from 'react-redux';
export default function Inventory(){
    const [dataInventory, setdataInventory] = useState();
    const [showContent, setshowContent] = useState(false);
    const [loadingTable, setloadingTable] = useState(false);
    const [showModalDeleteInventory, setshowModalDeleteInventory] = useState(false);
    const [dataItemTmp, setdataItemTmp] = useState();
    const searchInput = useRef();
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);

    useEffect(()=>{
        setloadingTable(true);
        setshowContent(false);
        getFullInventory();
    },[])
    const getFullInventory = async()=>{
        setshowContent(false);
        const res = await FetchAPI.getAPI("/inventory/getFullInventory");
        res.sort(function(a,b){
            return new Date(b.update_at) - new Date(a.update_at);
        });
        setdataInventory(res);
        setshowContent(true);
        setloadingTable(false);
    
    }
    const updateQuanity = async(quanity,idProduct,size,name)=>{
        setloadingTable(true);
        const data = {"idProduct":idProduct,"quanity":quanity,"size":size};
        const res = await FetchAPI.postDataAPI("/inventory/updateQuanityInventory",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Updated product "+name+" successfully !");
                    getFullInventory()
                },500)
            }else{
                setTimeout(()=>{
                    message.error("There's an error !!");
                    setloadingTable(false);
                },500)
            }
        }
    }
    const handleDeleteItem = async() =>{
        setloadingTable(true);
        const res = await FetchAPI.postDataAPI("/inventory/deleteItemInventory",{"id":dataItemTmp.id})
        if(res.msg){
            if(res.msg==="Success"){
                message.success(`Delete prodcut ${dataItemTmp.nameProduct} type ${dataItemTmp.size} successfully !`);
                getFullInventory();
                setshowModalDeleteInventory(false);
                setloadingTable(false);
            }else{
                setloadingTable(false);
                message.error("There's an error !!!")
            }
        }
    }
    const columns  = [
        {
            title:"Product",
            key:'product',
            ...getColumnSearchProps('name',searchInput),
            render: record =>(
                <div style={{ display:'flex',alignItems:'center'}}>
                    <Image src={record.image} width={65} preview={false} /> 
                    <span style={{ fontWeight:'bold',marginLeft:20 }}>{record.name}</span>
                </div>
            )
        },
        {
            title:"Type, Size",
            key:'option',
            render: record=><span>{record.size}</span>
        },
        {
            title:"Quantity",
            key:'quanity',
            sorter: (a, b) =>a.quanity-b.quanity,
            render: record=>(
                <InputNumber 
                    min={0} 
                    value={record.quanity}
                    onChange= {(value)=>updateQuanity(value,record.idProduct,record.size,record.name)}
                />)
        },
        {
            title:"Sold",
            key:'sold',
            render: record=><span style={{fontWeight:'bold',color:'gray'}}>{record.sold}</span>
        },
        {
            title:"Rest",
            key:'rest',
            render: record=><span>{record.quanity-record.sold}</span>
        },
        {
            title:"Last updated",
            key:'lastUpdate',
            sorter: (a, b) => new Date(a.update_at) - new Date(b.update_at),
            render: record=><span>{moment(record.update_at).format('YYYY-MM-DD HH:mm:ss')}</span>
        },
        {
            title:"Customize",
            key:'option',
            render:record=>
            <DeleteOutlined 
                style={{marginLeft:15,fontSize:20,cursor:"pointer" }} 
                onClick={()=>{setshowModalDeleteInventory(true);setdataItemTmp(record)}}
            />
        }
    ]
    return(
    <div>
        {showContent ?
        <div>
        <Button type="primary" style={{ marginBottom:20 }} danger >
            <Link to="/admin/addInventory" >
                Enter inventory <PlusCircleOutlined />
            </Link>    
        </Button>
        <Table 
            showSorterTooltip={{ title: 'Nhấn để sắp xếp' }}
            pagination={{ defaultPageSize: 5 }}
            columns={columns} 
            dataSource={dataInventory}
            style={overflowX?{overflowX:'scroll'}:null} 
            loading={loadingTable}
        />
        {showModalDeleteInventory &&
            <Modal
                title={`You definitely want to delete ${dataItemTmp.name} type ${dataItemTmp.size}`}
                visible={showModalDeleteInventory}
                onOk={handleDeleteItem}
                onCancel={()=>setshowModalDeleteInventory(false)}
                cancelText="Exit"
                okText="Sure"
            >
                <p>You are sure of your decision! All data about this item will be permanently deleted.</p>
            </Modal>
        }
        </div>
        
        :
        <Spinner spinning={!showContent}/>
        }
    </div>
    )
}