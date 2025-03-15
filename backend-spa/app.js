const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const app = express();

let client;
// Initialize OpenID Client
async function initializeClient() {
    const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_nLGkW5K9J');
    client = new issuer.Client({
        client_id: '5c9r2au5p1vnbcbkeegteuhle3',
        client_secret: '1f1vsvauhl11kho3bsolamaa6cmbgv3ars8gp1l90if4echqv90f',
        redirect_uris: ['http://localhost:3000/token'],
        response_types: ['code']
    });
};
initializeClient().catch(console.error);

app.use(session({
    secret: '23423423423424werwr',
    resave: false,
    saveUninitialized: false
}));;

const checkAuth = (req, res, next) => {
    if (!req.session.userInfo) {
        req.isAuthenticated = false;
    } else {
        req.isAuthenticated = true;
    }
    next();
};

app.get('/', checkAuth, (req, res) => {
    res.render('home', {
        isAuthenticated: req.isAuthenticated,
        userInfo: req.session.userInfo
    });
});

app.get('/login', (req, res) => {
    const nonce = generators.nonce();
    const state = generators.state();

    req.session.nonce = nonce;
    req.session.state = state;

    const authUrl = client.authorizationUrl({
        scope: 'phone openid email',
        state: state,
        nonce: nonce,
    });

    res.redirect(authUrl);
});

// Helper function to get the path from the URL. Example: "http://localhost/hello" returns "/hello"
function getPathFromURL(urlString) {
    try {
        const url = new URL(urlString);
        return url.pathname;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

app.get(getPathFromURL('http://localhost:3000/token'), async (req, res) => {
    try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback(
            'http://localhost:3000/token',
            params,
            {
                nonce: req.session.nonce,
                state: req.session.state
            }
        );

        const userInfo = await client.userinfo(tokenSet.access_token);
        req.session.userInfo = userInfo;

        res.redirect('/');
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('/');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    const logoutUrl = `https://us-east-1nlgkw5k9j.auth.us-east-1.amazoncognito.com/logout?client_id=5c9r2au5p1vnbcbkeegteuhle3&logout_uri=http://localhost:3000/token`;
    res.redirect(logoutUrl);
});

app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log('Server is running on XXXXXXXXXXXXXXXXXXXXX');
}); 