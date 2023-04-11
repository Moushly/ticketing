import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketById = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/v1/orders/createorder',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });
  return (
    <div>
      <h1>{ticket.title} </h1>
      <h4>Price: {ticket.price} </h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketById.getInitialProps = async (context, client) => {
  const { id } = context.query;
  const { data } = await client.get(`/api/v1/tickets/${id}`);
  return { ticket: data };
};

export default TicketById;
