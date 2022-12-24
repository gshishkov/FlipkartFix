import React, { useRef, useState } from 'react'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';

import { useDispatch, useSelector } from 'react-redux';

import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { emptyCart } from '../../actions/cartAction';
import { clearErrors, newOrder } from '../../actions/orderAction';


const CheckoutForm = () => {

  const paymentBtn = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const paymentData = {
    amount: Math.round(totalPrice),
    email: user.email,
    phoneNo: shippingInfo.phoneNo,
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    // Suzdava metod za plashtane
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: user.name,
        email: user.email,
        address: {
          line1: shippingInfo.address,
          city: shippingInfo.city,
          country: shippingInfo.country,
          state: shippingInfo.state,
          postal_code: shippingInfo.pincode,
        },
      }

    })
    // Ako vsicko e nared  procesva plashtaneto v back end-a
    if (!error) {
      console.log(paymentMethod)
      const { id } = paymentMethod;
      try {

        const { data } = await axios.post(
          "http://localhost:4000/api/v1/payment/process",
          {
            id,
            amount: Math.round(totalPrice * 100)
          },

        );
        // Ako back enda vurne sucess na plashtaneto 
        // dobawq ordera w bazata danni 
        const { success } = data;
        if (success == true) {
          const order = {
            shippingInfo,
            orderItems: cartItems,
            totalPrice,
            paymentInfo: {
              id: id,
              status: true
            }
          }
          dispatch(newOrder(order));
          dispatch(emptyCart());
          navigate("/order/success");
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  }

  console.log(!stripe || loading);

  return <form onSubmit={handleSubmit} className="card card-body">

    <div className="form-group">
      <CardElement />
    </div>
    <button ref={paymentBtn} className="text-center my-2 bg-primary-orange w-full sm:w-1/3 my-2 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none cursor-pointer">Pay: {totalPrice.toLocaleString()} </button>

  </form>
}

export default CheckoutForm