import React ,{useEffect,useState}from 'react'; 
import { PageHeader,Table,Row,Col,Space,Card ,Button,message,Modal} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import {getPriceVND} from '../../contain/getPriceVND';
import Spinner from '../../elements/spinner';
import { useSelector } from 'react-redux';
import { useParams,useHistory } from 'react-router-dom';
import ModalReviewProduct from '../../elements/ModalReviewProduct';
import moment from 'moment';

export default function BillDetails(){
    const history = useHistory();
    const [dataProduct, setdataProduct] = useState();
    const [dataBill, setdataBill] = useState();
    const [totalTmp, settotalTmp] = useState(0);
    const [showContent, setshowContent] = useState(false);
    const [promotionprice, setpromotionprice] = useState(0);
    const [showModalReview, setshowModalReview] = useState(false);
    const [showModalCancel, setshowModalCancel] = useState(false);
    const [dataSale, setdataSale] = useState();
    const currentUser = useSelector(state=>state.userReducer.currentUser);
    const [statusUser, setstatusUser] = useState(false);
    const {idBill} = useParams();

    useEffect(()=>{
        console.log(idBill)
        setstatusUser(false);
        setshowContent(false)
        getProduct();
        getInforPayment();
    },[currentUser])
    const getProduct = async()=>{
        const data = {"idOrder":idBill}
        const product = await FetchAPI.postDataAPI('/order/getProductByIdBill',data);
        if(product!==undefined){
            let total = 0;
            product.map((e,index)=>{
                total+= e.price*e.quanity;
                if(index===product.length-1){
                    settotalTmp(total);
                }
                return false;
            })
        }
        setdataProduct(product);
    }
    const getInforPayment = async()=>{
        const data = {"idOrder":idBill}
        const bill = await FetchAPI.postDataAPI('/order/getBillById',data);
        if(currentUser.id===undefined){
            setstatusUser(false)
        }else{
            if(currentUser.id===bill[0].idUser){
                setstatusUser(true)
            }
        }
        setdataBill(bill[0])
        console.log({dataBill});
        if(bill[0].idSale!==null){
            getSale(bill[0].idSale);
        }
        setshowContent(true)
    }
    const getSale = async(idSale)=>{
        const res = await FetchAPI.postDataAPI("/order/getSaleById",{"idSale":idSale})
        if(res!==undefined){
            setdataSale(res[0])
            setpromotionprice(res[0].cost_sale)
        }
    }
    const handleCancelBill = async()=>{
        const data = {"code_order":dataBill.code_order,"status":3,"email":currentUser.email}
        const res = await FetchAPI.postDataAPI("/order/updateStatusBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    setshowModalCancel(false)
                    message.success("Order canceled successfully !");
                    history.goBack();
                },500)
            }else{
                setTimeout(()=>{
                    setshowModalCancel(false)
                    message.error("There's an error !");
                 
                },500)
            }
        }
    }
    const ModalCancelBill = ()=>(
        <Modal
            title={`You definitely want to cancel your order #${dataBill.id}`}
            visible={showModalCancel}
            onOk={handleCancelBill}
            onCancel={()=>setshowModalCancel(false)}
            cancelText="Exit"
            okText="Sure"
        >
            <p>You are sure of your decision ! Your order will be canceled.</p>
        </Modal>
    )
    const getPricePayment = () =>{
        let total_payment = totalTmp;
        let shipfee = 10;
        if(dataSale != undefined){
          
            if (dataSale.type == 0) {
                shipfee = shipfee - dataSale.cost_sale;
                shipfee = shipfee > 0 ? shipfee : 0;
            } 
            else {
                total_payment = total_payment- dataSale.cost_sale
            }
        }
        total_payment = total_payment + shipfee;
        return total_payment;
    }
    const columns  = [
        {
            title:"Product",
            key:'product',
            render : record=>{
                return(
                    <div>
                        <span>{record.name_product+" ( "+record.size +" )"}</span>
                        <span style={{ paddingLeft:20,fontWeight:'bold' }}>{"X" +record.quanity}</span>
                    </div>
                )
            }
        },
        {
            title:"Total",
            key:'total_price',
            render: record=>{
                return <span>{getPriceVND(record.price*record.quanity ) +" $"}</span>
            }
        }
    ]
    const ViewProduct = ()=>(
        <Table 
            columns={columns}
            dataSource={dataProduct}
            pagination={false} 
            size="small"
            summary={()=>(
                <Table.Summary>
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Provisional</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>{getPriceVND(totalTmp)+" $"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    {dataSale !== undefined &&
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Promotional code</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{"-"+getPriceVND(promotionprice)+" $"}</Table.Summary.Cell>
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
                    {dataBill.status===2 &&
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Product reviews</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                            <Button onClick={()=>setshowModalReview(true)}>
                              Rate now
                            </Button>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                    }
                </Table.Summary>
        )}
        />      
    )
    const getTextStatus = (a)=>{
        if(a===0){
            return <b>Processing</b>
        }else if(a===1){
            return <b>Delivering</b>
        }else if(a===2){
            return <b>Completed</b>
        }else{
            return <b>Cancelled</b>
        }
    }
    return(
        <div style={{ minHeight:450,paddingBottom:20 }}>
            {showContent ?
            <div>
            {statusUser ?
            <div>
                
            <PageHeader
                className="site-page-header"
                onBack={() => history.goBack()}
                title="Order details"
                subTitle={"Code order: #"+dataBill.id}
            />
            <Row>
            <Col lg={14} xs={24} style={{ padding:"20px 40px" }} >
                {ViewProduct()}
                <Card title="Payment address" style={{ marginTop:30 }}>
                <div style={{ fontSize:16 }}>
                <Space direction="vertical" size={20}>
                    <span><b>Name: </b>{dataBill.name}</span>
                    <span><b>Address: </b>{dataBill.address}</span>
                    <span><b>Email: </b>{dataBill.email}</span>
                    <span><b>Phone number: </b>{dataBill.phone} </span>
                </Space>
                </div>
                </Card>
            </Col>
            <Col lg={10} xs={24} style={{ justifyContent:'center',display:'flex' }}>
                <Card title="Thank you. Order has been received." style={{ marginTop:20,width:'80%' }}>
                <ul>
                    <Space size={10} direction="vertical">
                        <li>Code order : <b>{"#"+dataBill.id}</b></li>
                        <li>Order date: <b>{moment(new Date(dataBill.create_at)).format("YYYY-MM-DD hh:mm:ss")}</b></li>
                        <li>Email : <b>{dataBill.email}</b></li>
                        <li>Total : <b>{getPriceVND(getPricePayment())+" $"}</b></li>
                        <li>Time to update invoices: <b> {moment(new Date(dataBill.update_at)).format("YYYY-MM-DD hh:mm:ss")}</b></li>
                        <li>Payment method: 
                            <b>{dataBill.method_payment === 1 ? " Bank transfer":" Pay cash"}</b>
                        </li>
                        <li>
                          Status : {getTextStatus(dataBill.status)}
                        </li>
                        <div>
                            <Button type="primary" onClick={()=>setshowModalCancel(true)} danger disabled={dataBill.status!==0} >
                              Cancel order
                            </Button>
                        </div>
                    </Space>
                </ul>
                </Card>
            </Col>
            </Row> 
            <ModalReviewProduct 
                visible={showModalReview}
                onCancel={()=>setshowModalReview(false)}
                refresh={()=>getProduct()}
                dataProduct={dataProduct}
                user={currentUser}
            /> 
            {ModalCancelBill()}
            </div>
            :
            <div style={{ padding:"20px 40px" }}>
                <span style={{ fontWeight:'bold' }}>You do not have permission to access this invoice...</span>
            </div>
            }
            </div>
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}