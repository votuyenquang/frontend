import React,{useEffect,useState,useLayoutEffect} from 'react';
import {Row,Col,Table,InputNumber,message,Image,Button,Input} from 'antd';
import { useSelector,useDispatch } from 'react-redux';
import {getPriceVND} from '../../contain/getPriceVND';
import * as FetchAPI from '../../util/fetchApi';
import {updateCartCurrent} from '../../contain/updateQuanityCart';
import {DeleteOutlined,ArrowLeftOutlined,GiftOutlined} from '@ant-design/icons';
import {Link,useHistory} from 'react-router-dom';
export default function Cart (){
    const dataCart = useSelector(state=>state.productReducer.cart);
    const dispatch = useDispatch();
    const [totalTmp, settotalTmp] = useState(0);
    const [promoprice, setpromoprice] = useState(0);
    const [dataSale, setdataSale] = useState();
    const [codeSale, setcodeSale] = useState("");
    const history = useHistory();
    const [overflowX, setoverflowX] = useState(false);

    useLayoutEffect(() => {
        function updateSize() {
            if(window.innerWidth<700){
                setoverflowX(true);
            }else{
                setoverflowX(false);
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();
    }, []);
    useEffect(()=>{
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
                return false;
            })
        }   
    },[dataCart])
   
    const hanldeEditQuanity = async(e,index)=>{
        const dataOut = localStorage.getItem("cart");
        let objDataOut = JSON.parse(dataOut);
        let postition = objDataOut.findIndex(x=> x.id===index[0].id && x.option===index.option);
        const inventory = await FetchAPI.postDataAPI("/product/getProductInventory",{"id":index[0].id});
        inventory.map((i)=>{
            if(i.size===index.option){
                let q = i.quanity-i.sold;
                if(e===null){
                    objDataOut[postition].quanity = 1;
                }
                else if(e>q){
                    message.warning(index[0].name+" size "+index.option+" chỉ còn "+q+" sản phẩm");
                    objDataOut[postition].quanity = q;
                }else{
                    objDataOut[postition].quanity = e;
                }
    
            }
        })
        localStorage.setItem("cart",JSON.stringify(objDataOut));
        updateCartCurrent(dispatch);
    }
    const handleDeleteItem = (index)=>{
        const dataOut = localStorage.getItem("cart");
        let objDataOut = JSON.parse(dataOut);
        if(objDataOut.length===1){
            localStorage.removeItem("cart");
            updateCartCurrent(dispatch);
        }else{
            let postition = objDataOut.findIndex(x=> x.id===index[0].id && x.option===index.option);
            objDataOut.splice(postition,1);
            localStorage.setItem("cart",JSON.stringify(objDataOut));
            updateCartCurrent(dispatch);
        }
        
    }
    const handlePayment = ()=>{
 
        history.push({
            pathname:'/payment',
            dataSale:dataSale
        });
    
    }
    const handleValidationCodeSale = async()=>{
        if(codeSale===""){
            message.warning("You haven't entered the promotion code yet !")
        }else{
            const res = await FetchAPI.postDataAPI("/order/getSaleByCode",{"code":codeSale.toUpperCase()})
            if(res.msg){
                if(res.msg==="Sale not exist"){
                    message.warning("This code does not exist !")
                }
            }else if(res!==undefined){
                handleCodeSale(res[0])
            }
        }
    }
    const handleCodeSale = (data)=>{
        const currentTime = Date.now();
        const timeStart = new Date(data.date_start);
        const timeExpired = new Date(data.expired);
        if(currentTime<timeStart){
            message.warning("The event hasn't started yet !")
        }else if(currentTime>timeExpired){
            message.warning("The event has ended !")
        }else if(data.quanity-data.used===0){
            message.warning("This number of codes has expired !")
        }
        else{
            setdataSale(data);
            setpromoprice(data.cost_sale);
            setcodeSale("");
            message.success(
                "You have applied the code "+data.code_sale+ 
                " of event "+data.name_event_sale+
                " sale "+getPriceVND(data.cost_sale)+" $"
            )
        }
      
    }
    const columns  = [
        {
            title:"Product",
            key:'name',
            render: record=>{
                return (
                    <Row>
                        <Col xl={5} xs={24}>
                            <Image src={record[0].image} width={80}/>
                        </Col>
                        <Col xl={19} xs={24} style={{ paddingLeft:10 }}>
                            <span>{record[0].name+" - ( "+record.option+" )"}</span>
                        </Col>
                    </Row>
                )
            }
        },
        {
            title:"Price",
            key:'price',
            dataIndex:"",
            render:record =>{
                if(record[0].promotional===null){
                    return <span>{getPriceVND(record[0].price)+" $"}</span>
                }else{
                    return <span>{getPriceVND(record[0].promotional)+" $"}</span>
                }
            }
        },
        { 
            title:"Quantity",
            dataIndex:'',
            key:'quanity',
            render: (record,index)=>{
                return <InputNumber 
                value={record.quanity} 
                defaultValue={record.quanity} 
                min={1} max={20} 
                onChange={(e)=>hanldeEditQuanity(e,index)}/>  
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
        },{
            title:"Custom",
            key:"delete",
            render: (record,index) =>{
                return (
                    <div style={{ display:'flex',justifyContent:'center' }}>
                        <DeleteOutlined style={{fontSize:20,cursor:"pointer" }} onClick={()=>handleDeleteItem(index)}/>
                    </div>
                )
            }
        }
    ]
    
    // rowSelection object indicates the need for row selection
    // const rowSelection = {
    //     onChange: (selectedRowKeys, selectedRows) => {
    //        console.log(selectedRows)
    //     },
        
    // };
    const ViewPayment = ()=>(
        <div style={{ paddingLeft:20 }}>
           <span style={{ fontWeight:'bold',fontSize:16 }}> Add shopping cart</span>
           <div style={{ paddingTop:10,fontSize:16,justifyContent:'space-between',display:'flex' }}>
               <span>Provisional</span>
               <span style={{ paddingRight:20,fontWeight:'bold' }}>{getPriceVND(totalTmp) +" $"}</span>
           </div>
           <div style={{ paddingTop:10,fontSize:16,justifyContent:'space-between',display:'flex' }}>
               <span>Total</span>
               <span style={{ paddingRight:20,fontWeight:'bold' }}>{getPriceVND(totalTmp-promoprice) +" $"}</span>
           </div>
           {dataSale!==undefined &&
            <div style={{ paddingTop:10,display:'flex',justifyContent:'space-between' }}>
                <div>
                <span>Discount code: {dataSale.code_sale}</span>
                </div>
                <span style={{ paddingRight:20 }}><b>{"-"+getPriceVND(dataSale.cost_sale) +" $"}</b></span>
            </div>
           }
           <div style={{ paddingTop:20,justifyContent:'center',display:'flex' }}>
           <Button type="primary" danger style={{ width:'80%',height:40 }} onClick={handlePayment}>
               PROCEED TO PAY
           </Button>
           </div>
           <div style={{ paddingTop:20,display:'flex',flexDirection:'column' }}>
                <span style={{ fontWeight:'bold',fontSize:16 }}>
                    <GiftOutlined /> Vouchers
                </span>
                <div style={{ display:'flex',alignItems:'center',paddingTop:10,flexDirection:'column'}}>
                <Input 
                    placeholder="Promotion code"
                    style={{width:'80%',height:40}}
                    value={codeSale}
                    defaultValue={codeSale}
                    onChange= {(e)=>setcodeSale(e.target.value)}
                />
                <Button style={{ width:'80%',height:40,marginTop:10 }} onClick={handleValidationCodeSale}>
                   APPLY
                </Button>
                </div>
            </div>
        </div>
    )
    const ViewCart = ()=>(
        <div>
        <Table 
            dataSource={dataCart} 
            columns={columns} 
            size="small" 
            style={overflowX?{overflowX:'scroll'}:null} 
            pagination={{ defaultPageSize: 3 }}
            // rowSelection={{ 
            //     type:'checkbox',
            //     ...rowSelection
            // }}
        />
        <Button type="primary" danger style={{ height:40,marginBottom:20 }}>
            <Link to="/">
                <ArrowLeftOutlined /> Continue viewing products
            </Link>
        </Button>
        </div>
    )
    return (
        <div className="wrapperCart" >
            {dataCart.length===undefined ?
            <div style={{ height:400,padding:"20px 10px" }}>
                <span style={{ fontWeight:'bold',fontSize:16 }}>There are no products in the cart...</span>
                <div style={{ display:'flex',flex:1,justifyContent:'center',paddingTop:"10%" }}>
                    <Button style={{ height:50 }} type="primary" danger>
                        <Link to="/">
                          Return to the store
                        </Link>
                    </Button>
                </div>
            </div>
            :
            <Row>
                <Col lg={14} xs={24} >
                    {ViewCart()}
                </Col>
                <Col lg={10} xs={24} >
                    {ViewPayment()}
                </Col>
            </Row>
            }
          
        </div>
    )
}