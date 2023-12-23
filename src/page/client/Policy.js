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
          <Link to={"/home"}>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`Policy`}</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{display: "block", marginLeft: 30, marginRight: 40, marginBottom: 40}}>
        <h2 style={{fontWeight: "bold"}}>I. INTRODUCE</h2>
        <span className="text">
          1.1. Welcome to the Fashion HQ platform (including the Fashion HQ website and mobile application). Fashion seriously carries out its responsibilities related to information security in accordance with the regulations on protecting personal information confidentiality of Vietnamese law (“Privacy Law”) and commits to respecting privacy and the interest of all users in our website and mobile applications (“Platforms”) (we refer to them collectively as the Platforms and the services we provide as described in our Platforms). I am "the Services"). User means a person who registers an account with us to use the Services, including both buyers and sellers (collectively and individually “Users”, “you” or “your”). . We recognize the importance of the personal data you have entrusted to us and believe that we have a responsibility to manage, protect and process your personal data appropriately. This privacy policy ("Privacy Policy" or "Policy") is designed to help you understand how we collect, use, disclose and/or process personal data that you have submitted to us. Provide to us and/or hold about you, whether now or in the future, and to help you make informed decisions before providing us with any of your personal data .
        </span>
        <span className="text">1.2. “Personal Data” or “personal data” means data, whether true or not, about an individual by whom an individual can be identified, or from that data and other information that an organization has or is capable of accessing. Common examples of personal data may include name, identity card number and contact information.</span>
        <span className="text">1.3. By using the Services, registering for an account with us or accessing the Platform, you acknowledge and agree that you accept the practices, requirements, and/or policies described in the Policy this Privacy Policy, and you hereby confirm that you have given your full knowledge and consent to our collection, use, disclosure and/or processing of your personal data as described herein. IF YOU DO NOT AGREE TO THE PROCESSING OF YOUR PERSONAL DATA AS DESCRIBED IN THIS POLICY, PLEASE DO NOT USE OUR SERVICES OR ACCESS OUR PLATFORM OR WEBSITE. If we change our Privacy Policy, we will notify you including through posting such changes or a revised Privacy Policy on our Platform. To the extent permitted by law, your continued use of the Services or Platform, including your transactions, constitutes your acknowledgment and agreement to the changes in this Privacy Policy.</span>
        <h2 style={{fontWeight: "bold"}}>II. WHEN WILL WE COLLECT YOUR DATA ?</h2>
        <span className="text">2.1. We will/may collect personal data about you:</span>
        <span className="text">- When you register and/or use our Services or Platform, or open an account with us;</span>
        <span className="text">- When you submit any form, including application or other forms relating to any of our products and services, whether online or otherwise;</span>
        <span className="text">- When you enter into any agreement or provide documents or other information in connection with your interactions with us, or when you use our products and services;</span>
        <span className="text">- When you interact with us, such as through phone calls (which may be recorded), letters, faxes, in-person meetings, social media platforms and emails;</span>
        <span className="text">- When you use our electronic services, or interact with us through our Platform or Website or Services. This includes through cookies that we may deploy when you interact with our Platforms or Websites;</span>
        <span className="text">- When you grant permission on your device to share information with our app or Platform.</span>
        <span className="text">2.2. We may collect your information from you, affiliates, third parties and from other sources, including but not limited to business partners (e.g. service providers). shipping, payments), credit rating agencies, marketing and referral service providers, loyalty programs, other users of our Services or publicly available data sources or state data sources.</span>
        <h2 style={{fontWeight: "bold"}}>III. WHAT DATA WILL WE COLLECT?</h2>
        <span className="text">3.1. Except as otherwise provided in this Policy, the personal data that Shopee may collect includes basic personal data and sensitive personal data (as defined by the Privacy Law) as listed below. listed below:</span>
        <span className="text">- Full name</span>
        <span className="text">- Email address</span>
        <span className="text">- Date of birth</span>
        <span className="text">- Payment and/or delivery address;</span>
        <span className="text">- Bank account and payment information</span>
        <span className="text">- Phone number</span>
        <span className="text">- Gender</span>
        <span className="text">- Information sent by or relating to the device(s) used to access our Services or Platforms</span>
        <span className="text">- Information about your network, including your contact list when consenting to sharing on your device, and the people and accounts with which you interact.</span>
        </div>
    </div>
  );
}
