import React ,{useEffect,useState} from'react';
import { PageHeader,Table,Row,Col,Space,Card ,Button,message,Select,Modal} from 'antd';
import { useHistory,useParams,useLocation } from 'react-router-dom';
import {getPriceVND} from '../../contain/getPriceVND';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {PrinterOutlined} from '@ant-design/icons';

const {Option} = Select;
export default function BillDetails(){
    const [dataProduct, setdataProduct] = useState();
    const [dataBill, setdataBill] = useState();
    const [dataSale, setdataSale] = useState();
    const [totalTmp, settotalTmp] = useState(0);
    const [promotionprice, setpromotionprice] = useState(0);
    const [showContent, setshowContent] = useState(false);
    const [showModalDeleteBill, setshowModalDeleteBill] = useState(false);
    const {idBill} = useParams();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        setshowContent(false);
        getProduct();
        getInforPayment();
    },[location])
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
        setdataBill(bill[0])
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
    const hanldeUpdateStatus = async(value,code,id)=>{
        // setloadingTable(true);
        const data = {"code_order":code,"status":value};
        const res = await FetchAPI.postDataAPI("/order/updateStatusBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Update bill #"+id+" successfully !");
                    // setloadingTable(false);
                },500)
            }else{
                setTimeout(()=>{
                    message.error("There's an error !!");
                    // setloadingTable(false);
                },500)
            }
        }
    }
    const handlePrintInvoices = ()=>{
        let inforbill = document.getElementById('Inforbill');
        let product = document.getElementsByClassName('BillProduct');
        let price = document.getElementsByClassName('BillPrice');
        let shipping = document.getElementsByClassName('Shipping');
        let totalBill = document.getElementsByClassName('TotalBill');
        let saleBill = document.getElementsByClassName('SaleBill');
        let tableProduct = "<table style=\"width:100%;text-align:center\"><tr><td style=\"width:33%;border:2px solid black;height:40px\"><b>Product</b></td><td style=\"width:33%;border:2px solid black\"><b>Provisional</b></td></tr>";
        for(var i=0;i<product.length;i++){
            tableProduct += "<tr > <td style=\"width:33%;border:1px solid black;height:70px\">"+product[i].innerHTML+"</td><td style=\"width:33%;border:1px solid black\">"+price[i].innerHTML+"</td> </tr>"
        }
        let pri = document.getElementById('ifmcontentstoprint').contentWindow;
        pri.document.open();
        pri.document.write(inforbill.outerHTML);
        pri.document.write("<b>Transport fee:</b>   "+shipping[0].innerHTML);
        pri.document.write(tableProduct+"</table>");
        if(saleBill.length!==0){
            pri.document.write("<div style=\" padding-top:18px;font-size:24px\"><b> Promotion code :  </b>"+saleBill[0].innerHTML+"</div>");
        }
        pri.document.write("<div style=\" padding-top:18px;font-size:24px\"><b> Total :  </b>"+totalBill[0].innerHTML+"</div>");
        pri.document.close();
        pri.focus();
        pri.print();
    }
    const handleDeleteItem = async()=>{
        setshowContent(false);
        setshowModalDeleteBill(false);
        const data = {"code_order":dataBill.code_order};
        const res = await FetchAPI.postDataAPI("/order/deleteBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success(`You have successfully deleted invoice  #${dataBill.id} !`);
                history.push('/admin/invoices')
            }else{
                message.error("There's an error !!");
                setshowContent(true)
            }
        }
    }
    const columns  = [
        {
            title:"Product",
            key:'product',
            render : record=>{
                return(
                    <div className="BillProduct">
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
                return <span className="BillPrice">{getPriceVND(record.price*record.quanity) +" $"}</span>
            }
        }
    ]
    const ViewProduct = ()=>(
        <Table 
            columns={columns}
            dataSource={dataProduct}
            pagination={false} 
            size="small"
            style={{boxShadow:'2px 0px 30px #00000026',padding:10}}
            summary={()=>(
                <Table.Summary>
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Provisional</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>{getPriceVND(totalTmp)+" đ"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    {dataSale !== undefined &&
                        <Table.Summary.Row >
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Promotion code</span></Table.Summary.Cell>
                            <Table.Summary.Cell className="SaleBill" index={1}>{"-"+getPriceVND(promotionprice)+" $"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    }
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Transport fee</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}  className="Shipping" >{getPriceVND(30000)+" $"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row >
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Total</span></Table.Summary.Cell>
                        <Table.Summary.Cell className="TotalBill" index={1}>{getPriceVND(totalTmp-promotionprice+30000)+" $"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                </Table.Summary>
        )}
        />      
    )
    const getStatus = (status)=>{
       return(
        <Select 
            defaultValue={status}  
            style={{ width: 120 }} 
            onChange={(value)=>hanldeUpdateStatus(value,dataBill.code_order,dataBill.id)}
            disabled={status===3}
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
    return(
        <div>
            {showContent ?
            <div>
            <PageHeader
                className="site-page-header"
                onBack={() => history.goBack()}
                title="Order details"
                subTitle={"Order code: #"+dataBill.id}
            />
            <Row>
                <Col lg={14} xs={24} style={{ padding:"20px 40px" }} >
                    {ViewProduct()}
                    <Card title="Payment address" style={{ marginTop:30,boxShadow:'2px 0px 30px #00000026' }}>
                    <div style={{ fontSize:16 }}>
                    <Space direction="vertical" size={20}>
                        <span><b>Name: </b>{dataBill.name}</span>
                        <span><b>Address: </b>{dataBill.address}</span>
                        <span><b>Email: </b>{dataBill.email}</span>
                        <span><b>Phone: </b>{dataBill.phone} </span>
                    </Space>
                    </div>
                    </Card>
                </Col>
                <Col lg={10} xs={24} style={{ justifyContent:'center',display:'flex' }}>
                    <Card title="Order information." style={{ marginTop:20,width:'80%',boxShadow:'2px 0px 30px #00000026' }}>
                    <ul>
                        <Space size={10} direction="vertical">
                            <div id="Inforbill">
                            <Space size={10} direction="vertical">
                                <li>Order code : <b>{"#"+dataBill.id}</b></li>
                                <li>Date order: <b>{new Date(dataBill.create_at).toString().split('GMT')[0]}</b></li>
                                <li>Customer name : <b>{dataBill.name}</b></li>
                                <li>Email : <b>{dataBill.email}</b></li>
                                <li>Total : <b>{getPriceVND(totalTmp-promotionprice)+" đ"}</b></li>
                                <li>Updated order time: <b>{new Date(dataBill.update_at).toString().split('GMT')[0]}</b></li>
                                <li>Payment method: 
                                    <b>{dataBill.methodPayment===1 ? "Bank transfer":"Pay cash"}</b>
                                </li>
                            </Space>
                            </div>
                            <li>
                                Tình trạng : {getStatus(dataBill.status)}
                            </li>
                            <div style={{ marginTop: 20}}>
                                <Button style={{ borderRadius : 10}} type="primary" danger onClick={()=>setshowModalDeleteBill(true)}>
                                    Delete invoice
                                </Button>
                                <Button  type="primary" success style={{ marginLeft:30, borderRadius : 10 }} onClick={handlePrintInvoices}>
                                    Print invoice <PrinterOutlined />
                                </Button>
                            </div>
                        </Space>
                    </ul>
                    </Card>
                </Col>
            </Row> 
            {showModalDeleteBill &&
                <Modal
                    title={`You definitely want to delete the invoice #${dataBill.id}`}
                    visible={showModalDeleteBill}
                    onOk={handleDeleteItem}
                    onCancel={()=>setshowModalDeleteBill(false)}
                    cancelText="Exit"
                    okText="Sure"
                >
                    <p>You are sure of your decision! All data about this invoice will be deleted.</p>
                    <p>And the products in this invoice will be returned to the inventory !</p>
                </Modal>
            }
            <iframe 
                id="ifmcontentstoprint" 
                style={{
                        height: '0px',
                        width: '0px',
                        position: 'absolute'
                }}
            ></iframe>  
            </div>
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}