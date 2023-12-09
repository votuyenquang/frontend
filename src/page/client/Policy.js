import React, { useEffect, useState } from "react";
import { Carousel, Col, Row, Button, Breadcrumb } from "antd";
import Spinner from "../../elements/spinner";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import {
  BulbFilled,
  FormatPainterFilled,
  CompassFilled,
  ToolFilled,
} from "@ant-design/icons";
import Slider from "react-slick";

export default function Policy() {
  return (
    <div style={{ marginTop: 20, marginLeft: 30 }}>
      <Breadcrumb style={{ fontSize: 18, padding: "20px 20px" }}>
        <Breadcrumb.Item>
          <Link to={"/home"}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`Chính sách`}</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{display: "block", marginLeft: 30, marginRight: 40, marginBottom: 40}}>
        <h2>I. GIỚI THIỆU   </h2>
        <span className="text">
          1.1. Chào mừng bạn đến với nền tảng Fashion HQ (bao gồm website và ứng dụng
          di động Fashion HQ). Fashion nghiêm túc thực hiện trách nhiệm của mình liên
          quan đến bảo mật thông tin theo các quy định về bảo vệ bí mật thông
          tin cá nhân của pháp luật Việt Nam (“Luật riêng tư”) và cam kết tôn
          trọng quyền riêng tư và sự quan tâm của tất cả người dùng đối với
          website và ứng dụng di động của chúng tôi (“Nền tảng”) (chúng tôi gọi
          chung Các Nền tảng và các dịch vụ chúng tôi cung cấp như được mô tả
          trong Nền tảng của chúng tôi là "các Dịch Vụ"). Người dùng có nghĩa là
          người đăng ký tài khoản với chúng tôi để sử dụng các Dịch Vụ, bao gồm
          cả người mua và người bán (gọi chung và gọi riêng là “Các Người Dùng”,
          “bạn” hoặc “của bạn”). Chúng tôi nhận biết tầm quan trọng của dữ liệu
          cá nhân mà bạn đã tin tưởng giao cho chúng tôi và tin rằng chúng tôi
          có trách nhiệm quản lý, bảo vệ và xử lý dữ liệu cá nhân của bạn một
          cách thích hợp. Chính sách bảo mật này ("Chính sách bảo mật" hay
          "Chính sách") được thiết kế để giúp bạn hiểu được cách thức chúng tôi
          thu thập, sử dụng, tiết lộ và/hoặc xử lý dữ liệu cá nhân mà bạn đã
          cung cấp cho chúng tôi và/hoặc lưu giữ về bạn, cho dù là hiện nay hoặc
          trong tương lai, cũng như để giúp bạn đưa ra quyết định sáng suốt
          trước khi cung cấp cho chúng tôi bất kỳ dữ liệu cá nhân nào của bạn.
        </span>
        <span className="text">1.2. "Dữ Liệu Cá Nhân" hay "dữ liệu cá nhân" có nghĩa là dữ liệu, dù đúng hay không, về một cá nhân mà thông qua đó có thể được xác định được danh tính, hoặc từ dữ liệu đó và thông tin khác mà một tổ chức có hoặc có khả năng tiếp cận. Các ví dụ thường gặp về dữ liệu cá nhân có thể gồm có tên, số chứng minh nhân dân và thông tin liên hệ.</span>
        <span className="text">1.3. Bằng việc sử dụng Các Dịch Vụ, đăng ký một tài khoản với chúng tôi hoặc truy cập Nền tảng, bạn xác nhận và đồng ý rằng bạn chấp nhận các phương pháp, yêu cầu, và/hoặc chính sách được mô tả trong Chính sách bảo mật này, và theo đây bạn xác nhận bạn đã biết rõ và đồng ý toàn bộ cho phép chúng tôi thu thập, sử dụng, tiết lộ và/hoặc xử lý dữ liệu cá nhân của bạn như mô tả trong đây. NẾU BẠN KHÔNG ĐỒNG Ý CHO PHÉP XỬ LÝ DỮ LIỆU CÁ NHÂN CỦA BẠN NHƯ MÔ TẢ TRONG CHÍNH SÁCH NÀY, VUI LÒNG KHÔNG SỬ DỤNG CÁC DỊCH VỤ CỦA CHÚNG TÔI HAY TRUY CẬP NỀN TẢNG HOẶC TRANG WEB CỦA CHÚNG TÔI. Nếu chúng tôi thay đổi Chính sách bảo mật của mình, chúng tôi sẽ thông báo cho bạn bao gồm cả thông qua việc đăng tải những thay đổi đó hoặc Chính sách bảo mật sửa đổi trên Nền tảng của chúng tôi. Trong phạm vi pháp luật cho phép, việc tiếp tục sử dụng các Dịch Vụ hoặc Nền Tảng, bao gồm giao dịch của bạn, được xem là bạn đã công nhận và đồng ý với các thay đổi trong Chính Sách Bảo Mật này.</span>
        <h2>II. KHI NÀO CHÚNG TÔI SẼ THU NHẬP DỮ LIỆU CỦA BẠN</h2>
        <span className="text">2.1. Chúng tôi sẽ/có thể thu thập dữ liệu cá nhân về bạn:</span>
        <span className="text">- Khi bạn đăng ký và/hoặc sử dụng Các Dịch Vụ hoặc Nền tảng của chúng tôi, hoặc mở một tài khoản với chúng tôi;</span>
        <span className="text">- Khi bạn gửi bất kỳ biểu mẫu nào, bao gồm đơn đăng ký hoặc các mẫu đơn khác liên quan đến bất kỳ sản phẩm và dịch vụ nào của chúng tôi, bằng hình thức trực tuyến hay dưới hình thức khác;</span>
        <span className="text">- Khi bạn ký kết bất kỳ thỏa thuận nào hoặc cung cấp các tài liệu hoặc thông tin khác liên quan đến tương tác giữa bạn với chúng tôi, hoặc khi bạn sử dụng các sản phẩm và dịch vụ của chúng tôi;</span>
        <span className="text">- Khi bạn tương tác với chúng tôi, chẳng hạn như thông qua các cuộc gọi điện thoại (có thể được ghi âm lại), thư từ, fax, gặp gỡ trực tiếp, các nền ứng dụng truyền thông xã hội và email;</span>
        <span className="text">- Khi bạn sử dụng các dịch vụ điện tử của chúng tôi, hoặc tương tác với chúng tôi qua Nền tảng hoặc Trang Web hoặc Các Dịch Vụ của chúng tôi. Trường hợp này bao gồm thông qua tập tin cookie mà chúng tôi có thể triển khai khi bạn tương tác với các Nền tảng hoặc Trang Web của chúng tôi;</span>
        <span className="text">- Khi bạn cấp quyền trên thiết bị của bạn để chia sẻ thông tin với ứng dụng hoặc Nền tảng của chúng tôi</span>
        <span className="text">2.2. Chúng tôi có thể thu thập thông tin của bạn từ bạn, các công ty liên kết, các bên thứ ba và từ các nguồn khác, bao gồm nhưng không giới hạn ở đối tác kinh doanh (ví dụ như đơn vị cung ứng dịch vụ vận chuyển, thanh toán), cơ quan đánh giá tín dụng, các đơn vị, đối tác cung cấp dịch vụ marketing, giới thiệu, các chương trình khách hàng thân thiết, những người dùng khác sử dụng Các Dịch Vụ của chúng tôi hoặc các nguồn dữ liệu công khai có sẵn hay các nguồn dữ liệu của nhà nước.</span>
        <h2>III. CHÚNG TÔI SẼ THU NHẬP NHỮNG DỮ LIỆU GÌ ?</h2>
        <span className="text">3.1. Trừ trường hợp được quy định khác đi trong Chính sách này, dữ liệu cá nhân mà Shopee có thể thu thập bao gồm dữ liệu cá nhân cơ bản và  dữ liệu cá nhân nhạy cảm (theo quy định của Luật riêng tư) như được liệt kê dưới đây:</span>
        <span className="text">- Họ tên</span>
        <span className="text">- Địa chỉ email</span>
        <span className="text">- Ngày sinh</span>
        <span className="text">- Địa chỉ thanh toán và/hoặc giao nhận hàng hóa;</span>
        <span className="text">- Tài khoản ngân hàng và thông tin thanh toán</span>
        <span className="text">- Số điện thoại</span>
        <span className="text">- Giới tính</span>
        <span className="text">- Thông tin được gửi bởi hoặc liên quan đến (các) thiết bị được sử dụng để truy cập vào Các Dịch vụ hoặc Nền tảng của chúng tôi</span>
        <span className="text">- Thông tin về mạng của bạn, bao gồm danh sách liên hệ của bạn khi đồng ý chia sẻ trên thiết bị của bạn, và những người và tài khoản mà bạn có tương tác;</span>
        </div>
    </div>
  );
}
