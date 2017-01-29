let superagent = require('superagent');
let superdebug = require('../index').default;

superagent
    .get('http://localhost:3000/debug')
    .set({Accept: 'application/json'})
    .query({superdebug: 'is-awesome'})
    .use(superdebug(console.info))
    .timeout(10000)
    .send()
    .end();

superagent
    .get('http://localhost:3000/404')
    .set({Accept: 'application/json'})
    .use(superdebug(console.info))
    .send()
    .end();
