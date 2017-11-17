const privateAuthEndpoint = require('../apiEndpoints').privateAuth

// create a particular invoice by name
const createInvoice = (z, bundle) => {
  const authPromise = z.request({
    method: 'POST',
    url: privateAuthEndpoint,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      UserName: bundle.authData.username,
      Password: bundle.authData.password
    },
    redirect: 'manual'
  })

  return authPromise.then(response => {
    if (response.status != 302) {
      throw new Error("Authentication failed");
    } else {
      const cookie = response.getHeader('set-cookie')
      return z.request({
        url: 'https://inventory.dearsystems.com/Sale/Print',
        params: {
          PrintEntityID: bundle.inputData.saleId,
          PrintTemplateID: bundle.inputData.templateId
        },
        headers: {
          'Cookie': cookie
        }
      }).then(response => {
        if (response.content.length != 36) {
          throw new Error("Authentication failed");
        } else {
          const pdfRequest = z.request({
            url: `https://inventory.dearsystems.com/Sale/Download/${response.content}`,
            headers: {
              'Cookie': cookie
            },
            raw: true
          })
          return z.stashFile(pdfRequest).then(url => {
            return {
              pdfUrl: url
            }
          })
        }
      });
    }
  })
};

module.exports = {
  key: 'invoice',
  noun: 'Invoice',

  display: {
    label: 'Create Invoice',
    description: 'Creates a invoice.'
  },

  operation: {
    inputFields: [
      {key: 'saleId', required: true, helpText: 'ID of the sale to print'},
      {key: 'templateId', required: true, helpText: 'ID of the template to print (try 8855b494-449c-4003-98d6-df06d748d748)'}
    ],
    perform: createInvoice,

    // sample: {
    //   id: 1,
    //   name: 'Test'
    // },

    // outputFields: [
    //   {key: 'id', label: 'ID'},
    //   {key: 'name', label: 'Name'}
    // ]
  }
};
