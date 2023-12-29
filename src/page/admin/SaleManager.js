import React,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {getPriceVND} from '../../contain/getPriceVND';
import {InputNumber,Table,DatePicker,Button,message,Drawer,Form,Input,Modal} from 'antd';
import moment from 'moment';
import {PlusCircleOutlined} from '@ant-design/icons';
import { useSelector } from 'react-redux';
const { RangePicker } = DatePicker;
export default function SaleManager(){
    const [showContent, setshowContent] = useState();
    const [dataFullPromotion, setdataFullPromotion] = useState();
    const [loadingTable, setloadingTable] = useState(false);
    const [loadingBtn, setloadingBtn] = useState(false);
    const [showDrawer, setshowDrawer] = useState(false);
    const [showModalDelete, setshowModalDelete] = useState(false);
    const [itemTmp, setitemTmp] = useState();
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    const [dataAddSale, setdataAddSale] = useState({});
    const [formAddSale] = Form.useForm();
    useEffect(()=>{
        getFullPromotion();
    },[])
    const getFullPromotion = async()=>{
        const res = await FetchAPI.getAPI('/promotion/getFullPromotion');
        setdataFullPromotion(res)
        setshowContent(true)
    }
    const handleEditDate = async(e,id)=>{
        setloadingTable(true);
        if(e===null){

        }else{
            const date_start = moment(e[0]._d).format('YYYY-MM-DD HH:mm:ss')
            const expired = moment(e[1]._d).format('YYYY-MM-DD HH:mm:ss')
            const data = {"date_start":date_start,"expired":expired,"id":id};
            const res = await FetchAPI.postDataAPI("/promotion/updateTimeSale",data);
            if(res.msg){
                if(res.msg==="Success"){
                    setTimeout(()=>{
                        message.success("Update promotional code #"+id+" successfully !");
                        setloadingTable(false);
                    },500)
                }else{
                    setTimeout(()=>{
                        message.error("There's an error !!");
                        setloadingTable(false);
                    },500)
                }
            }
        }
    }
    const handleEditQuanity = async(e,id)=>{
        setloadingTable(true);
        const data={"quanity":e,"id":id};
        const res = await FetchAPI.postDataAPI("/promotion/updateQuanitySale",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Update promotional code #"+id+" successfully !")
                    getFullPromotion();
                    setloadingTable(false);
                },500)
            }else{
                setTimeout(()=>{
                    message.error("There's an error !!");
                    setloadingTable(false);
                })
            }
        }
    }
    const handleAddSale = async()=>{
        setloadingBtn(true);
        const data = {"data":dataAddSale};
        const res = await FetchAPI.postDataAPI("/promotion/addPromotion",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Added promotion code successfully !")
                    getFullPromotion();
                    setdataAddSale({});
                    formAddSale.setFieldsValue({name_event_sale:"",cost_sale:"",code_sale:"",quanity:"",time:""});
                    setshowDrawer(false);
                    setloadingBtn(false);
                },500)
            }else{
                setTimeout(()=>{
                    message.error("There's an error !!");
                    setloadingBtn(false);
                })
            }
        }
    }
    const handleDeleteSale = async()=>{
        const data = {"id":itemTmp.id}
        const res = await FetchAPI.postDataAPI("/promotion/deleteSale",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Deleted code successfully")
                setshowModalDelete(false)
                getFullPromotion()
            }else{
                message.error("There's an error !!")
                setshowModalDelete(false)
            }
        }
    }
    const columns  = [
        {
            title:"Event",
            key:'name_event_sale',
            render: record=><span>{record.name_event_sale}</span>
        },
        {
            title:"Code",
            key:'code_sale',
            render: record=><span>{record.code_sale}</span>
        },
        {
            title:"Amount decreased",
            key:'cost_sale',
            render: record=><span>{getPriceVND(record.cost_sale)+" đ"}</span>
        },
        {
            title:"Quantity",
            key:'quanity',
            render: record=>(
                <InputNumber 
                    value={record.quanity}
                    min= {0}
                    onChange= {e=>handleEditQuanity(e,record.id)}
                />
            )
        },
        {
            title:"Used",
            key:'used',
            render:record=><span>{record.used}</span>
        },
        {
            title:"Rest",
            key:'rest',
            render: record=><span style={{fontWeight:'bold'}}>{record.quanity-record.used}</span>
        },
        {
            title:<div style={{textAlign: 'center'}}><span>Discount period</span></div>,
            key:'date_start',
            sorter: (a, b) =>new Date(a.date_start)- new Date(b.date_start),
            render: record=>(
                <RangePicker 
                    value={[moment(record.date_start),moment(record.expired)]}
                    renderExtraFooter={() => 'extra footer'}
                    showTime 
                    onChange= {(e)=>handleEditDate(e,record.id)}
                />
            )
        },
        {
            title:"Customize",
            key:'edit',
            render: record=>(
                <Button onClick={()=>{
                    setshowModalDelete(true);
                    setitemTmp(record)
                }}>
                    Delete
                </Button>
            )
        }
    ]
    const DrawerAddSale = ()=>(
        <Drawer
            title="Add promotional code" 
            placement="right" 
            width={overflowX ?"100%":520}
            getContainer={false}
            onClose={()=>setshowDrawer(false)} 
            visible={showDrawer}
           
        >
            <Form
                form={formAddSale}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                onFinish={handleAddSale}
            >
                <Form.Item
                    label="Event"
                    name="name_event_sale"
                    rules={[{required: true, message:'Please enter an event name'}]}
                >
                    <Input 
                        placeholder="Enter an event name"
                        value={dataAddSale.name_event_sale}
                        onChange= {(e)=>setdataAddSale({...dataAddSale,name_event_sale:e.target.value})}
                    />
                </Form.Item>
                <Form.Item
                    label="Code"
                    name="code_sale"
                    rules={[{required: true, message:'Please enter code!'}]}
                >
                    <Input 
                        placeholder="Enter code"
                        value={dataAddSale.code_sale}
                        onChange= {(e)=>setdataAddSale({...dataAddSale,code_sale:e.target.value})}
                    />
                </Form.Item>
                <Form.Item
                    label="Cost sale"
                    name="cost_sale"
                    rules={[{ required: true, message: 'Please enter cost sale!' }]}
                >
                    <InputNumber
                        placeholder="Prices decrease"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                        value={dataAddSale.cost_sale}
                        onChange={(e)=>setdataAddSale({...dataAddSale,cost_sale:e})}
                    />
                </Form.Item>
                <Form.Item
                    label="Quantity"
                    name="quanity"
                    rules={[{ required: true, message: 'Please enter quantity!' }]}
                >
                    <InputNumber
                        placeholder="Quantity"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                        value={dataAddSale.quanity}
                        onChange={(e)=>setdataAddSale({...dataAddSale,quanity:e})}
                    />
                </Form.Item>
                <Form.Item
                    label="Time"
                    name="time"
                    rules={[{ required: true, message: 'You must choose the time the event takes place!' }]}
                >
                    <RangePicker 
                        renderExtraFooter={() => 'extra footer'}
                        showTime 
                        onChange= {e=>
                            setdataAddSale({
                                ...dataAddSale,
                                date_start:moment(e[0]._d).format('YYYY-MM-DD HH:mm:ss'),
                                expired:moment(e[1]._d).format('YYYY-MM-DD HH:mm:ss')
                            }
                            )
                        }
                    />
                </Form.Item>
                <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                    <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                        Thêm mã
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
    const ModalDeleteSale = ()=>(
        <div>
        {showModalDelete &&
        <Modal
            title={`Delete code  ${itemTmp.code_sale}`}
            visible={showModalDelete}
            onCancel={()=>{setshowModalDelete(false)}}
            onOk={handleDeleteSale}
            cancelText="Exit"
            okText="Sure"
        >
            <p>Are you sure you want to delete this promo code.</p>
        </Modal>
        }
        </div>
    )
    return(
    <div>
        {showContent ?
        <div>
            <Button type="primary" style={{ marginBottom:20 }} danger onClick={()=>setshowDrawer(true)}>
                Add promotion code <PlusCircleOutlined />
            </Button>
            <Table 
                showSorterTooltip={{ title: 'Click to sort' }}
                columns={columns}
                dataSource={dataFullPromotion}
                loading={loadingTable}
                style={overflowX?{overflowX:'scroll'}:null} 
            />
     
            {DrawerAddSale()}
            {ModalDeleteSale()}
        </div>
        :
        <Spinner spinning={!showContent}/> 
        }
    </div>
    )
}