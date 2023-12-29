import React from 'react';
import { Result,Button } from 'antd';
import {Link} from 'react-router-dom';
export default function NotifyAddProductSucess(){
    return(
        <div>
            <Result
                style={{ height:450,paddingTop:50 }}
                status="success"
                title="Added new product successfully!"
                subTitle="Your product has been added"
                extra={[
                <Button type="primary">
                    <Link to="/admin">
                        Return to homepage
                    </Link>
                </Button>,
                <Button >
                    <Link to="/admin/manageProduct">
                        Product Management
                    </Link>
                </Button>,
            ]}
          />
        </div>
    )
}