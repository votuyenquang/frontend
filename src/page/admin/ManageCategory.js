import React,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import {Table,Button,Form,Input,Select,Modal,message,Drawer,Upload} from 'antd';
import {PlusCircleOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import Spinner from '../../elements/spinner';
import {useSelector} from 'react-redux';
import {UploadOutlined} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
const {Option} = Select;
export default function ManageCategory(){
    const [dataFullCategory, setdataFullCategory] = useState();
    const [showContent, setshowContent] = useState(false);
    const [dataFullProduct, setdataFullProduct] = useState();
    const [showModalAdd, setshowModalAdd] = useState(false);
    const [drawerEdit, setdrawerEdit] = useState(false);
    const [dataAdd, setdataAdd] = useState({});
    const [itemTmp, setitemTmp] = useState({});
    const [loadingBtn, setloadingBtn] = useState();
    const [formAdd] = Form.useForm();
    const [formEdit] = Form.useForm();
    const [logoCategory, setlogoCategory] = useState([]);
    const [logoTmp, setlogoTmp] = useState([]);
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);

    useEffect(()=>{
        setshowContent(false);
        getCategory()
    },[])
    const getCategory = async()=>{
        const res = await FetchAPI.getAPI('/product/getCategory');
        const product = await FetchAPI.getAPI('/product/getFullProduct');
        setdataFullCategory(res)
        setdataFullProduct(product);
        setshowContent(true)
    }
    const handleAddCategory = async()=>{
        setloadingBtn(true);
        const data = {"data":dataAdd,"logo":"/Upload/ImageDescription/"+logoCategory[0].response.msg.filename};
        const res = await FetchAPI.postDataAPI("/product/addCategory",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Added successfully");
                getCategory();
                setdataAdd({});
                formAdd.setFieldsValue({name:"",status:null})
                setloadingBtn(false)
                setshowModalAdd(false)

            }else{
                message.error("There's an error !!")
                setloadingBtn(false)
            }
        }
    }
    const handleEditCategory = async()=>{
        setloadingBtn(true);
        const data = {"data":itemTmp,"logo":"/Upload/ImageDescription/"+logoTmp[0].response.msg.filename};
        const res = await FetchAPI.postDataAPI("/product/editCategory",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Update successfully");
                getCategory();
                setitemTmp({})
                formEdit.setFieldsValue({name:"",status:null})
                setloadingBtn(false)
            }else{
                message.error("There's an error !!")
            }
        }
    }
    const onChangeImage = ({ fileList: newFileList }) => {
        setlogoCategory(newFileList);
        formAdd.setFieldsValue({logo:newFileList})
    };
    const onChangeLogoEdit = ({ fileList: newFileList }) => {
        setlogoTmp(newFileList);
        formEdit.setFieldsValue({logo:newFileList})
    };
    const columns = [
        {
            title:"Category ID",
            name:"id",
            render: record=><span style={{fontWeight:'bold'}}>{"#"+record.id}</span>
        },
        {
            title:"Category name",
            name:"name",
            render: record=><span>{record.name}</span>
        },
        {
            title:"Product quantity",
            name:"product",
            render:record=>{
                let i = 0;
                dataFullProduct.map((e)=>{
                    if(e.idCategory===record.id){
                        i++
                    }
                })
                return (<span>{i+" product"}</span>)
            }
        }, 
        {
            title:"Customized",
            name:"option",
            render: record=>{
                return(
                    <div style={{ display:'flex',flexDirection:'row' }}>
                        <Button 
                            type="primary" 
                            style={{ borderRadius:10 }}
                            onClick={()=>{
                                setdrawerEdit(true);
                                setitemTmp(record);
                                formEdit.setFieldsValue(record);
                                if(record.logo!==null){
                                    setlogoTmp([{url:record.logo}]);
                                }else{
                                    setlogoTmp([])
                                }
                            }}
                        >
                            <EditOutlined />
                        </Button>
                       
                    </div>
                )
            }
        }
    ]
    const DrawerEdit = ()=>(
        <Drawer
            title="Edit product categories"
            visible={drawerEdit}
            width={overflowX ?"100%":520}
            onClose={()=>setdrawerEdit(false)}
        >
            <Form
              form={formEdit}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
              onFinish={handleEditCategory}
            >
                <Form.Item
                    label="Category name"
                    name="name"
                >
                    <Input
                        placeholder="Enter category name"
                        value={itemTmp.name}
                        onChange= {(e)=>itemTmp.name=e.target.value}
                    /> 
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                >
                    <Select
                        value={itemTmp.status}
                        onChange= {(e)=>itemTmp.status=e}
                    >
                        <Option value={0}>
                            Show
                        </Option>
                        <Option value={1}>
                            Hide
                        </Option>

                    </Select>
                </Form.Item>
                <Form.Item
                    label="Logo"
                    name="logo"
                    rules={[{ required: true, message: 'Please choose a logo'}]}
                >
                     <ImgCrop 
                        rotate
                        grid
                        aspect={1.5/2.2}
                    >
                        <Upload
                            action="/uploads/uploadImageProduct"
                            listType="picture-card"
                            name="image"
                            fileList={logoTmp}
                            onChange={onChangeLogoEdit}
                        >
                            {logoTmp.length<1 &&
                                <div>
                                    <UploadOutlined />
                                    <span>Upload</span> 
                                </div>
                            }                            
                        </Upload>  
                    </ImgCrop>
                </Form.Item>
                <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                    <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                        Update
                    </Button>
                    <Button type="primary" danger style={{ borderRadius:10,marginLeft:20 }}>
                            <DeleteOutlined />
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
    const ModalAddNew = ()=>(
        <Modal
            title="Add Category"
            visible={showModalAdd}
            onCancel={()=>setshowModalAdd(false)}
            footer={false}
        >
            <Form
                form={formAdd}
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 12 }}
                onFinish={handleAddCategory}
            >
                <Form.Item
                    label="Category name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter category name'}]}
                >
                    <Input
                        placeholder="Enter category name"
                        value={dataAdd.name}
                        onChange= {(e)=>setdataAdd({...dataAdd,name:e.target.value})}
                    /> 
                </Form.Item>
    
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select status'}]}
                >
                    <Select
                        value={dataAdd.status}
                        onChange= {(e)=>setdataAdd({...dataAdd,status:e})}
                    >
                        <Option value={0}>
                            Show
                        </Option>
                        <Option value={1}>
                            Hide
                        </Option>

                    </Select>
                </Form.Item>
                <Form.Item
                    label="Logo"
                    name="logo"
                    rules={[{ required: true, message: 'Please choose a logo'}]}
                >
                <ImgCrop 
                    rotate
                    grid
                    aspect={1.5/2.2}
                >
                    <Upload
                        action="/uploads/uploadImageProduct"
                        listType="picture-card"
                        name="image"
                        fileList={logoCategory}
                        onChange={onChangeImage}
                    >
                        {logoCategory.length===0 && 
                        <div>
                            <UploadOutlined />
                            <span>Upload</span> 
                        </div>
                        }
                    </Upload>  
                </ImgCrop>
                </Form.Item>
                <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                    <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                        Add
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
    return(
        <div>
            {showContent ?
            <div>
                <Button type="primary" style={{ marginBottom:20 }} danger onClick={()=>setshowModalAdd(true)}>
                    Add Category <PlusCircleOutlined />
                </Button>
                <Table 
                    columns={columns}
                    dataSource={dataFullCategory}
                    style={overflowX?{overflowX:'scroll'}:null} 
                />
                {ModalAddNew()}
                {DrawerEdit()}
            </div>            
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}