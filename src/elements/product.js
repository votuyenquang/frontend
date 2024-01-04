import React, { useEffect, useState } from 'react';
import { Image,Card,Badge, Button ,Modal ,Select,InputNumber, notification,message} from 'antd';
import {getPriceVND} from '../contain/getPriceVND';
import {Link, useHistory} from 'react-router-dom';
import { useDispatch } from "react-redux";
import PreviewImmage from './PreviewImmage';
import * as FetchAPI from "../util/fetchApi";
import { updateCartCurrent } from "../contain/updateQuanityCart";

const { Meta } = Card;


import {
    ShoppingCartOutlined,
  } from "@ant-design/icons";

const { Option } = Select;

export default function Product(props){
    const {image,name,price,id,promotional} = props.item;
    const s = Math.round((price - promotional)/price*100);
    const path={
        pathname:`/product/${id}`
    }
    const [dataOption, setDataOption] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [outOfStock, setoutOfStock] = useState(false);
    const [buttonLoading, setbuttonLoading] = useState(false);

    const [option, setOption] = useState();
    const [quanity, setQuanity] = useState(1);
    const dispatch = useDispatch();
    const history = useHistory();

    const showModal =  async () => {
        await getOption(id);
        console.log(dataOption);
    }
    const btn = (
        <Button
          type="primary"
          onClick={() => {
            history.push("/cart");
            notification.close("notifysuccess");
          }}
        >
          Go now
        </Button>
      );
    
    const handleOk = () => {
        const dataOut = localStorage.getItem("cart");
        console.log(dataOut);
        let objDataOut = JSON.parse(dataOut);
        if (objDataOut === null || dataOut === undefined) {
          const data = [
            { id: id, quanity: quanity, option: option[0] },
          ];
          objDataOut = data;
        } else {
          //Check product and option in cart
          let police = objDataOut.some(
            (x) => x.id === id && x.option === option[0]
          );
          if (police) {
            //find postition
            let index = objDataOut.findIndex(
              (x) => x.id === id && x.option === option[0]
            );
            //setNewQuanity
            let newQuanity = objDataOut[index].quanity + quanity;
            if (newQuanity > option[1]) {
              message.warning(
                "This product only has  " + option[1] + ", Please select check again"
              );
              setbuttonLoading(false);
              return;
            } else {
              //setNewQuanity
              objDataOut[index].quanity = newQuanity;
            }
          } else {
            const data = {
              id: id,
              quanity: quanity,
              option: option[0],
            };
            objDataOut.push(data);
          }
        }
        localStorage.setItem("cart", JSON.stringify(objDataOut));
        setTimeout(() => {
          setbuttonLoading(false);
          updateCartCurrent(dispatch);
          notification["success"]({
            message: "Add to cart successfully !",
            description: "Would you like to go to cart now ?",
            btn,
            key: "notifysuccess",
          });
        }, 1000);
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
    const hanldeShowPrice = ()=>{
        if(promotional===null){
            return(
                <span style={{ fontSize:16 }}>{getPriceVND(price)+"$"}</span>
            )
        }else{
            return(
                <div style={{ display:'flex',flexDirection:'column' }}>
                    <span style={{ fontSize:16,textDecorationLine:'line-through' }}>{getPriceVND(price)+"$"}</span>
                    <span style={{ fontSize:16,color:'red',fontWeight:'bold' }}>{getPriceVND(promotional)+"$"}</span>
                </div>
            )
        }   
    }
    const title2 = (
        <Link className="title-card-product" to={path}>{name}</Link>
    )
    const getOption = async (id) => {
        let i = [];
        const data = { id: id };
        const res = await FetchAPI.postDataAPI(
          "/product/getProductInventory",
          data
        );
        if (res.length === 0) {
          setoutOfStock(true);
        } else {
          let totalquanity = 0;
          res.map((e) => [(totalquanity += e.quanity - e.sold)]);
          if (totalquanity === 0) {
            setoutOfStock(true);
          } else {
            setoutOfStock(false);
          }
        }
        res.map((item, ind) => {
          if (item.quanity - item.sold !== 0) {
            i.push(
              <Option key={ind} value={`${item.size},${item.quanity - item.sold}`}>
                {item.size + " - "}
                <span style={{ color: "gray" }}>{item.quanity - item.sold}</span>
              </Option>
            );
          }
        });
        // console.log(i);
        setDataOption(i);
        setIsModalVisible(true);
        
       


      };
    const handleOrder = () => {
        setbuttonLoading(true);
        setTimeout(() => {
        if (option == null) {
            message.warning("Please select size and color to order !");
            setbuttonLoading(false);
        } else if (quanity === null) {
            message.warning("Please select quantity !");
            setbuttonLoading(false);
        } else if (option[1] < quanity) {
            message.warning(
            "This model only has  " +
                option[1] +
                " product, Please sympathize!"
            );
            setbuttonLoading(false);
        } else {
            handleOk();
        }
        }, 500);
      };
    return(
            <Card
                className="itemProduct"
                hoverable
                style={props.width!==undefined?{width:props.width}:{width:270,borderRadius:20}}
                cover={
                <div>
                    {s === 100 ? 
                    <div style={{ overflow:"hidden" }}>
                        <Image alt="example" src={image} preview={{mask:(<PreviewImmage/>)}}/>
                    </div>
                    :
                    <Badge.Ribbon text={s+"%"} color="red">
                        <div style={{ overflow:"hidden" }}>
                            <Image style={{ overflow:"hidden" }} alt="example" src={image} preview={{mask:(<PreviewImmage/>)}}/>
                        </div>
                    </Badge.Ribbon>
                    }
                </div>
                }
            >
                <Meta title={title2} description={hanldeShowPrice()} />
                <Button onClick={showModal} className='button_add_cart'> 
                    <ShoppingCartOutlined />
                </Button>
                <Modal
                    className='modal_add_to_cart'
                    title="Add to Cart"
                    open={isModalVisible}
                    onOk={handleOrder}
                    onCancel={handleCancel}
                    loading={buttonLoading}
                    footer={[
                        <Button style={{ borderRadius:10}} key="back" onClick={handleCancel}>
                          Cancel
                        </Button>,
                        <Button
                          key="submit"
                          type="primary"
                          onClick={handleOrder}
                          style={{ borderRadius:10}}
                        >
                          Add to Cart
                        </Button>,
                      ]}

                >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Image src={image} alt={name} width={150} height={200} />
                        <div style={{ marginLeft: '20px' }}>
                        <h3 className="name-product">{name}</h3>
                            <span>Price: </span>
                            { promotional  ? 
                                <>
                                    <span style={{ fontSize: 15, color: "red", fontWeight: "bold", marginRight:10 }}>
                                        {getPriceVND(promotional) + " $"}
                                    </span>
                                    <span style={{ fontSize: 15, textDecorationLine: "line-through"   }}>
                                    {getPriceVND(price) + " $"}
                                    </span>
                                </>
                               :
                                <span style={{ fontSize: 15  }}>
                                    {getPriceVND(price) + " $"}
                                </span>
                            }
                            
                            <div style={{marginTop:10}}>
                            <span>Size/Color :  </span>
                                <Select
                                    placeholder="Choose size, color"
                                    onChange={(e) => {
                                        console.log(e);
                                        var arr = [];
                                        arr = e.split(",");
                                        setOption(arr);
                                    }}
                                    allowClear
                                    >
                                    {dataOption}
                                </Select>
                            </div>    
                            <div style={{marginTop:10}}>
                                <span>Quantity:   </span>
                                    <InputNumber
                                        min={1}
                                        max={10}
                                        defaultValue={1}
                                        onChange={(e) => {
                                            setQuanity(e);
                                          }}
                                    />
                            </div>     
                        </div>
                    </div>
                </Modal>
                
            </Card>
       
    )
}