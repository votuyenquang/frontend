import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Layout,
  Menu,
  Input,
  Row,
  Col,
  BackTop,
  Dropdown,
  message,
  Badge,
} from "antd";
import * as FetchAPI from "../util/fetchApi";
import logo from "../images/logo.png";
import Home from "./client/Home";
import MenuProduct from "./client/MenuProduct";
import ProductDetails from "./client/ProductDetails";
import CategoryProduct from "./client/CategoryProduct";
import LoginAdmin from "./admin/LoginAdmin";
import Admin from "./admin/Admin";
import Account from "./client/Account";
import Cart from "./client/Cart";
import Payment from "./client/Payment";
import BillFollow from "./client/BillFollow";
import InfoAccount from "../elements/menuAccount";
import BillDetails from "./client/BillDetails";
import DropDownCart from "../elements/dropDownCart";
import ProductSale from "./client/ProductSale";
import Profile from "./client/Profile";
import SearchView from "./client/SearchView";
import FullProduct from "./client/FullProduct";
import FooterWeb from "../elements/FooterWeb";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import {
  HistoryOutlined,
  ArrowUpOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { BiMap } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../util/getUser";
import { updateCartCurrent } from "../contain/updateQuanityCart";
import { updateUser } from "../redux/reducer/user.reducer";
import Policy from "./client/Policy";
import Introduction from "./client/Introduction";
import Contact from "./client/Contact";

const { Header, Content } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

export default function App() {
  const [menu, setmenu] = useState();
  const [top, settop] = useState(true);
  const [showContent, setshowContent] = useState(false);
  const [showModalAccount, setshowModalAccount] = useState(false);
  const [statusUser, setstatusUser] = useState(false);
  const history = useHistory();
  const datauser = useSelector((state) => state.userReducer.currentUser);
  const quanityCart = useSelector((state) => state.productReducer.quanityCart);
  const dataCart = useSelector((state) => state.productReducer.cart);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    document.addEventListener("scroll", () => {
      const isTop = window.scrollY < 500;
      settop(isTop);
      if (!isTop) {
        document.getElementsByClassName(
          "ant-layout-header"
        )[0].style.animation = "move-nav 0.8s";
      } else {
        if (
          document.getElementsByClassName("ant-layout-header") !== undefined
        ) {
          document.getElementsByClassName(
            "ant-layout-header"
          )[0].style.animation = "";
        }
      }
    });
  }, []);
  useEffect(() => {
    getMenu();
    setshowContent(false);
    updateQuanityCart();
    checkUser();
  }, []);

  const updateQuanityCart = () => {
    updateCartCurrent(dispatch);
  };

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    if (token === undefined || token === null) {
      setstatusUser(false);
      dispatch(updateUser({}));
    } else {
      setstatusUser(true);
      const status = await getUser(token, dispatch);
      if (status === false) {
        message.warning("Login session expired, please log in again !");
        setstatusUser(false);
      } else if (status == "block") {
        message.error(
          "Your account is locked, please contact the administrator !"
        );
        setstatusUser(false);
      } else {
        setstatusUser(true);
      }
    }
  };
  const handleCancel = () => {
    setshowModalAccount(false);
  };
  const onSearch = (value) => {
    history.push(`/search/${value}`);
  };
  const getMenu = async () => {
    try {
      let item = [];
      const res = await FetchAPI.getAPI("/product/getCategory");
      const res2 = await FetchAPI.getAPI("/product/getProductType");
      res.map((category) =>
        item.push(
          <SubMenu
            key={category.slug}
            title={category.name}
            onTitleClick={() => history.push(`/category/${category.id}`)}
          >
            {res2.map((item,i) => {
              if (item.idCategory === category.id) {
                const localmenu = {
                  pathname: `/menuproduct/${item.id}`,
                };
                return (
                  <Menu.Item className="item-of-submenu" key={item.slug}>
                    {item.name} <Link to={localmenu} />
                  </Menu.Item>
                );
              }
              return false;
            })}
          </SubMenu>
        )
      );
      setmenu(item);
      setshowContent(true);
    } catch (error) {}
  };

  const Top = () => (
    <Row
      className="top"
      gutter={[{}, { lg: 0, md: 20, xs: 10 }]}
      style={{
        paddingBottom: 30,
        paddingTop: 30,
        justifyContent: "space-around",
      }}
    >
      <Col
        className="logo"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          className="img-logo"
          src={logo}
          width="60"
          height="60"
          alt="logo"
        />
        <span className="title">
          <span className="title-logo" style={{ fontSize: 20 }}>
            Fashion HQ
          </span>
          <span className="title-logo" style={{ fontSize: 17 }}>
            Just Beautiful Be Your Style
          </span>
        </span>
      </Col>
      <Col
        className="search"
        style={{ display: "flex" }}
        xl={6}
        md={10}
        xs={24}
      >
        <Search
          className="input-search"
          placeholder="Enter product name ..."
          enterButton
          onSearch={onSearch}
        />
      </Col>
      <Col style={{ display: "flex" }}>
        {!statusUser ? (
          <div
            className="btn-header"
            style={{ display: "flex", alignItems: "center", fontSize: 17 }}
            onClick={() => setshowModalAccount(true)}
          >
            <FaUser />
            <span className="title" style={{ paddingLeft: 5 }}>
              Login
            </span>
          </div>
        ) : (
          <Dropdown
            className="btn-header"
            open={MenuAccount}
            placement="bottomLeft"
            arrow
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#fff",
                fontSize: 17,
              }}
            >
              <FaUser />
              <span className="title" style={{ paddingLeft: 5 }}>
             
              </span>
            </div>
          </Dropdown>
        )}
        <div
          className="btn-cart cart"
          style={{
            display: "flex",
            flexDirection: "row",
            color: "#fff",
            alignItems: "center",
          }}
        >
          <Link
            style={{
              display: "flex",
              alignItems: "center",
              color: "#fff",
              fontSize: 17,
            }}
            onClick={() => console.log(datauser)}
            to={{ pathname: "/cart" }}
          >
            <FaShoppingCart />
          </Link>
          <Dropdown overlay={Cartdrop} placement="bottomCenter" arrow>
            <Badge count={quanityCart} offset={[5, -10]}>
                <span
                  className="title"
                  style={{
                    paddingLeft: 5,
                    fontSize: 17,
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cart
                </span>
            </Badge>
          </Dropdown>
        </div>
      </Col>
    </Row>
  );
  const Navigation = () => (
    <Header
      className="header"
      style={
        top
          ? { width: "100%" }
          : {
              position: "fixed",
              width: "100%",
              top: 0,
              elevation: 10,
              zIndex: 100,
            }
      }
    >
      <Menu
        style={{ justifyContent: "center", alignItems: "center" }}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
      >
        <Menu.Item key="1">
          Home <Link to={"/home"} />
        </Menu.Item>
        <SubMenu key="2" title="Product">
          {menu}
        </SubMenu>
        <Menu.Item key="3">
          <Link to="/intro">Introduction</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/productsale/1">Promotional products</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/fullproduct/1">Shop</Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to={"/policy"} />
          Policy
        </Menu.Item>
        <Menu.Item key="7">
          <Link to={"/contact"} />
          Contact
        </Menu.Item>
      </Menu>
    </Header>
  );
  const Cartdrop = (
    <DropDownCart data={dataCart} update={() => updateQuanityCart()} />
  );
  const MenuAccount = (
    <InfoAccount refreshAccount={checkUser} data={datauser} />
  );
  const Body = () => (
    <Content className="site-layout">
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/menuproduct/:idProductType">
          <MenuProduct />
        </Route>
        <Route path="/category/:id">
          <CategoryProduct />
        </Route>
        <Route path="/product/:idProduct">
          <ProductDetails />
        </Route>
        <Route path="/cart">
          <Cart />
        </Route>
        <Route path="/payment">
          <Payment />
        </Route>
        <Route path="/billfollow">
          <BillFollow />
        </Route>
        <Route path="/billdetails/:idBill">
          <BillDetails />
        </Route>
        <Route path="/productsale/:page">
          <ProductSale />
        </Route>
        <Route path="/search/:datasearch">
          <SearchView />
        </Route>
        <Route path="/fullproduct/:page">
          <FullProduct />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/loginadmin">
          <LoginAdmin />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/policy">
          <Policy />
        </Route>
        <Route path="/intro">
          <Introduction />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Redirect to="/home" />
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Content>
  );

  return (
    <div>
      {showContent && (
        <Layout className="layout">
          <div className="header-nav">
            <Account
              overlay={showModalAccount}
              onCancel={handleCancel}
              refeshAccount={checkUser}
            />
            <div className="topbar">
              <span style={{ color: "white", alignItems: "center" }}>
                {" "}
                <EnvironmentOutlined style={{ marginRight: 5 }} /> 115 Do Thuc Tinh, Khue Trung, Cam Le |{" "}
                <MailOutlined style={{ marginLeft: 10, marginRight: 5 }} />{" "}
                Email: fashion@gmail.com.vn |{" "}
                <HistoryOutlined style={{ marginLeft: 10, marginRight: 5 }} />{" "}
                08:00 - 17:00
              </span>
            </div>
            {Top()}
            {Navigation()}
          </div>
          {Body()}
          <FooterWeb />
          <BackTop style={{ right: 40, top: "79%" }}>
            <div className="back-top">
              <ArrowUpOutlined />
            </div>
          </BackTop>
          {/* <ChatBotPage /> */}

          {/* <MessengerCustomerChat
              pageId="103589342159207"
              appId="571045450624452"
              // htmlRef="<REF_STRING>"
            />
           */}
        </Layout>
      )}
    </div>
  );
}
