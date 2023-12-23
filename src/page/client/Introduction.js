import React, { useEffect, useState } from "react";
import logo from "../../images/logo.png";
import { Card, Col, Row, Breadcrumb } from "antd";
import Spinner from "../../elements/spinner";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import { CarTwoTone, ShoppingTwoTone, LikeTwoTone, MobileTwoTone } from "@ant-design/icons";
import Slider from "react-slick";

export default function Introduction() {
  return (
    <div style={{ marginTop: 20, marginLeft: 30 }}>
      <Breadcrumb style={{ fontSize: 18, padding: "20px 20px" }}>
        <Breadcrumb.Item>
          <Link to={"/home"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`Introduction`}</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: "block",
          marginLeft: 30,
          marginRight: 40,
          marginBottom: 40,
        }}
      >
        <span className="text">
           Welcome to Fashion HQ - the leading destination for fashion lovers looking for unique style. Here, we proudly present a diverse collection of thousands of high-quality products, from comfortable t-shirts to fashionable jeans, bringing you a fun and unique shopping experience. To better understand us, don't miss the following article.
        </span>
        <h2 style={{ fontWeight: "bold" }}>OVERVIEW OF FASHION HQ</h2>
        <span className="text">
           With the mission of creating an ideal online shopping space, we are committed to providing top quality products from reputable brands and the latest designs, reflecting modern fashion trends. High quality materials and meticulous care in every seam are our top priorities. In addition, the shopping experience at Fashion HQ is not only about product selection but also a journey to discover your personal style. We always keep up to date with the latest fashion trends and provide outfit coordination suggestions so you can create your own, unique style.
        </span>
        <span className="text">
          Join us on a fashion journey filled with style and confidence. Whether you are a fashion enthusiast or looking for everyday outfits, Fashion HQ is the ideal place to satisfy your passion. Discover now and make your fashion dreams come true !
        </span>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
        >
          <img
            className="img-logo"
            src={logo}
            width="60"
            height="60"
            alt="logo"
          />
          <span className="title-logo" style={{ fontSize: 20, marginLeft: 10 }}>
            FASHION HQ
          </span>
        </div>
        <span className="text" style={{ fontWeight: "bold" }}>
          To meet the growing needs of customers, Fashion HQ has been selling the following products:
        </span>
        <div style={{ marginLeft: 10 }}>
          <span className="text">- &nbsp;<Link to="/category/1">Shirt</Link></span>
          <span className="text">- &nbsp;<Link to="/category/2">Trousers</Link></span>
          <span className="text">- &nbsp;<Link to="/category/3">Shoe</Link></span>
          <span className="text">- &nbsp;<Link to="/category/4">Accessory</Link></span>
        </div>
        <h2 style={{ fontWeight: "bold" }}>CHOOSE FASHION HQ</h2>
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card
                title={ <span><CarTwoTone style={{ fontSize: 20 }} /> Nationwide Delivery</span>}
                bordered={false}
              >
               Extremely fast delivery with many attractive shipping support incentive.
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={<span><ShoppingTwoTone style={{ fontSize: 20 }} /> Diverse products</span>}
                bordered={false}
              >
               Shirts, pants, and accessories of all kinds are always waiting for you.
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={
                  <span>
                    <LikeTwoTone style={{ fontSize: 20 }} /> Utilities
                  </span>
                }
                bordered={false}
              >
               You can place orders and track your orders anytime, anywhere.
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={
                  <span>
                    <MobileTwoTone style={{ fontSize: 20 }} /> Supports purchases on multiple platforms
                  </span>
                }
                bordered={false}
              >
              You can make purchases on the website and mobile application.
              </Card>
            </Col>
          </Row>
        </div>
        <span className="text" style={{ fontWeight: "bold" }}>
        Fashion HQ would like to commit to customers:
        </span>
        <div style={{ marginLeft: 10 }}>
          <span className="text">- &nbsp;The product meets quality standards.</span>
          <span className="text">
            - &nbsp;Our customer care team is ready to support you 24/7.
          </span>
          <span className="text">
            - &nbsp;Your product will be carefully packaged and shipped safely to your address.
          </span>
          <span className="text">
            - &nbsp;Your personal information will be kept secure and never shared with third parties.
          </span>
          <span className="text">
            - &nbsp;You have the right to exchange or return goods within 7 days from the date of receipt.
          </span>
        </div>
        <span className="text" style={{ marginTop: 20 }}>
          We want you to have an enjoyable and satisfying shopping experience at Fashion HQ. Thank you for trusting and supporting us!
        </span>
      </div>
    </div>
  );
}
