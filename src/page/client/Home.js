import React, { useEffect, useState } from "react";
import { Carousel, Col, Row, Button } from "antd";
import slider1 from "../../images/slider1.jpg";
import slider2 from "../../images/slider2.jpg";
import slider3 from "../../images/slider3.jpg";
import Product from "../../elements/product";
import * as FetchAPI from "../../util/fetchApi";
import Spinner from "../../elements/spinner";
import { useLocation } from "react-router-dom";
import jwt from 'jsonwebtoken';
import {
  BulbFilled,
  FormatPainterFilled,
  CompassFilled,
  ToolFilled,
} from "@ant-design/icons";
import Slider from "react-slick";

export default function Home() {
  const [itemProductNew, setitemProductNew] = useState([]);
  const [itemProductDeal, setitemProductDeal] = useState([]);
  const [showContent, setshowContent] = useState(false);
  const [pageDeal, setpageDeal] = useState(1);
  const [token, setToken] = useState();
  const [moreDeal, setmoreDeal] = useState(true);
  const location = useLocation();
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
  useEffect(  () => {
    setshowContent(false);
    const fetchData = async () => {
      try {
        const new_token = localStorage.getItem('token') || 1;
        const resp = await FetchAPI.postDataAPI('/product/getRecommendationProduct', { id: new_token });
        setProductRecommendation(resp.data);
        setToken(new_token)
      } catch (error) {
        console.error('Error fetching recommendation data:', error);
      }
    };
    fetchData(); 

    setshowContent(true);

  },[localStorage.getItem('token')])

  useEffect(() => {
    setshowContent(false);
    getProductDeal();
  }, [pageDeal]);

  useEffect(() => {
    window.scroll(0, 0);
  }, [location]);
  

  const getProductNew = async () => {
    const res = await FetchAPI.getAPI(`/product/getProductNew/1`);
    setitemProductNew(res.item);
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
  const slide = () => (
    <Carousel
      style={{ overflow: "hidden" }}
      autoplaySpeed={3000}
      autoplay
      dots={false}
    >
      <div>
        <img className="imgCarousel" src={slider1} alt="slider1" />
      </div>
      <div>
        <img className="imgCarousel" src={slider2} alt="slider2" />
      </div>
      <div>
        <img className="imgCarousel" src={slider3} alt="slider3" />
      </div>
    </Carousel>
  );
  const ItemProductDeal = itemProductDeal.map((item, i) => {
    return (
      <Col
        key={i}
        style={{ display: "flex", justifyContent: "center" }}
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
          <div className="contentHome">
          <span className="title-new">RECOMMENDATION FOR YOU</span>
            <Slider className="slider-item-new" {...settings_carsoule_new}
               style= {{ marginBottom: "48px" }}>
              {productRecommendation.map((item, i) => (
                <div key={i} className="hello">
                  <Product item={item} />
                </div>
              ))}
            </Slider>
            <span className="title-new">NEW PRODUCTS</span>
            <Slider className="slider-item-new" {...settings_carsoule_new}>
              {itemProductNew.map((item, i) => (
                <div key={i} className="hello">
                  <Product item={item} />
                </div>
              ))}
            </Slider>

            <span className="title-new" style={{marginTop: 40}}>HOT DEAL PRODUCTS</span>
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
              >
                <Button
                  className="btn-loadmore"
                  onClick={() => setpageDeal(pageDeal + 1)}
                  type="primary"
                  danger
                  ghost
                >
                  View more...
                </Button>
              </div>
            )}

            <span className="title-new" style={{marginTop: 40}}>CHOOSE FASHION HQ</span>
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
                <span>Shirts, pants, and accessories of all kinds are always waiting for you.</span>
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
                   We have a website and mobile application so you can easily connect.
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
