import {OAuth2Client} from 'google-auth-library'

const client = new OAuth2Client({
    client_id: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URL
});

export default client;