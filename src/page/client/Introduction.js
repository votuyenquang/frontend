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
          <Link to={"/home"}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`Giới thiệu`}</Breadcrumb.Item>
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
          Chào mừng bạn đến với Fashion HQ - điểm đến hàng đầu cho những người
          yêu thời trang và đang tìm kiếm sự phong cách độc đáo. Tại đây, chúng
          tôi tự hào giới thiệu một bộ sưu tập đa dạng với hàng nghìn sản phẩm
          chất lượng cao, từ áo thun thoải mái đến quần jeans thời trang, mang
          đến cho bạn trải nghiệm mua sắm thú vị và độc đáo. Để hiểu rõ hơn về
          chúng tôi, đừng bỏ lỡ nội dung bài viết sau.
        </span>
        <h2 style={{ fontWeight: "bold" }}>TỔNG QUAN VỀ FASHION HQ</h2>
        <span className="text">
          Với sứ mệnh tạo nên không gian mua sắm trực tuyến lý tưởng, chúng tôi
          cam kết cung cấp những sản phẩm chất lượng hàng đầu từ các thương hiệu
          uy tín và những kiểu dáng mới nhất, phản ánh xu hướng thời trang hiện
          đại. Chất liệu cao cấp và sự chăm sóc tỉ mỉ trong từng đường may đều
          là ưu tiên hàng đầu của chúng tôi. Ngoài ra, trải nghiệm mua sắm tại
          Fashion HQ không chỉ là việc chọn lựa sản phẩm mà còn là hành trình
          khám phá phong cách cá nhân của bạn. Chúng tôi luôn cập nhật các xu
          hướng thời trang mới nhất và cung cấp gợi ý phối hợp trang phục để bạn
          có thể tạo nên phong cách riêng biệt và độc đáo.
        </span>
        <span className="text">
          Hãy tham gia cùng chúng tôi trên hành trình thời trang đầy phong cách
          và tự tin. Dù bạn là người đam mê thời trang hay đang tìm kiếm những
          bộ trang phục hàng ngày, Fashion HQ là địa chỉ lý tưởng để thỏa mãn
          đam mê của bạn. Hãy khám phá ngay và biến ước mơ thời trang của bạn
          thành hiện thực!
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
          Nhằm đáp ứng nhu cầu ngày một tăng của khách hàng, Fashion HQ đã và
          đang bán những sản phẩm sau đây:
        </span>
        <div style={{ marginLeft: 10 }}>
          <span className="text">- &nbsp;<Link to="/category/1">Áo</Link></span>
          <span className="text">- &nbsp;<Link to="/category/2">Quần</Link></span>
          <span className="text">- &nbsp;<Link to="/category/3">Giày</Link></span>
          <span className="text">- &nbsp;<Link to="/category/4">Phụ kiện</Link></span>
        </div>
        <h2 style={{ fontWeight: "bold" }}>HÃY CHỌN FASHION HQ</h2>
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card
                title={ <span><CarTwoTone style={{ fontSize: 20 }} /> Giao hàng toàn quốc</span>}
                bordered={false}
              >
                Giao hàng vô cùng nhanh với chỉ 30.000đ.
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={<span><ShoppingTwoTone style={{ fontSize: 20 }} /> Sản phẩm đa dạng</span>}
                bordered={false}
              >
                Áo, quần, phụ kiện các loại luôn chờ đón bạn.
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={
                  <span>
                    <LikeTwoTone style={{ fontSize: 20 }} /> Tiện ích
                  </span>
                }
                bordered={false}
              >
                Bạn có thể theo dõi đơn hàng của mình mọi lúc.
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={
                  <span>
                    <MobileTwoTone style={{ fontSize: 20 }} /> Hỗ trợ mua hàng trên nhiều nền tảng
                  </span>
                }
                bordered={false}
              >
                Bạn có thể mua hàng trên website và ứng dụng di động.
              </Card>
            </Col>
          </Row>
        </div>
        <span className="text" style={{ fontWeight: "bold" }}>
          Fashion HQ xin cam kết với khách hàng:
        </span>
        <div style={{ marginLeft: 10 }}>
          <span className="text">- &nbsp;Sản phẩm đạt chuẩn chất lượng.</span>
          <span className="text">
            - &nbsp;Đội ngũ chăm sóc khách hàng của chúng tôi sẵn sàng hỗ trợ
            bạn 24/7.
          </span>
          <span className="text">
            - &nbsp;Sản phẩm của bạn sẽ được đóng gói cẩn thận và vận chuyển an
            toàn đến địa chỉ của bạn.
          </span>
          <span className="text">
            - &nbsp;Thông tin cá nhân của bạn sẽ được bảo vệ an toàn và không
            bao giờ được chia sẻ với bên thứ ba.
          </span>
          <span className="text">
            - &nbsp;Bạn có quyền đổi hoặc trả hàng trong vòng 7 kể từ ngày nhận
            hàng.
          </span>
        </div>
        <span className="text" style={{ marginTop: 20 }}>
          Chúng tôi mong muốn bạn có một trải nghiệm mua sắm thú vị và hài lòng
          tại Fashion HQ. Xin cảm ơn bạn đã tin tưởng và ủng hộ chúng tôi !
        </span>
      </div>
    </div>
  );
}
