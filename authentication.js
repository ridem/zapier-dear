const apiEndpoint = require('./apiEndpoints').externalApi

const testAuthentication = (z, bundle) => {
  const promise = z.request(`${apiEndpoint}/Me`);
  return promise.then(response => {
    if (response.status !== 200) {
      throw new Error(response.content);
    } else {
      const company = z.JSON.parse(response.content)["Company"]
    }
  });
}

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'accountId',
      type: 'string',
      required: true,
      helpText: `Your Account ID, found at ${apiEndpoint}`
    },
    {
      key: 'applicationKey',
      type: 'string',
      required: true,
      helpText: `Your API Key, found at ${apiEndpoint}`
    },
    {
      key: 'username',
      type: 'string',
      required: true,
      helpText: 'Your login username.'
    },
    {
      key: 'password',
      type: 'string',
      required: true,
      helpText: 'Your login password.'
    }
  ],
  test: testAuthentication,
  connectionLabel: testAuthentication
}