const privateAuthEndpoint = require('../apiEndpoints').privateAuth
const baseUrl = require('../apiEndpoints').base

// create a particular invoice by name
const createInvoice = (z, bundle) => {
  const authPromise = z.request({
    method: 'POST',
    url: privateAuthEndpoint,
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
      const headers = {
        'Cookie': response.getHeader('set-cookie')
      }
      return z.request({
        url: `${baseUrl}/Sale/Print`,
        params: {
          PrintEntityID: bundle.inputData.saleId,
          PrintTemplateID: bundle.inputData.templateId
        },
        headers: headers
      }).then(response => {
        if (response.content.length != 36) {
          throw new Error("Authentication failed");
        } else {
          const pdfRequest = z.request({
            url: `${baseUrl}/Sale/Download/${response.content}`,
            headers: headers,
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

    sample: {
      pdfUrl: "https://zapier-dev-files.s3.amazonaws.com/cli-platform/be2e3fe5-8615-42e6-82e0-f17e2df57060",
    },

    outputFields: [
      {key: 'pdfUrl', label: 'URL of Invoice PDF'}
    ]
  }
};
