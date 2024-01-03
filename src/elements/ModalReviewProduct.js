import React from 'react';
import {Modal,List,Rate,Input,Button,message} from 'antd';

import * as FetchAPI from '../util/fetchApi';
export default function ModalReviewProduct (props) {
    // console.log(props.dataProduct)
    // console.log(props.user.id)
    const handleAddReview = async(data)=>{
        if(data.reviewStar===null){
            message.warning('Please rate the product with stars!')
        }else{
            const req = {
                "idOrderDetails":data.id,
                "idUser":props.user.id,
                "idProduct":data.idProduct,
                "comment":data.comment,
                "reviewStar":data.reviewStar
            }
            const res = await FetchAPI.postDataAPI("/review/addReview",req);
            if(res.msg){
                if(res.msg==="Success"){
                    message.success("Thank. Your review has been saved");
                    props.refresh();
                }else{
                    message.error("There's an error !!");
                }
            }
        }
    }
    const handleEditReview = async(data)=>{
        const req = {
            "reviewStar":data.reviewStar,
            "comment":data.comment,
            "idReview":data.idReview
        }
        const res = await FetchAPI.postDataAPI("/review/editReview",req);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Your review has been edited");
            }else{
                message.error("There's an error !!");
            }
        }
    }
    const renderItem = (item)=>{
        return(
        <List.Item>
            <div style={{ width:'100%' }}>
                <span style={{ fontWeight:'bold' }}>{item.name_product}</span>
                <span style={{ marginLeft:10 }}>{`(${item.size})`}</span>
                <Rate 
                    defaultValue={item.reviewStar}
                    style={{marginLeft:20}}
                    onChange= {e=>item.reviewStar=e}
                />
                <Input.TextArea 
                    defaultValue={item.comment}
                    placeholder="Your review of this product"
                    onChange= {(e)=>item.comment=e.target.value}
                /> 
                <div style={{display:'flex', justifyContent:'center',paddingTop:20 }}>
                {item.reviewStar===null&&item.comment===null ?
                    <Button type="primary" danger onClick={()=>handleAddReview(item)}>
                        Reviews
                    </Button>
                :
                    <Button type="primary" danger onClick={()=>handleEditReview(item)}>
                        Edit review
                    </Button>
                }
                </div>
            </div>

        </List.Item>
    )
    }
    return(
        <Modal
            title="Reviews product"
            open={props.visible}
            onCancel={props.onCancel}
            footer={false}
        >
          
            <List 
                itemLayout="horizontal"
                dataSource={props.dataProduct}
                renderItem= {renderItem}
            />
            
        </Modal>
    )
}   