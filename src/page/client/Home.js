import React, { useEffect, useState } from "react";
import { Carousel, Col, Row, Button, Card, message } from "antd";
import Product from "../../elements/product";
import * as FetchAPI from "../../util/fetchApi";
import Spinner from "../../elements/spinner";
import { useLocation, useHistory } from "react-router-dom";
import ClipboardJS from "clipboard";
import moment from "moment";
//image
import freeship from "../../images/freeship.png";
import off from "../../images/giam.png";
import chanel from "../../images/chanel.png";
import lv from "../../images/lv.png";
import balen from "../../images/balen.png";
import given from "../../images/given.png";
import hermes from "../../images/hermes.png";

import {
  BulbFilled,
  FormatPainterFilled,
  CompassFilled,
  ToolFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Slider from "react-slick";

export default function Home() {
  const [itemProductNew, setitemProductNew] = useState([]);
  const [promotionList, setPromotionList] = useState([]);
  const [itemProductDeal, setitemProductDeal] = useState([]);
  const [showContent, setshowContent] = useState(false);
  const [pageDeal, setpageDeal] = useState(1);
  const [token, setToken] = useState();
  const [moreDeal, setmoreDeal] = useState(true);
  const location = useLocation();
  const history = useHistory();
  const [productRecommendation, setProductRecommendation] = useState([]);

  var settings_carsoule_new = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1240,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    setshowContent(false);
    getProductNew();
  }, []);
  useEffect(() => {
    setshowContent(false);
    getPromotion();
  }, []);
  useEffect(() => {
    setshowContent(false);
    const fetchData = async () => {
      try {
        const new_token = localStorage.getItem("token") || 1;
        const resp = await FetchAPI.postDataAPI(
          "/product/getRecommendationProduct",
          { id: new_token }
        );
        setProductRecommendation(resp.data);
        setToken(new_token);
      } catch (error) {
        console.error("Error fetching recommendation data:", error);
      }
    };
    fetchData();

    setshowContent(true);
  }, [localStorage.getItem("token")]);

  useEffect(() => {
    setshowContent(false);
    getProductDeal();
  }, [pageDeal]);

  useEffect(() => {
    window.scroll(0, 0);
  }, [location]);

  useEffect(() => {
    const clipboard = new ClipboardJS(".sale-button");
    clipboard.on("success", (e) => {
      message.success("Copied");
    });

    clipboard.on("error", (e) => {
      message.warning("Copied error");
    });

    return () => {
      clipboard.destroy();
    };
  }, []);

  const getProductNew = async () => {
    const res = await FetchAPI.getAPI(`/product/getProductNew/1`);
    setitemProductNew(res.item);
    setshowContent(true);
  };
  const getPromotion = async () => {
    const res = await FetchAPI.getAPI(`/promotion/getPromotionNews`);
    setPromotionList(res);
    setshowContent(true);
  };
  const getProductDeal = async () => {
    let item = itemProductDeal;
    const res = await FetchAPI.getAPI(`/product/getProductDeal/${pageDeal}`);
    item = item.concat(res.item);
    if (res.msg === "Out of data") {
      setmoreDeal(false);
    }
    setitemProductDeal(item);
  };

  const sale = () => (
    <div>
      <Row className="sale">
        <Slider
          className="slider-item-new"
          {...settings_carsoule_new}
          style={{ marginBottom: "48px" }}
        >
          {promotionList.map((item, i) => (
            <div key={i} style={{}}>
              <Card
                className="sale-item"
                title={
                  <div className="sale-title">
                    <img
                      src={item.type === 0 ? freeship : off}
                      style={{ width: 45 }}
                    />
                    <div style={{ display: "grid", marginLeft: 10 }}>
                      <span style={{ fontWeight: 600 }}>
                        {item.name_event_sale}
                      </span>
                      <span style={{ fontSize: 13 }}>
                        {item.type === 0
                          ? `Voucher for free shipping ${item.cost_sale} $ for orders`
                          : `Voucher discount ${item.cost_sale} $ for each order`}
                      </span>
                    </div>
                  </div>
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="sale-content">
                    <span>
                      Code:{" "}
                      <span style={{ fontWeight: 600 }}>{item.code_sale}</span>
                    </span>
                    <span>
                      Expiry: {moment(item.expired).format("YYYY-MM-DD")}
                    </span>
                  </div>
                  <Button
                    className="sale-button"
                    data-clipboard-text={item.code_sale}
                  >
                    Copy
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </Slider>
      </Row>
    </div>
  );

  const slide = () => (
    <Carousel
      style={{ overflow: "hidden" }}
      autoplaySpeed={4000}
      effect="fade"
      autoplay
      dots={false}
    >
      <div className="background1">
        <div className="slider1">
          <div className="title-1">FLASH SALE</div>
          <div className="title-2">BUY PAIR TO DISCOUNT SET</div>
          <div className="title-3">Apply to many products</div>
          <Button
            className="shop-now"
            onClick={() => {
              history.push("/fullproduct/1");
            }}
          >
            <ShoppingCartOutlined />
            <span>SHOP NOW</span>
          </Button>
        </div>
      </div>
      <div className="background2">
        <div className="slider1">
          <div className="title-1">Special offer</div>
          <div className="title-2">LUNAR NEW YEAR</div>
          <div className="title-3">Time: 01/01 - 29/02</div>
          <Button className="shop-now">
            <ShoppingCartOutlined />
            <span>SHOP NOW</span>
          </Button>
        </div>
      </div>
    </Carousel>
  );

  const brand = () => (
    <div className="brand">
      <img src={chanel} />
      <img src={lv} />
      <img src={given} />
      <img src={balen} />
      <img src={hermes} />
    </div>
  );

  const ItemProductDeal = itemProductDeal.map((item, i) => {
    return (
      <Col
        key={i}
        style={{ display: "flex", justifyContent: "center", paddingLeft: 36 }}
        xl={6}
        lg={8}
        md={12}
        sm={12}
        xs={24}
      >
        <Product item={item} />
      </Col>
    );
  });
  return (
    <div>
      {showContent ? (
        <div>
          {slide()}
          {sale()}
          <div className="contentHome">
            <h2 className="title-news">New products</h2>
            <Slider className="slider-item-new" {...settings_carsoule_new}>
              {itemProductNew.map((item, i) => (
                <div key={i} className="hello">
                  <Product item={item} />
                </div>
              ))}
            </Slider>
            {brand()}
            <h2 className="title-news" style={{ marginTop: 48 }}>
              Recommendation for you
            </h2>
            <Slider
              className="slider-item-new"
              {...settings_carsoule_new}
              style={{ marginBottom: "48px" }}
            >
              {productRecommendation.map((item, i) => (
                <div key={i} className="hello">
                  <Product item={item} />
                </div>
              ))}
            </Slider>

            <h2 className="title-news" style={{ marginTop: 40 }}>
              HOT DEAL PRODUCTS
            </h2>
            <Row
              gutter={[{ xs: 8, sm: 16, md: 24, lg: 24 }, 20]}
              style={{ width: "100%" }}
            >
              {ItemProductDeal}
            </Row>
            {moreDeal && (
              <div
                style={{
                  padding: "20px 0px",
                  width: "100%",
                  justifyContent: "center",
                  display: "flex",
                }}
              ></div>
            )}

            <h2 className="title-news" style={{ marginTop: 40 }}>
              CHOOSE FASHION HQ
            </h2>
            <Row className="reason-choose">
              <Col className="item" xl={6} md={12} sm={24}>
                <div className="image">
                  <div className="img style1">
                    <CompassFilled />
                  </div>
                </div>
                <h2>Nationwide Delivery</h2>
                <span>Extremely fast delivery with lots of support.</span>
              </Col>
              <Col className="item" xl={6} md={12} sm={24}>
                <div className="image">
                  <div className="img style2">
                    <FormatPainterFilled />
                  </div>
                </div>
                <h2>Diverse Products</h2>
                <span>
                  Shirts, pants, and accessories of all kinds are always waiting
                  for you.
                </span>
              </Col>
              <Col className="item" xl={6} md={12} sm={24}>
                <div className="image">
                  <div className="img style3">
                    <BulbFilled />
                  </div>
                </div>
                <h2>Utilities</h2>
                <span>You can track your order at all times.</span>
              </Col>
              <Col className="item" xl={6} md={12} sm={24}>
                <div className="image">
                  <div className="img style4">
                    <ToolFilled />
                  </div>
                </div>
                <h2>Platform diversity</h2>
                <span>
                  We have a website and mobile application so you can easily
                  connect.
                </span>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <Spinner spinning={!showContent} />
      )}
    </div>
  );
}
