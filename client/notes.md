So, the next.config.js file should now look like this:

module.exports = {
webpack: (config) => {
config.watchOptions.poll = 300;
return config;
},
};

###

Change this code in client/pages/index.js

const LandingPage = ({ currentUser }) => {
console.log(currentUser);
axios.get('/api/users/currentuser');

return <h1>Landing Page</h1>;
};
to this:

const LandingPage = ({ currentUser }) => {
console.log(currentUser);
axios.get('/api/users/currentuser').catch((err) => {
console.log(err.message);
});

return <h1>Landing Page</h1>;
};
