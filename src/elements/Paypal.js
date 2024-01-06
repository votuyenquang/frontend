import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer,
  } from "@paypal/react-paypal-js";
  import { useEffect } from "react";
//   import { apiCreateOrder } from "../../apis";
  import Swal from "sweetalert2";
  import { useHistory  } from "react-router-dom";
  
  // This value is from the props in the UI
  const style = { layout: "vertical" };
  
  // Custom component to wrap the PayPalButtons and show loading spinner
  const ButtonWrapper = ({
    currency,
    showSpinner,
    amount,
    payload,
    setIsSuccess,
  }) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
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
  
    const handleSaveOrder = async () => {
    //   const response = await apiCreateOrder({ ...payload, status: "Succeed" });
    //   if (response.success) {
    //     setIsSuccess(true);
    //     setTimeout(() => {
    //       Swal.fire(
    //         "Congratulations",
    //         "Order created successfully",
    //         "success"
    //       ).then(() => {
    //         history.push("/");
    //       });
    //     }, 1500);
    //   }
    console.log("=============");
    };
  
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
                handleSaveOrder();
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