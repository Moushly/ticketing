// import buildClient from '../api/build-client';
import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price} </td>
        <td>
          <Link legacyBehavior href="/tickets/[id]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
  // return currentUser ? <h1>Looged in user: {currentUser.email}</h1> : <h1>No User is signed in</h1>;
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// plain function not a components
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/v1/tickets');
  return { tickets: data };
};

export default LandingPage;
