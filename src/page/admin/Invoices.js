import React,{useEffect,useState,useLayoutEffect,useRef} from 'react';
import {Table,Select,Button,message,Modal} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import {getPriceVND} from '../../contain/getPriceVND';
import {DeleteOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {getColumnSearchProps} from '../../elements/SearchFilter';
import { useSelector } from 'react-redux';
export default function Invoices(){
    const { Option } = Select;
    const [fulldataBill, setfulldataBill] = useState();
    const [loadingTable, setloadingTable] = useState(false);
    const [showModalDeleteBill, setshowModalDeleteBill] = useState(false);
    const [dataItemTmp, setdataItemTmp] = useState();
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    const searchInput = useRef();
 
    useEffect(()=>{
        setloadingTable(true);
        getFullBill()
    },[]) 
    const getFullBill = async()=>{
        const res = await FetchAPI.getAPI('/order/getFullBill');
        res.sort(function(a,b){
            return new Date(b.create_at) - new Date(a.create_at);
        });
        if(res!==undefined){
            setfulldataBill(res);
            setloadingTable(false);
        }
    }
    const hanldeUpdateStatus = async(value,code,id,email)=>{
        setloadingTable(true);
        const data = {"code_order":code,"status":value,"email": email};
        const res = await FetchAPI.postDataAPI("/order/updateStatusBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    getFullBill();
                    message.success("Update invoice #"+id+" successfully !");
                },500)
            }else{
                setTimeout(()=>{
                    message.error("There's an error !!");
                    setloadingTable(false);
                },500)
            }
        }
    }
    const handleDeleteItem = async()=>{
        setloadingTable(true);
        setshowModalDeleteBill(false);
        const data = {"code_order":dataItemTmp.code_order};
        const res = await FetchAPI.postDataAPI("/order/deleteBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success(`Delete invoice #${dataItemTmp.id} successfully !`);
                getFullBill();
                setTimeout(()=>{
                    setloadingTable(false);
                },200)
            }else{
                message.error("There's an error !!");
                setTimeout(()=>{
                    setloadingTable(false);
                },200)
            }
        }
    }
    const columns = [
        {
            title:"Order code",
            key:'code',
            filters: [
                { text: 'Order with account', value: "string" },
                { text: 'Order without account', value: "object" },
            ],
            onFilter: (value, record) => typeof(record.idUser)===value,
            render: record=>(
                <span style={record.idUser===null?{color:'red',fontWeight:'bold' }:{ fontWeight:'bold' }}>
                    {"#"+record.id}
                </span>         
            )
        },
        {
            title:"Customer name",
            key:'name',
            ...getColumnSearchProps('name',searchInput)
        },
        {
            title:"Address",
            key:'address',
            render:record=><span>{record.address}</span>
        },
        {
            title:"Email",
            key:'email',
            ...getColumnSearchProps('email',searchInput),
        },
        {
            title:"Phone",
            key:'phone',
            render: record=><span>{record.phone}</span>
        },
        {
            title:"Total",
            key:'total',
            sorter: (a, b) => a.total_price - b.total_price,
            render: record=><span style={{ fontWeight:'bold' }}>{getPriceVND(record.total_price)+" $"}</span>
        },
        {
            title:"Status",
            key:'status',
            filters: [
                { text: 'Processing', value: 0 },
                { text: 'Delivering', value: 1 },
                { text: 'Completed', value: 2 },
                { text: 'Cancelled', value: 3 },
            ],
            onFilter: (value, record) => record.status===value,
            render: record=>{
                return(
                    <Select 
                        value={record.status}  
                        style={{ width: 120 }} 
                        onChange={(value)=>hanldeUpdateStatus(value,record.code_order,record.id,record.email)}
                    >
                        <Option value={0}>
                            <span style={{ color:'red' }}>Processing</span>
                        </Option>
                        <Option value={1}>
                            <span style={{color:'blue' }}>Delivering</span>
                        </Option>
                        <Option value={2}>
                            <span style={{ color:'green' }}>Completed</span>
                        </Option>
                        <Option value={3} disabled>
                            <span style={{ color:'gray' }}>Cancelled</span>
                        </Option>
                    </Select>
                )
            }
        },
        {
            title:"Payment",
            key:'payment_status',
            render: record=><span>{record.payment_status === 1 ? "Paid" : "Unpaid"}</span>
        },
        {
            title:"Customize",
            key:'option',
            render:record=>(
                <div style={{ display:'flex',flexDirection:'row',alignItems:'center' }}>
                    <Button>
                        <Link to={`/admin/billdetails/${record.code_order}`}>
                            Detail
                        </Link>
                    </Button>
                    <DeleteOutlined 
                        style={{marginLeft:15,fontSize:20,cursor:"pointer" }} 
                        onClick={()=>{
                            setshowModalDeleteBill(true);
                            setdataItemTmp(record);
                        }}/>
                </div>
            )
        }

    ]
    const styles = {
        overflowX: overflowX ? { overflowX: 'scroll' } : null,
        textAlign: 'center'
      };
      
    return(
    <div>
        <p>You need to delete other canceled orders to put the product back in inventory.</p>

        <Table 
            showSorterTooltip={{ title: 'Click to sort' }}
            columns={columns} 
            dataSource={fulldataBill} 
            size="small" 
            style={  overflowX?{overflowX:'scroll'}:null } 
            loading={loadingTable} />
         {showModalDeleteBill &&
            <Modal
                title={`You definitely want to delete the invoice #${dataItemTmp.id}`}
                visible={showModalDeleteBill}
                onOk={handleDeleteItem}
                onCancel={()=>setshowModalDeleteBill(false)}
                cancelText="Exit"
                okText="Sure"
            >
                <p>You are sure of your decision! All data about this invoice will be deleted.</p>
                <p> And the products in this invoice will be returned to the inventory!</p>
            </Modal>
        }
    </div>
    )
}