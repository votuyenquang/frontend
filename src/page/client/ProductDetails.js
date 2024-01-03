import React, { useState, useEffect } from "react";
import {
  Image,
  Row,
  Col,
  Breadcrumb,
  Rate,
  InputNumber,
  Select,
  Button,
  Spin,
  message,
  List,
  notification,
} from "antd";
import { GiftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import * as FetchAPI from "../../util/fetchApi";
import { getPriceVND } from "../../contain/getPriceVND";
import { Link, useLocation, useHistory, useParams } from "react-router-dom";
import * as MENU from "../../util/menuProduct";
import Product from "../../elements/product";
import { useDispatch } from "react-redux";
import { updateCartCurrent } from "../../contain/updateQuanityCart";
import PreviewImmage from "../../elements/PreviewImmage";
import ReactHtmlParser from "react-html-parser";
import { render } from "@testing-library/react";
import { FaRegUserCircle } from "react-icons/fa";

const { Option } = Select;
export default function ProductDetails() {
  const [dataProduct, setdataProduct] = useState();
  const [showContent, setshowContent] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [nameCategory, setnameCategory] = useState("");
  const [nameProductType, setnameProductType] = useState("");
  const [quanity, setquanity] = useState(1);
  const [dataOption, setdataOption] = useState();
  const [option, setoption] = useState();
  const [outOfStock, setoutOfStock] = useState(false);
  const [dataRelate, setdataRelate] = useState([]);
  const [imageDecription, setimageDecription] = useState();
  const [reviewStar, setreviewStar] = useState(0);
  const [quanityReview, setquanityReview] = useState(0);
  const [arrReview, setarrReview] = useState([]);

  const { idProduct } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    window.scroll(0, 0);
    const getDetailProduct = async () => {
      try {
        setshowContent(false);
        setquanity(1);
        getOption(idProduct);
        const data = {
          id: idProduct,
        };
        const res = await FetchAPI.postDataAPI(
          "/product/getProductDetails",
          data
        );

        if (res[0].reviewStar !== null) {
          setreviewStar(res[0].reviewStar);
          setquanityReview(res[0].quanityReview);
        }
        getImageDecripton(res[0]);
        setdataProduct(res[0]);
        getName(res[0]);
      } catch (error) {}
    };
    getDetailProduct();
  }, [location]);

  useEffect(() => {
    const getReviewStar = async () => {
      const data = { idProduct: idProduct };
      const res = await FetchAPI.postDataAPI(
        "/review/getReviewByIdproduct",
        data
      );
      setarrReview(res);
    };
    getReviewStar();
  }, []);

  const getImageDecripton = (data) => {
    let item = [];
    if (data.imageDecription1 !== null) {
      item.push(data.imageDecription1);
    }
    if (data.imageDecription2 !== null) {
      item.push(data.imageDecription2);
    }
    if (data.imageDecription3 !== null) {
      item.push(data.imageDecription3);
    }
    if (data.imageDecription4 !== null) {
      item.push(data.imageDecription4);
    }
    setimageDecription(item);
  };
  const getName = async (data) => {
    const res = await FetchAPI.postDataAPI("/product/getProductByType", {
      id: data.idProductType,
    });
    setdataRelate(res.filter((e) => e.id !== data.id));
    const category = await MENU.getCategoryById({ id: data.idCategory });
    const product_type = await MENU.getPrductTypeById({
      id: data.idProductType,
    });
    setnameCategory(category.name);
    setnameProductType(product_type.name);
    setshowContent(true);
  };
  const handleValidation = () => {
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
        handleOrder();
      }
    }, 1000);
  };
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
  const handleOrder = () => {
    const dataOut = localStorage.getItem("cart");
    let objDataOut = JSON.parse(dataOut);
    if (objDataOut === null || dataOut === undefined) {
      const data = [
        { id: dataProduct.id, quanity: quanity, option: option[0] },
      ];
      objDataOut = data;
    } else {
      //Check product and option in cart
      let police = objDataOut.some(
        (x) => x.id === dataProduct.id && x.option === option[0]
      );
      if (police) {
        //find postition
        let index = objDataOut.findIndex(
          (x) => x.id === dataProduct.id && x.option === option[0]
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
          id: dataProduct.id,
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
  };
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
    setdataOption(i);
  };
  const ItemProductRelate = dataRelate.map((item, ind) => {
    return (
      <Col
        key={ind}
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 10px",
        }}
      >
        <Product width={200} item={item} />
      </Col>
    );
  });
  const line = () => (
    <div style={{ backgroundColor: "gray", height: 1, marginTop: 10 }} />
  );
  const ProductInformation = () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 className="name-product">{dataProduct.name}</h1>
      <div className="inventory-quantity">
        <span>Code: {dataProduct.id}</span>
        <span className="line">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <span className="rate">
          
          { reviewStar > 0 ?
              <>
              Rate:{" "}
                <Rate
                  allowHalf
                  style={{ size: "10px" }}
                  tooltips="12345"
                  defaultValue={reviewStar}
                  disabled
                />{" "}
                ({quanityReview} review)
              </> 
              : <>
                There are no reviews yet
              </>
          }
        </span>
      </div>
    </div>
  );
  const contentProduct = () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {ProductInformation()}

      {dataProduct.promotional === null ? (
        <div className="product-price">
          <span style={{ fontSize: 25, color: "red", fontWeight: "bold" }}>
            {getPriceVND(dataProduct.price) + "$"}
          </span>
        </div>
      ) : (
        <div className="product-price">
          <span style={{ fontSize: 25, color: "red", fontWeight: "bold", marginRight:10 }}>
            {getPriceVND(dataProduct.promotional) + "$"}
          </span>
          <span style={{ fontSize: 15, textDecorationLine: "line-through" }}>
            {getPriceVND(dataProduct.price) + "$"}
          </span>
          <span className="sale-off">
            {Math.round(( dataProduct.price - dataProduct.promotional) / dataProduct.price * 100) + "%"}
          </span>
        </div>
      )}
      <div className="option">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <span className="option-children">Option :</span>
          <div style={{ padding: "0px 10px" }}>
            <Select
              placeholder="Choose size, color"
              onChange={(e) => {
                console.log(e);
                var arr = [];
                arr = e.split(",");
                setoption(arr);
              }}
              allowClear
            >
              {dataOption}
            </Select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <span className="option-children">Quantity :</span>
          <div style={{ padding: "0px 10px" }}>
            <InputNumber
              style={{ textAlign: "center" }}
              min={1}
              max={10}
              value={quanity}
              width={120}
              onChange={(e) => {
                setquanity(e);
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ paddingTop: 15 }}>
        <div className="button-buy">
          <Button
            className="add-cart"
            onClick={handleValidation}
            disabled={outOfStock}
            loading={buttonLoading}
          >
            <span>ADD CART</span>
          </Button>
          <Button className="buy-now" disabled={outOfStock}>
            <Link to="/cart"><span>BUY NOW</span></Link>
          </Button>
        </div>

        <div className="block-promotion">
          <div className="heading-promo">
            <GiftOutlined style={{ marginRight: 5 }} />
            Special promotion
          </div>
          <div className="promo-content">
            <p></p>
            <p>
              Special discount program to celebrate Lunar New Year. Applicable
              from January 12 - February 29
            </p>
            <p>
              + Apply code HAPPYNEWYEAR to get 20 $ off for orders from
              800 $ !
            </p>
            <p>+ Apply code SHIPTET to save 5 $ on shipping !</p>
          </div>
        </div>

        <div className="block-promotion">
          <div className="heading-product-infor">
            <InfoCircleOutlined style={{ marginRight: 5 }} />
            Product Information
          </div>
          <div className="promo-content">
            <p></p>
            <span style={{ fontSize: 14 }}>
              {ReactHtmlParser(dataProduct.description)}
            </span>
          </div>
        </div>
        {/* 
<div style={{ paddingTop: 50 }}>
          {dataProduct.description !== null && (
            <span className="option-children">PRODUCT INFORMATION</span>
          )}
          <span style={{ fontSize: 14 }}>
            {ReactHtmlParser(dataProduct.description)}
          </span>
        </div>
*/}
      </div>

      <div className="reviews">
        <p className="review-title">CUSTOMER REVIEWS</p>
        {arrReview.map((review, ind) => {
          return (
            <div className="review">
              <div className="review-block" key={ind}>
                <span className="review-avt">
                  <FaRegUserCircle />
                </span>
                <span className="review-name">{review.name}</span>
              </div>
              <div className="date-start">
                <span>2024-01-01 20:20</span>
                <span className="line">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <span className="review-star">
                  <Rate
                    allowHalf
                    style={{ color: "orange", fontSize: 16 }}
                    tooltips="12345"
                    defaultValue={review.reviewStar}
                    disabled
                  />
                </span>
              </div>
              <div className="review-comment">
                <span>{review.comment}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  const Direction = () => (
    <Breadcrumb style={{ fontSize: 18 }}>
      <Breadcrumb.Item>
        <Link to={"/home"}>Home</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={`/category/${dataProduct.idCategory}`}>{nameCategory}</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={`/menuproduct/${dataProduct.idProductType}`}>
          {nameProductType}
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{dataProduct.name}</Breadcrumb.Item>
    </Breadcrumb>
  );
  const itemImageDecription = (item) => (
    <div style={{ padding: 10 }}>
      <Image src={item} preview={{ mask: <PreviewImmage small={true} /> }} />
    </div>
  );
  return (
    <div style={{ padding: "20px 5%" }}>
      {showContent ? (
        <div style={{ minHeight: 800 }}>
          <div style={{ paddingBottom: 30 }}>{Direction()}</div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 30 }}>
            <Col
              xl={8}
              sm={24}
              style={{
                display: "flex",
                paddingRight: 20,
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div>
                <Image
                  src={dataProduct.image}
                  width={350}
                  preview={{ mask: <PreviewImmage /> }}
                />
              </div>
              <div>
                <Image.PreviewGroup>
                  <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={imageDecription}
                    locale={{ emptyText: "Không có ảnh miêu tả" }}
                    renderItem={itemImageDecription}
                  />
                </Image.PreviewGroup>
              </div>
            </Col>
            <Col xl={12} sm={24}>
              {contentProduct()}
            </Col>
            <Col
              className="productRelate"
              xl={4}
              style={{ justifyContent: "center" }}
            >
              <span style={{ fontSize: 16, fontWeight: "bold" }}>
                RELATED PRODUCTS
              </span>
              <Row>{ItemProductRelate}</Row>
            </Col>
          </Row>
        </div>
      ) : (
        <div style={{ width: "100%", height: 500 }}>
          <Spin spinning={!showContent} size="large">
            <div style={{ width: "100%", height: 500 }} />
          </Spin>
        </div>
      )}
    </div>
  );
}
