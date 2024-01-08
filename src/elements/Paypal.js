import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer,
  } from "@paypal/react-paypal-js";
  import { useEffect } from "react";
//   import { apiCreateOrder } from "../../apis";
  import Swal from "sweetalert2";
  import { useHistory  } from "react-router-dom";
  import { useDispatch } from 'react-redux';
import {updateCartCurrent} from '../contain/updateQuanityCart';
  
  // This value is from the props in the UI
  const style = { layout: "vertical" };

import * as FetchAPI from '../util/fetchApi';
import React, { useState } from "react";


  
  // Custom component to wrap the PayPalButtons and show loading spinner
  const ButtonWrapper = ({
    currency,
    showSpinner,
    amount,
    payload,
    setIsSuccess,
  }) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
    const [reloadFlag, setReloadFlag] = useState(false);
    const dispatchRedux = useDispatch()
    const history = useHistory ();
    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);
  
    const HandleSaveOrder = async () => {
      const data = {...payload, payment_status : 1};
      console.log("==== after paylod ", data);
      const res = await FetchAPI.postDataAPI("/order/addBill",data);
      if(res.msg){
          if(res.msg==="success"){
              
              setIsSuccess(true);
              setTimeout(() => {
                Swal.fire(
                  "Congratulations",
                  "Order created successfully",
                  "success"
                ).then(() => {
                  history.push("/");
                });
              }, 1500);
              localStorage.removeItem("cart");
              updateCartCurrent(dispatchRedux);
            }
          }else{
            setIsSuccess(false);
            setTimeout(() => {
              Swal.fire(
                "Error",
                "Order created Failed",
                "failure"
              ).then(() => {
                history.push("/");
               
              });
            }, 1500);
          }
      }


  
    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[style, currency, amount]}
          fundingSource={undefined}
          createOrder={(data, actions) =>
            actions.order
              .create({
                purchase_units: [
                  { amount: { currency_code: currency, value: amount } },
                ],
              })
              .then((orderId) => orderId)
          }
          onApprove={(data, actions) =>
            actions.order.capture().then(async (response) => {
              if (response.status === "COMPLETED") {
                HandleSaveOrder();
              }
            })
          }
        />
      </>
    );
  };
  
  export default function Paypal({ amount, payload, setIsSuccess }) {
    return (
      <div style={{ maxWidth: "750px", minHeight: "200px", margin: "auto" }}>
        <PayPalScriptProvider
          options={{
            clientId:
              "AZ50XWEamhd3_wu_ez-m1iZz4EZcG9_b92BqtNUKsoyNOsiGsaYEpIapVKYjkcg6nFM_kys3LFy29Fm4",
            components: "buttons",
            currency: "USD",
          }}
        >
          <ButtonWrapper
            payload={payload}
            setIsSuccess={setIsSuccess}
            currency={"USD"}
            amount={amount}
            showSpinner={false}
          />
        </PayPalScriptProvider>
      </div>
    );
  }