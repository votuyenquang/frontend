import React from "react";
import { Layout, Row, Col } from "antd";
import logo from "../images/logo.png";
import {
  FacebookFilled,
  GoogleCircleFilled,
  GithubFilled,
  TwitterCircleFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Footer } = Layout;
export default function FooterWeb() {
  return (
    <Footer className="footer">
      <Row>
        <Col xl={6} className="widget-footer style1">
          <div style={{ display: "flex", marginTop: 15 }}>
            <img
              className="img-logo"
              src={logo}
              width="40"
              height="40"
              alt="logo"
            />

            <span className="title-logo" style={{ fontSize: 20, marginLeft: 10, marginTop: 5 }}>
              Fashion HQ
            </span>
          </div>
          <div style={{marginTop: 27}}>
            <span>
               “Fashion for everyone” targets an extremely diverse customer base, from women, children to men. Even the brand name CTFASHION implicitly contains this orientation.
            </span>
          </div>
        </Col>
        <Col xl={6} className="widget-footer style2">
          <h2 className="widget-title-footer">Account</h2>
          <ul>
            <li>
              <Link to={{ pathname: "/" }}>Login</Link>
            </li>
            <li>
              <Link to={{ pathname: "/" }}>Register</Link>
            </li>
            <li>
              <Link to={{ pathname: "/billfollow" }}>Order</Link>
            </li>
            <li>
              <Link to={{ pathname: "/cart" }}>Cart</Link>
            </li>
          </ul>
        </Col>
        <Col xl={6} className="widget-footer style3">
          <h2 className="widget-title-footer">Shop</h2>
          <ul>
            <li>
              <Link to={{ pathname: "/" }}>Explore</Link>
            </li>
            <li>
              <Link to={{ pathname: "/" }}>Contact</Link>
            </li>
            <li>
              <Link to={{ pathname: "/" }}>Introduce</Link>
            </li>
          </ul>
        </Col>
        <Col xl={6} className="widget-footer style4">
          <h2 className="widget-title-footer">Feedback To Us</h2>
          <ul>
            <li>
              <a href="" target="_blank">
                <FacebookFilled />
              </a>
            </li>
            <li>
              <a>
                <GoogleCircleFilled />
              </a>
            </li>
            <li>
              <a href="" target="_blank">
                <GithubFilled />
              </a>
            </li>
            <li>
              <a>
                <TwitterCircleFilled />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Footer>
  );
}
