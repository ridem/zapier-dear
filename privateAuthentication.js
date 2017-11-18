const privateAuthEndpoint = require('./apiEndpoints').privateAuth;

const privateAuth = (z, bundle) => {
  const authPromise = z.request({
    method: 'POST',
    url: privateAuthEndpoint,
    form: {
      UserName: bundle.authData.username,
      Password: bundle.authData.password
    },
    redirect: 'manual'
  });

  return authPromise.then(response => {
    if (response.status != 302) {
      throw new Error('Authentication failed');
    } else {
      const headers = {
        Cookie: response.getHeader('set-cookie')
      };
      return headers
    }
  })
}

module.exports = privateAuth