module.exports = {
    facebookAuth: {
        clientID: '153260175286885',
        clientSecret: '8d81a9ed442d3ae8bea0597a432d2e05',
        callbackURL: 'http://localhost:8080/auth/facebook/callback',
        profileURL: 'https://graph.facebook.com/v2.11/me'
    },
    twitterAuth: {
        consumerKey: 'your-consumer-key-here',
        consumerSecret: 'your-client-secret-here',
        callbackURL: 'http://localhost:8080/auth/twitter/callback'
    },
    googleAuth: {
        clientID: 'your-secret-clientID-here',
        clientSecret: 'your-client-secret-here',
        callbackURL: 'http://localhost:8080/auth/google/callback'
    }
};
