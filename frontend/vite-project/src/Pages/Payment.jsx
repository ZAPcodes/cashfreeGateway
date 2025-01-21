import { useState } from 'react'
import axios from "axios"
import { load } from '@cashfreepayments/cashfree-js'

function Payment() {
  let cashfree; 
  let insitialzeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    })
  }
  insitialzeSDK()
  const [orderId, setOrderId] = useState("")
  const getSessionId = async () => {
    try {
      let res = await axios.get("https://cashfreegateway.onrender.com/api/payment")
      if (res.data && res.data.payment_session_id) {
        console.log(res.data)
        setOrderId(res.data.order_id)
        return res.data.payment_session_id
      }
    } catch (error) {
      console.log(error)
    }
  }
  const verifyPayment = async () => {
    try {
      let res = await axios.post("https://cashfreegateway.onrender.com/api/verify", {
        orderId: orderId
      })
      console.log(res.data)
      if (res.data.order_status==="PAID") {
        alert("payment verified")
      }
      else{
        alert("payment failed")
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleClick = async (e) => {
    e.preventDefault()
    try {
      let sessionId = await getSessionId()
      let Options = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      }
      cashfree.checkout(Options).then((res) => {
        console.log("payment initialized")
        verifyPayment(orderId)
      })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <><h1>Cashfree payment getway</h1>
      <div className="card">
        <button onClick={handleClick}>
          Pay now
        </button></div></>
  )
} export default Payment
