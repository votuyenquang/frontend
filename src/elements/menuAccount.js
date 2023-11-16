
import {Menu,message} from 'antd';
import react, { Fragment, useCallback, useEffect } from 'react';
import {Link} from 'react-router-dom';
import * as FetchAPI from '../util/fetchApi';
import { useState } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';
const { db } = require('../util/db')
const { base_url } = require('../util/base_url')



export default function MenuAccount (props){
    const key = 'updatable';
    const {name, email, id, faceid} = props.data;
    const [isFaceIo, setFaceIo] = useState(false)
    
    const handleLogout = ()=>{
        message.loading({ content: 'Đang đăng xuất...', key });
        setTimeout(()=>{
            localStorage.removeItem("token");
            props.refreshAccount();
            message.success({ content: 'Đăng xuất thành công!', key, duration: 2 });
        },1000)
    }

    const  faceRegistration = async () => {
      try {
    
           await faceioInstance.enroll({
              locale: "auto",
              payload: {
                email: email ,
                id: id,          
              },
            }) 

        const res = await FetchAPI.postDataAPI(`${base_url}/user/updateGetIdUserFace`,{id,faceid});
      handleLogout();
      } catch (error) {
          console.log(error)
        //  handleError(error)
           
      }
      
  }
   
  var  faceioInstance = null;
  useEffect(async() => {
      const faceIoScript = await document.createElement('script')
      faceIoScript.src = '//cdn.faceio.net/fio.js'
      faceIoScript.async = true
      faceIoScript.onload = () => faceIoScriptLoaded()
      document.body.appendChild(faceIoScript)
  
      return () => {
        document.body.removeChild(faceIoScript)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },)
   
    useEffect(async() => {
      try {
        const res = await FetchAPI.postDataAPI(`${base_url}/user/getIdUserFace`,{id});
        console.log('====================================');
        console.log("useCallback: " + isFaceIo);
        console.log('====================================');
        if(res.faceid == 0) {
          setFaceIo(true)
        } else if(res.faceid == 1) {
          setFaceIo(false)
        } else {
          setFaceIo(false)
        }
        // res.faceid == 0 ? setFaceIo(true) : setFaceIo(false)
      } catch (error) {
        console.log('====================================');
        console.log("ERRORR",error);
        console.log('====================================');
      }
  
 
    // const res = await FetchAPI.getAPI(`/product/getProductNew/1`);
  },[])
  const faceIoScriptLoaded = () => {
      console.log(faceIO)
      if (faceIO && !faceioInstance) {
        faceioInstance = new faceIO('fioabda3');
      }
    }

 console.log('====================================');
 console.log(isFaceIo);
 console.log('====================================');
    
 

  
  function handleError(errCode) {
  // Log all possible error codes during user interaction..
  // Refer to: https://faceio.net/integration-guide#error-codes
  // for a detailed overview when these errors are triggered.
  switch (errCode) {
    case fioErrCode.PERMISSION_REFUSED:
      console.log("Access to the Camera stream was denied by the end user");
      break;
    case fioErrCode.NO_FACES_DETECTED:
      console.log("No faces were detected during the enroll or authentication process");
      break;
    case fioErrCode.UNRECOGNIZED_FACE:
      console.log("Unrecognized face on this application's Facial Index");
      break;
    case fioErrCode.MANY_FACES:
      console.log("Two or more faces were detected during the scan process");
      break;
    case fioErrCode.FACE_DUPLICATION:
      console.log("User enrolled previously (facial features already recorded). Cannot enroll again!");
      break;
    case fioErrCode.PAD_ATTACK:
      console.log("Presentation (Spoof) Attack (PAD) detected during the scan process");
      break;
    case fioErrCode.FACE_MISMATCH:
      console.log("Calculated Facial Vectors of the user being enrolled do not matches");
      break;
    case fioErrCode.WRONG_PIN_CODE:
      console.log("Wrong PIN code supplied by the user being authenticated");
      break;
    case fioErrCode.PROCESSING_ERR:
      console.log("Server side error");
      break;
    case fioErrCode.UNAUTHORIZED:
      console.log("Your application is not allowed to perform the requested operation (eg. Invalid ID, Blocked, Paused, etc.). Refer to the FACEIO Console for additional information");
      break;
    case fioErrCode.TERMS_NOT_ACCEPTED:
      console.log("Terms & Conditions set out by FACEIO/host application rejected by the end user");
      break;
    case fioErrCode.UI_NOT_READY:
      console.log("The FACEIO Widget could not be (or is being) injected onto the client DOM");
      break;
    case fioErrCode.SESSION_EXPIRED:
      console.log("Client session expired. The first promise was already fulfilled but the host application failed to act accordingly");
      break;
    case fioErrCode.TIMEOUT:
      console.log("Ongoing operation timed out (eg, Camera access permission, ToS accept delay, Face not yet detected, Server Reply, etc.)");
      break;
    case fioErrCode.TOO_MANY_REQUESTS:
      console.log("Widget instantiation requests exceeded for freemium applications. Does not apply for upgraded applications");
      break;
    case fioErrCode.EMPTY_ORIGIN:
      console.log("Origin or Referer HTTP request header is empty or missing");
      break;
    case fioErrCode.FORBIDDDEN_ORIGIN:
      console.log("Domain origin is forbidden from instantiating fio.js");
      break;
    case fioErrCode.FORBIDDDEN_COUNTRY:
      console.log("Country ISO-3166-1 Code is forbidden from instantiating fio.js");
      break;
    case fioErrCode.SESSION_IN_PROGRESS:
      console.log("Another authentication or enrollment session is in progress");
      break;
    case fioErrCode.NETWORK_IO:
    default:
      console.log("Error while establishing network connection with the target FACEIO processing node");
      break;
  }
}
  
    const checkFace = async () => {
      try {
        const sql = 'SELECT faceid FROM user WHERE email = ? ';
        await db.query(sql,[email],async(err,rows,fields)=>{
          if (err) {
             console.log("ERRORR");
          } else if (rows) {
            console.log("ROWS : ", rows);
          }
        });
      } catch (error) {
        throw new Error(error)
      }
    }

   

    return(
        <Menu theme="dark">
            <Menu.Item key="bill" >
                <Link to="/billfollow">
                Đơn hàng
                </Link>
            </Menu.Item>
            <Menu.Item key="profile" >
                <Link to="/profile">
                    {"Thông tin tài khoản ("+name+")" }
                </Link>
            </Menu.Item>
            {
              isFaceIo ? (
                ( <Menu.Item key="faceID"    onClick={faceRegistration}>
               
               Đăng ký FACE ID
            </Menu.Item>)
              ) : (
                 <Fragment></Fragment>
              )
            }
                 
            <Menu.Item key="logout" onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    )
}