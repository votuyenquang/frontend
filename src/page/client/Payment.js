import React ,{useEffect,useState}from 'react';
import {Row,Col,Form,Input,Button,Table,Radio,Space,Result } from "antd";
import { useSelector,useDispatch } from 'react-redux';
import {getPriceVND} from '../../contain/getPriceVND';
import {Link,useLocation} from 'react-router-dom';
import * as FetchAPI from '../../util/fetchApi';
import {updateCartCurrent} from '../../contain/updateQuanityCart';
import Paypal from '../../elements/Paypal';

export default function Payment (props){
    const [name, setname] = useState("");
    const [email, setemail] = useState();
    const [phone, setphone] = useState();
    const [address, setaddress] = useState();
    const [message, setmessage] = useState();
    const [totalTmp, settotalTmp] = useState(0);
    const [idUser, setidUser] = useState("");
    const [promoprice, setpromoprice] = useState(0);
    const dataCart = useSelector(state=>state.productReducer.cart);
    const datauser = useSelector(state=>state.userReducer.currentUser);
    const [isSuccess,setIsSuccess] = useState(false)
    const [dataSale, setdataSale] = useState();
    const [pricePayment, setPricePayment] = useState(0);
    const [idSale, setIdSale] = useState(null);

    const dispatch = useDispatch();
    const [showUser, setshowUser] = useState(false);
    const [methodPayment, setmethodPayment] = useState(2);
    const [form] = Form.useForm();
    const [paymentSucess, setpaymentSucess] = useState(false);
    const textMethodBank = "Make payments right into our bank account. Please use your Order ID in the Checkout text section. The order will be delivered after the money has been transferred."
    const location = useLocation();
    const receivedDataSale = location.state?.data;
    console.log({receivedDataSale});
    useEffect(()=>{
        setpaymentSucess(false)
        setshowUser(false)
        if(receivedDataSale  !=undefined){
            setpromoprice(receivedDataSale.cost_sale)
        }
        if(dataCart.length!==undefined){
            let total = 0;
            dataCart.map((e,index)=>{
                if(e[0].promotional===null){
                    total+=e[0].price*e.quanity
                }else{
                    total+=e[0].promotional*e.quanity
                }
                if(index===dataCart.length-1){
                    settotalTmp(total)
                }
                return false
            })
        }  
       
        getUser(); 
    },[datauser])
    const getUser = async()=>{
        if(datauser.name!==undefined){
            const res = await FetchAPI.postDataAPI("/user/getInforUser",{"idUser":datauser.id})
            const user = res[0];
            form.setFieldsValue({name:user?.name,email:user?.email,address:user?.address,phone:user?.phone})
            setname(user?.name);
            setemail(user?.email);
            setidUser(user?.id);
            setaddress(user?.address);
            setphone(user?.phone);
            setshowUser(true)
        }else{  
            form.setFieldsValue({name:"",email:"",address:"",phone:""})
            setname("");
            setemail("");
            setidUser("");
            setaddress("");
            setphone("");
            setshowUser(true);
        }
    }
    const handleValidationOrder = ()=>{
        if(methodPayment===2){
            handleOrder();
        }else{
            console.log("Pay later")
        }
    }
    const handleOrder = async()=>{
        let saleID = null;
        let shipfee = 10
        // let total_payment = totalTmp;
        if(receivedDataSale != undefined){
            saleID = receivedDataSale.id;
        }
        let total_payment = getPricePayment()
        
        const data = {
            "name": name,
            "address": address,
            "email" : email,
            "phone" : phone,
            "total_price":total_payment,
            "message":message,
            "dataProduct":dataCart,
            "methodPayment":methodPayment,
            "user": idUser,
            "idSale":saleID,
        }
        console.log({data});
        const res = await FetchAPI.postDataAPI("/order/addBill",data);
        if(res.msg){
            if(res.msg==="success"){
                localStorage.removeItem("cart");
                updateCartCurrent(dispatch);
                setpaymentSucess(true)
            }else{
                console.log(res.msg)
            }
        }
    }
    const columns  = [
        {
            title:"Product",
            key:'name',
            render: record=>{
                return (
                    <Row>
                        <span>{record[0].name+" - ( "+record.option+" )"}</span>
                        <span style={{ fontWeight:'bold',paddingLeft:20 }}>X {record.quanity}</span>
                    </Row>
                )
            }
        },
        { 
            title:"Provisional",
            dataIndex:"",
            key:'temp',
            render:(record)=>{
                if(record[0].promotional===null){
                    return <span>{getPriceVND(record[0].price*record.quanity)+" $"}</span>
                }else{
                    return <span>{getPriceVND(record[0].promotional*record.quanity)+" $"}</span>
                }
            }
        }
    ]
    const InformationPayment = ()=>(
       <div style={{ padding:20 }}>
           <div style={{ display:'flex',flexDirection:'column', marginBottom: 10 }}>
            {receivedDataSale  ===undefined &&
                <span >Do you have a promotional code ?<Link to="/cart"> Come back</Link> shopping cart to receive promotion !</span>
            }
           </div>
           <h2 style={{fontWeight: "bold"}}>BILLING INFORMATION</h2>
            <Form.Item
                name="name"
                label="Full name"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[{ required: true, message: 'Please enter your full name !' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Enter your full name"
                    value={name}
                    defaultValue={name}
                    onChange= {(e)=>setname(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                name="address"
                label="Address"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[{ required: true, message: 'Please enter your address !' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Enter address"
                    value={address}
                    defaultValue={address}
                    onChange= {(e)=>setaddress(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                name="phone"
                label="Phone number"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[{ required: true, message: 'Please enter the phone number !' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Enter your phone number"
                    value={phone}
                    defaultValue={phone}
                    onChange= {(e)=>setphone(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[
                    { type: 'email',message:"Please enter correct Email"},
                    {required:true,message:"Please fill in Email!"},
                ]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Enter your email address"
                    value={email}
                    defaultValue={email}
                    onChange= {(e)=>setemail(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                    disabled={datauser.id!==undefined}
                />
            </Form.Item>
            <Form.Item
                name= 'introduction'
                label="Order notes"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                style={{width:'80%'}}
            >
                <Input.TextArea
                    placeholder="Notes about the order, for example, time or more detailed delivery location instructions."
                    value={message}
                    defaultValue={message}
                    onChange= {(e)=>setmessage(e.target.value)}
                    maxLength={200}
                    style={{height:200}}
                />
            </Form.Item>
       </div>
    )
    const getPricePayment = () =>{
        let total_payment = totalTmp;
        let shipfee = 10;
        if(receivedDataSale != undefined){
          
            if (receivedDataSale.type == 0) {
                shipfee = shipfee - receivedDataSale.cost_sale;
                shipfee = shipfee > 0 ? shipfee : 0;
            } 
            else {
                total_payment = total_payment- receivedDataSale.cost_sale
            }
        }
        total_payment = total_payment + shipfee;
        return total_payment;
    }
    const Payment = ()=>(
        <div style={{ border:"2px solid black",padding:20 }}>
            <h2 style={{fontWeight: "bold"}}>YOUR ORDER</h2>
            <Table 
                dataSource={dataCart} 
                columns={columns} 
                pagination={false}
                summary={()=>(
                    <Table.Summary>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Provisional</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{getPriceVND(totalTmp)+" $"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                        {receivedDataSale !== undefined &&
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Promotional code</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{"-"+getPriceVND(promoprice)+" $"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                        }
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Transport fee</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{getPriceVND(10)+" $"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Total</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{getPriceVND(getPricePayment())+" $"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
            )}/>

            <Radio.Group  
                style={{paddingTop:20}}
                value={methodPayment}
                onChange= {(e)=>setmethodPayment(e.target.value)}
                horizontal
            >
            <Space direction="vertical">
                <Radio value={2}><b>Pay cash upon delivery</b><br/>
                    {methodPayment===2 ? <span>Pay cash upon delivery</span>:null}
                 </Radio>
                <Radio value={1}
                ><b>Bank transfer</b> <br/>
                </Radio>
            </Space> 
            </Radio.Group>
            {methodPayment===1 && 
                    <Paypal
                        style= {{ marginTop : 20 }}  
                        payload={{
                            products: null ,
                            total: getPricePayment(),
                        }}
                        setIsSuccess={isSuccess}
                        amount={getPricePayment()}
                    />

            }
            
            <Form.Item style={{ paddingTop:20 }}>
                <Button type="primary" htmlType="submit" danger style={{ height:60,width:120,fontWeight:'bold' }} onClick={()=>console.log(email)}>
                  Order
                </Button>
            </Form.Item>
            <div >
            <span >Your personal information will be used to process orders, enhance your website experience, and for other specific purposes described in the privacy policy.</span>
            </div>
        </div>
    )
    const Content = ()=>(
        <div>
        {dataCart.length!==undefined ?
            <div>
            {showUser &&
            <Form 
                style={{ padding:"10px 40px" }} 
                onFinish={handleValidationOrder}
                form={form}
                initialValues={{
                    name: name,
                    email: email
                }}
                
            >
                <Row>
                    <Col xl={14} xs={24} >
                        {InformationPayment()}
                    </Col >
                    <Col xl={10} xs={24} >
                        {Payment()}
                    </Col>
                </Row>
            </Form>
            }
            </div>
            :
            <div style={{ height:450,padding:"20px 40px" }}>
            <span style={{ fontWeight:'bold' }}> Please add product to cart to perform this function...</span>
            <div style={{ display:'flex',flex:1,justifyContent:'center',paddingTop:"10%" }}>
                        <Button style={{ height:50 }} type="primary" danger>
                            <Link to="/">
                              Return to the store
                            </Link>
                        </Button>
                    </div>
            </div>
        }   
        </div>
    )
    return(
        <div>
            {paymentSucess ? 
            <Result
                style={{ height:450,paddingTop:50 }}
                status="success"
                title="Order Success !"
                subTitle="Track your order?"
                extra={[
                <Button type="primary">
                    <Link to="/">
                      Continue ordering products
                    </Link>
                </Button>,
                <Button >
                    <Link to="/billfollow">
                      Order tracking
                    </Link>
                </Button>,
            ]}
          />
            :
            <div>
                {Content()}
            </div>
            }
        </div>
        
    )
} 