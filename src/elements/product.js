import React from 'react';
import { Image,Card,Badge, Button  } from 'antd';
import {getPriceVND} from '../contain/getPriceVND';
import {Link} from 'react-router-dom';
import PreviewImmage from './PreviewImmage';
const { Meta } = Card;
export default function product(props){
    const {image,name,price,id,promotional} = props.item;
    const s = Math.round((price - promotional)/price*100);
    const path={
        pathname:`/product/${id}`
    }
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
    const handleOrder = () => {
        const dataOut = localStorage.getItem("cart");
        alert(dataOut)
        // let objDataOut = JSON.parse(dataOut);
        // if (objDataOut === null || dataOut === undefined) {
        //   const data = [
        //     { id: dataProduct.id, quanity: quanity, option: option[0] },
        //   ];
        //   objDataOut = data;
        // } else {
        //   //Check product and option in cart
        //   let police = objDataOut.some(
        //     (x) => x.id === dataProduct.id && x.option === option[0]
        //   );
        //   if (police) {
        //     //find postition
        //     let index = objDataOut.findIndex(
        //       (x) => x.id === dataProduct.id && x.option === option[0]
        //     );
        //     //setNewQuanity
        //     let newQuanity = objDataOut[index].quanity + quanity;
        //     if (newQuanity > option[1]) {
        //       message.warning(
        //         "This product only has  " + option[1] + ", Please select check again"
        //       );
        //       setbuttonLoading(false);
        //       return;
        //     } else {
        //       //setNewQuanity
        //       objDataOut[index].quanity = newQuanity;
        //     }
        //   } else {
        //     const data = {
        //       id: dataProduct.id,
        //       quanity: quanity,
        //       option: option[0],
        //     };
        //     objDataOut.push(data);
        //   }
        // }
        // localStorage.setItem("cart", JSON.stringify(objDataOut));
        // setTimeout(() => {
        //   setbuttonLoading(false);
        //   updateCartCurrent(dispatch);
        //   notification["success"]({
        //     message: "Add to cart successfully !",
        //     description: "Would you like to go to cart now ?",
        //     btn,
        //     key: "notifysuccess",
        //   });
        // }, 1000);
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
                <Button onClick={handleOrder} className='button_add_cart'> add to cart </Button>
            </Card>
       
    )
}