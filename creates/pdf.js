const privateAuth = require('../privateAuthentication');
const baseUrl = require('../apiEndpoints').base;

const createPDF = (z, bundle) => {
  const authenticate = privateAuth(z, bundle)
  return authenticate.then(headers => {
    return z.request({
      url: `${baseUrl}/Sale/Print`,
      params: {
        PrintEntityID: bundle.inputData.resourceId,
        PrintTemplateID: bundle.inputData.templateId
      },
      headers: headers
    }).then(response => {
      if (response.content.length != 36) {
        throw new Error('Authentication failed');
      } else {
        const pdfRequest = z.request({
          url: `${baseUrl}/Sale/Download/${response.content}`,
          headers: headers,
          raw: true
        });
        return z.stashFile(pdfRequest).then(url => {
          return {
            pdfUrl: url
          };
        });
      }
    });
  });
};

module.exports = {
  key: 'pdf',
  noun: 'PDF',

  display: {
    label: 'Generate a PDF',
    description: 'Generates a PDF.'
  },

  operation: {

    inputFields: [{
      key: 'resourceId',
      label: 'Resource',
      required: true,
      helpText: 'ID of the resource to generate a PDF for'
    }, {
      key: 'templateId',
      label: 'Template',
      required: true,
      dynamic: 'templateList.id.name',
      helpText: 'Template to use'
    }],

    perform: createPDF,

    sample: {
      pdfUrl: 'https://zapier-dev-files.s3.amazonaws.com/cli-platform/be2e3fe5-8615-42e6-82e0-f17e2df57060'
    },

    outputFields: [{
      key: 'pdfUrl',
      label: 'URL of Invoice PDF'
    }]
  }
};