const testAuthentication = (z, bundle) => {
  const promise = z.request('https://inventory.dearsystems.com/ExternalApi/Me');
  return promise.then(response => {
    if (response.status !== 200) {
      throw new Error('Invalid API Credentials');
    } else {
      return response.content["Company"]
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
      helpText: 'Your Account ID, found at https://inventory.dearsystems.com/ExternalApi'
    },
    {
      key: 'applicationKey',
      type: 'string',
      required: true,
      helpText: 'Your API Key, found at https://inventory.dearsystems.com/ExternalApi'
    }
  ],
  test: testAuthentication,
  connectionLabel: testAuthentication
}