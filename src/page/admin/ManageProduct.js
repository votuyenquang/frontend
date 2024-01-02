import React,{useEffect,useState,useRef,useLayoutEffect} from 'react';
import { useLocation } from 'react-router-dom';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {Image,Table,Button,Drawer,Form,Input,Select,InputNumber,Upload,message,Modal} from 'antd';
import {EditOutlined,DeleteOutlined,UploadOutlined} from '@ant-design/icons';
import PreviewImmage from '../../elements/PreviewImmage';
import {getColumnSearchProps} from '../../elements/SearchFilter';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyCustomUploadAdapterPlugin from '../../contain/uploadImageDescriprption';
import ImgCrop from 'antd-img-crop';
import { useSelector } from 'react-redux';

const {Option} = Select;
export default function ManageProduct(){
    const location = useLocation();
    const [showContent, setshowContent] = useState(false);
    const [drawerEdit, setdrawerEdit] = useState(false);
    const [itemProductTmp, setitemProductTmp] = useState();
    const [dataProduct, setdataProduct] = useState();
    const [filterCategory, setfilterCategory] = useState();
    const [filterProductType, setfilterProductType] = useState();
    const searchInput = useRef();
    const [formEdit] = Form.useForm();
    const [optionCategory, setoptionCategory] = useState();
    const [optionFullProductType, setoptionFullProductType] = useState();
    const [optionProductType, setoptionProductType] = useState();
    const [loadingBtn, setloadingBtn] = useState(false);
    const [loadingTable, setloadingTable] = useState(false);
    const [showModalDeleteProduct, setshowModalDeleteProduct] = useState(false);
    const [imageListUp, setimageListUp] = useState([]);
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);

    useEffect(()=>{
        setshowContent(false);
        getFullProduct();
    },[location])

    useEffect(async()=>{
        let arrTmpCateGory = [];
        let arrTmpProductType = [];
        const category = await FetchAPI.getAPI('/product/getCategory');
        const productType = await FetchAPI.getAPI('/product/getProductType');
        category.map((item,index)=>{
            arrTmpCateGory.push(
                <Option value={item.id}>{item.name}</Option>
            )
            if(index===category.length-1){
                setoptionCategory(arrTmpCateGory)
            }
        });
        productType.map((item,index)=>{
            arrTmpProductType.push(
                <Option value={`${item.name},${item.id},${item.idCategory}`}>{item.name}</Option>
            )
            if(index===productType.length-1){
                setoptionFullProductType(arrTmpProductType)
            }
        })
    },[])
    useLayoutEffect(() => {
        if(itemProductTmp!==undefined)
            filterOption(itemProductTmp.idCategory,true);
    },[drawerEdit])
    
    const filterOption = (value,init)=>{
        let arrTmp = optionFullProductType;
        arrTmp = arrTmp.filter(e=>e.props.value.split(',')[2]===value);
        setoptionProductType(arrTmp)
        if(!init){
            formEdit.setFieldsValue({nameProductType:null})
        }  
    }
    const getFullProduct = async()=>{
        let arrTmpCateGory = [];
        let arrTmpProductType = [];
        const product = await FetchAPI.getAPI('/product/getFullProductAdmin');
        product.map((item,index)=>{
            const posCategory = arrTmpCateGory.findIndex(x=>x.value===item.idCategory);
            const posProductType = arrTmpProductType.findIndex(x=>x.value===item.idProductType)
            if(posCategory===-1){
                arrTmpCateGory.push({text:item.nameCategory,value:item.idCategory})
            }
            if(posProductType===-1){
                arrTmpProductType.push({text:item.nameProductType,value:item.idProductType})
            }
            if(index===product.length-1){
                setfilterCategory(arrTmpCateGory)
                setfilterProductType(arrTmpProductType)
            }
        })
        setshowContent(true);
        setdataProduct(product)
    }
    const handleEditProduct = async()=>{
        setloadingBtn(true);
        const data = {"data":itemProductTmp};
        const res = await FetchAPI.postDataAPI("/product/editProduct",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Product update successful !")
                setloadingBtn(false)
            }else{
                message.error("There's an error !!")
                setloadingBtn(false)
            }
        }
    }
    const handleDeleteProduct = async()=>{
        setloadingTable(true);
        const data = {"id":itemProductTmp.id}
        const res = await FetchAPI.postDataAPI("/product/deleteProduct",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Successfully deleted product");
                getFullProduct();
                setloadingTable(false);
                setshowModalDeleteProduct(false);
            }else{
                message.error("There's an error !!");
                setloadingTable(false);
            }
        }
    }
    const onChangeImage = ({ fileList: newFileList }) => {
        if(newFileList.length===0){
            itemProductTmp.image="";
            formEdit.setFieldsValue({image:null})
        }else{
            if(newFileList[0].response){
                itemProductTmp.image="/Upload/ImageProduct/"+newFileList[0].response.msg.filename
                formEdit.setFieldsValue({image:"/Upload/ImageProduct/"+newFileList[0].response.msg.filename})
            }
        }
        setimageListUp(newFileList);
    };
    const columns  = [
        {
            title:"Product ID",
            key:'id',
            render: record=><span>{record.id}</span>
        },
        {
            title:"Product name",
            key:'name',
            ...getColumnSearchProps('name',searchInput)
            // render: record=><span>{record.name}</span>
        },
        {
            title:"Image",
            key:'image',
            render: record=><Image src={record.image} width={80} preview={{ mask:(<PreviewImmage small={true}/>)}}/>
        },
        {
            title:"Category",
            key:'category',
            filters:filterCategory,
            onFilter: (value, record) =>record.idCategory===value,
            render: record=>
            <div style={{ textAlign: 'center'}}>
                <span >{record.nameCategory}</span>
            </div>
        },
        {
            title:"Product type",
            key:'product_type',
            filters:filterProductType,
            onFilter: (value, record) =>record.idProductType===value,
            render:record=><span>{record.nameProductType}</span>
        },
        {
            title:"Status",
            key:'status',
            render: record=>{
                if(record.status===0){
                    return <span>Show</span>
                }else{
                    return <span>Hide</span>
                }
            }
        },
        {
            title:"Customized",
            key:'edit',
            render: record=>{
                return(
                    <div style={{ display:'flex',flexDirection:'row' }}>
                        <Button 
                            type="primary" 
                            style={{ borderRadius:10 }}
                            onClick={()=>{
                                setdrawerEdit(true);
                                setitemProductTmp(record);
                                formEdit.setFieldsValue(record);
                                setimageListUp([{url:record.image}])
                            }}
                        >
                            <EditOutlined />
                        </Button>
                        <Button 
                            type="primary" 
                            danger 
                            style={{ borderRadius:10,marginLeft:20 }} 
                            onClick={()=>{
                                setshowModalDeleteProduct(true);
                                setitemProductTmp(record)
                            }}
                        >
                            <DeleteOutlined />
                        </Button>
                    </div>
                )
            }
        }
    ]
   
    const DrawerEditProduct = ()=>(
        <Drawer
            title="Edit products" 
            placement="right" 
            width={overflowX ?"100%":520}
            getContainer={false}
            onClose={()=>setdrawerEdit(false)} 
            visible={drawerEdit}
        >
            {itemProductTmp !==undefined &&
            <Form 
                form={formEdit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                onFinish={handleEditProduct}
            >
                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter product name!' }]}
                >
                    <Input 
                        placeholder="Tên sản phẩm"
                        value={itemProductTmp.name}
                        onChange= {(e)=>{itemProductTmp.name=e.target.value;console.log(itemProductTmp)}}
                    />
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="idCategory"
                    rules={[{ required: true, message: 'Please select category' }]}
                >
                    <Select
                        onChange= {(e)=>{
                            itemProductTmp.idCategory=e;
                            filterOption(e);
                        }
                        } 
                    >
                        {optionCategory}
                    </Select>
                </Form.Item>
                <Form.Item  
                    label="Product type"
                    name="nameProductType"
                    rules={[{ required: true, message: 'Please enter product type!' }]}
                >
                    <Select
                        placeholder="Product type"
                        onChange= {
                            (e)=>itemProductTmp.idProductType=e.split(',')[1]
                           
                        } 
                    >
                        {optionProductType}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please enter product price!' }]}
                >
                    <InputNumber
                        placeholder="Price"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                        value= {itemProductTmp.price}
                        onChange={(e)=>itemProductTmp.price=e}
                    />
                </Form.Item>
                <Form.Item
                    label="Promotion price"
                    name="promotional"
                >
                    <InputNumber
                        placeholder="Promotion price"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                        value={itemProductTmp.promotional}
                        onChange= {(e)=>itemProductTmp.promotional=e}
                    />
                </Form.Item>
                <Form.Item
                    label="Product image"
                    name="image"
                    rules={[{ required: true, message: 'Please select image!' }]}
                >
                    {/* <Image src={itemProductTmp.image} width={100} preview={false}/> */}
                    <ImgCrop 
                        rotate
                        grid
                        aspect={1.5/2.2}
                    >
                        <Upload
                            action="/uploads/uploadImageProduct"
                            listType="picture-card"
                            name="image"
                            fileList={imageListUp}
                            onChange={onChangeImage}
                        >
                            {imageListUp.length<1 &&
                                <div>
                                    <UploadOutlined />
                                    <span>Upload</span> 
                                </div>
                            }                            
                        </Upload>  
                    </ImgCrop>
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <CKEditor
                            editor={ ClassicEditor }
                            data={itemProductTmp.description===null?"":itemProductTmp.description}
                            config={{extraPlugins:[MyCustomUploadAdapterPlugin]}} //use this to upload image.
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                itemProductTmp.description = data
                            } }
                    />
                </Form.Item>
                <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                    <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                        Update
                    </Button>
                </Form.Item>
            </Form>
            }
           
        </Drawer>
       
    )
    const ModalDeleteProduct = ()=>(
        <div>
        {showModalDeleteProduct &&
        <Modal
            title={`Delete product ${itemProductTmp.name}`}
            visible={showModalDeleteProduct}
            onCancel={()=>{setshowModalDeleteProduct(false)}}
            onOk={handleDeleteProduct}
            cancelText="Exit"
            okText="Sure"
        >
            <p>If you delete a product. All product and inventory information will be deleted.</p>
        </Modal>
        }
        </div>
    )
    return(
        <div>
        {showContent ? 
            <div>
                <Table 
                    showSorterTooltip={{ title: 'Click to sort' }}
                    dataSource={dataProduct} 
                    columns={columns}
                    pagination={{ defaultPageSize:5 }}
                    style={overflowX?{overflowX:'scroll'}:null} 
                    loading={loadingTable}
                />
                 {DrawerEditProduct()}
                 {ModalDeleteProduct()}
            </div>

            :
            <Spinner spinning={!showContent}/>
        }
        </div>
    )
}