import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>Looged in user: {currentUser.email}</h1> : <h1>No User is signed in</h1>;
};

// plain function not a components
LandingPage.getInitialProps = async (context) => {
  console.log('Landing Page!!.. 😍');

  const client = buildClient(context);
  const { data } = await client.get('/api/v1/users/currentuser');
  console.log(data);
  return data;
};

export default LandingPage;
