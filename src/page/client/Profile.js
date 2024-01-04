import React,{useEffect,useState} from 'react';
import { useSelector} from 'react-redux';
import Spinner from '../../elements/spinner';
import * as FetchAPI from '../../util/fetchApi';
import {Form,Input,Button,message} from 'antd';

export default function Profile(){
    const [showContent, setshowContent] = useState(false);
    const currentUser = useSelector(state=>state.userReducer.currentUser);
    const [dataUser, setdataUser] = useState();
    const [loadingBtn, setloadingBtn] = useState(false);
    const [formInfor] = Form.useForm();
    useEffect(()=>{

        if(!currentUser.id){
            setshowContent(true)
        }else{
            setshowContent(false)
            getInforUser()
           
        }
    },[currentUser])
  
    const getInforUser = async()=>{
        const data = {"idUser":currentUser.id}
        console.log({data});
        const res = await FetchAPI.postDataAPI("/user/getInforUser",data)
        console.log(res[0]);
        setdataUser(res[0])
        formInfor.setFieldsValue(res[0])
        setshowContent(true)
    }
    const handleEditProfile = async()=>{
        setloadingBtn(true)
        const res = await FetchAPI.postDataAPI("/user/updateProfile",{data:dataUser});
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Update successful !")
                    setloadingBtn(false)
                },500)
              
            }else{
                setTimeout(()=>{
                    message.error("There's an error !")
                    setloadingBtn(false)
                },500)
               
            }
        }
    }
   
    const InforUser = ()=>(
        <Form
            form={formInfor}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            style={{paddingTop:20}}
            onFinish={handleEditProfile}
          
        >
            <Form.Item
                label="First and last name"
                name="name"
                rules={[{ required: true, message: 'Enter first and last name'}]}
            >
                <Input 
                    placeholder="Enter full name and surname"
                    value={dataUser?.name}
                    onChange= {(e)=>setdataUser({...dataUser,name:e.target.value})}
                />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
            >
                <Input 
                    placeholder="Enter email"
                    disabled
                />
            </Form.Item>
            <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Enter address'}]}
            >
                <Input 
                    placeholder="Enter address"
                    value={dataUser?.address}
                    onChange= {(e)=>setdataUser({...dataUser,address:e.target.value})}
                />
            </Form.Item>
            <Form.Item
                label="Phone number"
                name = "phone"
                rules={[{ required: true, message: 'Enter phone number'}]}
            >
                <Input
                    placeholder="Phone number"
                    value={dataUser?.phone}
                    onChange= {(e)=>setdataUser({...dataUser,phone:e.target.value})}
                />
            </Form.Item>
            <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                    Update
                </Button>
            </Form.Item>
        </Form>
    )
    return(
        <div style={{ minHeight:450 }}>
            {showContent ?
                <div>
                    {currentUser.id==undefined ?
                    <span style={{ margin:"20px 10px" }}>
                        Please log in to view information...
                    </span>
                    :
                    <div style={{ padding:"20px 20px" }}>
                        Save your personal information for payment convenience
                        {InforUser()}
                    </div>
                
                    }
                </div>
                :
                <Spinner spinning={!showContent}/>
           }
        </div>
    )
}