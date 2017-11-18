const privateAuth = require('../privateAuthentication');
// get a list of templates
const listTemplates = (z, bundle) => {
  return privateAuth(z, bundle).then(headers => {
    return z.request({
      url: "https://inventory.dearsystems.com/api/vtemplate",
      headers: headers,
      params: {
        page: (bundle.meta.page + 1) 
      }
    }).then(response => {
      return z.JSON.parse(response.content).map(function(template) {
        template.id = template["TemplateID"]
        delete template["TemplateID"]
        template.name = `${template["Name"]} (${template["Process"]})`
        return template
      })
    })
  })
};

module.exports = {
  key: 'template',
  noun: 'Template',

  list: {
    display: {
      label: 'New Template',
      description: 'Lists the templates.'
    },
    operation: {
      perform: listTemplates
    }
  }
};
