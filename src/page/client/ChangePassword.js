import React,{useEffect,useState} from 'react';
import { useSelector} from 'react-redux';
import Spinner from '../../elements/spinner';
import * as FetchAPI from '../../util/fetchApi';
import {Form,Input,Button,message} from 'antd';

export default function ChangePassword(){
    const [showContent, setshowContent] = useState(false);
    const currentUser = useSelector(state=>state.userReducer.currentUser);
    const [dataUser, setdataUser] = useState();
    const [loadingBtn, setloadingBtn] = useState(false);
    const [formInfor] = Form.useForm();
    useEffect(()=>{

        if(!currentUser.id){
            setshowContent(true)
        }else{
            setdataUser({...dataUser,id:currentUser.id})
        }
    },[currentUser])
    
    const handleChangePassword = async()=>{
        setloadingBtn(true)
        if (dataUser.newPassword === dataUser.newPasswordAccept){

            const res = await FetchAPI.postDataAPI("/user/change-password",{data:dataUser});
            if(res.msg){
                if(res.msg==="Success"){
                    setTimeout(()=>{
                        message.success("Update successful !")
                        setloadingBtn(false)
                    },500)
                  
                }else if(res.msg === "Incorrect"){
                    setTimeout(()=>{
                            message.error("Incorrect current password !")
                            setloadingBtn(false)
                        },500)   
                }
            }
        }
        else {
            alert("Accept password not match !")
            setloadingBtn(false)
        }   
    }
    const InforUser = ()=>(
        <Form
            form={formInfor}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            style={{paddingTop:20}}
            onFinish={handleChangePassword}
          
        >
            <Form.Item
                label="Current password"
                name="password"
                rules={[{ required: true, message: 'Enter current password'}]}
            >
                <Input 
                    placeholder="Enter current password"
                    value={dataUser?.password}
                    onChange= {(e)=>setdataUser({...dataUser,password:e.target.value})}
                />
            </Form.Item>
            <Form.Item
                label="New password"
                name="new-password"
                rules={[{ required: true, message: 'Enter new password'}]}

            >
                <Input 
                    placeholder="Enter new password"
                    value={dataUser?.newPassword}
                    onChange= {(e)=>setdataUser({...dataUser,newPassword:e.target.value})}
                />
            </Form.Item>
            <Form.Item
                label="Re-Enter New password "
                name = "phone"
                rules={[{ required: true, message: 'Re-Enter New password'}]}
            >
                <Input
                    placeholder="Re-Enter New password"
                    value={dataUser?.newPasswordAccept}
                    onChange= {(e)=>setdataUser({...dataUser,newPasswordAccept:e.target.value})}
                />
            </Form.Item>
            <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                    Change Password
                </Button>
            </Form.Item>
        </Form>
    )
    return(
        <div style={{ minHeight:450 }}>
                <div>
                    {currentUser.id==undefined ?
                    <span style={{ margin:"20px 10px" }}>
                        Please log in to view information...
                    </span>
                    :
                    <div style={{ padding:"20px 20px" }}>
                        Update your password
                        {InforUser()}
                    </div>
                
                    }
                </div>
        </div>
    )
}