import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderById = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/v1/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div>
        <h1>Order Expired</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Time left to pay : {timeLeft} seconds</h1>

      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey="pk_test_51IwpxzIQJfF9sHuejQjdXJRSqmft1WPvBQ9ysNy04m5AsdYq8S1j8CZniOU5LucmSdn1y5YAnxio5hL0GLy19iWG00I9I2PdpS"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderById.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/v1/orders/${orderId}`);
  return { order: data };
};

export default OrderById;
