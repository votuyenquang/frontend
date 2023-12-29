import React ,{useEffect,useState,useRef} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import { useSelector } from 'react-redux';
import {Table,Select,message,Modal,Form,Input} from 'antd';
import Spinner from '../../elements/spinner';
import {getColumnSearchProps} from '../../elements/SearchFilter';
import {InfoCircleOutlined} from '@ant-design/icons'
const {Option} = Select;

export default function AccountManger(){
    const [dataUser, setdataUser] = useState();
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    const [showContent, setshowContent] = useState(false);
    const [showModalInforAccount, setshowModalInforAccount] = useState(false);
    const [dataInfor, setdataInfor] = useState([]);
    const searchInput = useRef();
    const [formInfor] = Form.useForm();
    useEffect(()=>{
        setshowContent(false);
        getUser();
    },[])
    const getUser = async()=>{
        const res = await FetchAPI.getAPI("/user/getFullUser");
        console.log(res[0])
        setdataUser(res)
        setshowContent(true);
    }
    const updateStatusUser = async(e,id)=>{
        const data = {"id":id,"status":e}
        const res = await FetchAPI.postDataAPI("/user/updateStatusUser",data)
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Update successfully");
                getUser();
            }else{
                message.error("There's an error !!")
            }
        }
    }
    const columns = [
        {
            title:"Account ID",
            key:'id',
            render: record=><span>{record.id}</span>
        },
        {
            title:"Email",
            key:'email',
            ...getColumnSearchProps('email',searchInput)
        },
        {
            title:"Customer name",
            key:'name',
            render: record=><span>{record.name}</span>
        },
        {
            title:"Status",
            key:"status",
            render: record=>(
                <Select 
                    value={record.status}
                    onChange= {(e)=>updateStatusUser(e,record.id)}
                >
                    <Option value={0}>
                        Activities
                    </Option>
                    <Option value={1}>
                        Temporarily locked
                    </Option>
                </Select>
            )
        },
        {
            title:"Details",
            key:'details',
            render: record=>
            <div style={{ paddingLeft:15 }}>
                <InfoCircleOutlined 
                    style={{fontSize:18,cursor:"pointer" }} 
                    onClick={()=>{
                        getInforUser(record.id)
                    }}
                />
            </div>
        }
    ]
    const getInforUser = async(id)=>{
        const data = {"idUser":id}
        const res = await FetchAPI.postDataAPI("/user/getInforUser",data)
        setdataInfor(res[0]);
        formInfor.setFieldsValue(res[0])
        setshowModalInforAccount(true);
    }
    return(
    <div>
        {showContent ?
        <div>
        <Table 
            dataSource={dataUser}
            columns={columns}
            style={overflowX?{overflowX:'scroll'}:null} 
        />
        {showModalInforAccount &&
            <Modal
                title={`Customer information ${dataInfor.id}`}
                visible={showModalInforAccount}
                onCancel={()=>setshowModalInforAccount(false)}
                cancelText="Exit"
                okButtonProps={{
                    style: {
                      display: "none",
                    },
                }}
            >
                <Form
                    form={formInfor}
                    labelCol={{ xl:6,md:6,sm:8}}
                    wrapperCol={{ xl:15,md:15,sm:13 }}
                >
                    <Form.Item 
                        label="Email"
                        name="email"
                    >
                        <Input 
                            placeholder="Email customer"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Login name"
                        name="username"
                    >
                        <Input 
                            placeholder="Customer login name"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Customer name"
                        name="name"
                    >
                        <Input 
                            placeholder="Customer name"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Address"
                        name="address"
                    >
                        <Input 
                            placeholder="The customer has not provided this information"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Phone"
                        name="phone"
                    >
                        <Input 
                            placeholder="The customer has not provided this information"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Order quantity"
                        name="totalBill"
                    >
                        <span> {formInfor.getFieldValue(['totalBill'])}</span>
                    </Form.Item>
                    <Form.Item 
                        label="Status"
                        name="status"
                    >
                        {formInfor.getFieldValue(['status'])==0?
                        <span style={{ color:'green',fontWeight:'bold' }}>Activities</span>
                        :
                        <span style={{ color:'red',fontWeight:'bold' }}>Temporarily locked</span>
                        }
                    </Form.Item>
                </Form>
            </Modal>
        }
        </div>
        
        :
        <Spinner spinning={!showContent}/>
        }
    </div>
    )
}