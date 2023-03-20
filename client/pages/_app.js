import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

export default ({ Component, pageProps }) => {
  return (
    <div className="container">
      <h1>Header</h1>
      <Component {...pageProps} />
    </div>
  );
};

// AppComponent.getInitialProps = async (appContext) => {
//   const client = buildClient(appContext.ctx);
//   const { data } = await client.get('/api/v1/users/currentuser');

//   let pageProps = {};

//   if (appContext.Component.getInitialProps) {
//     pageProps = await appContext.Component.getInitialProps(appContext.ctx);
//   }

//   console.log('Data from AppContext 🤣', data);
//   return data;
// };

// export default AppComponent;
