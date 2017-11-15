const apiEndpoint = "https://inventory.dearsystems.com/ExternalApi";

// get a single sale
const getSale = (z, bundle) => {
  const responsePromise = z.request({
    url: `${apiEndpoint}/Sale`,
    params: {
      ID: bundle.inputData.id
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// get a list of sales
const listSales = (z) => {
  const responsePromise = z.request({
    url: `${apiEndpoint}/SaleList`
  });
  return responsePromise
    .then(response => JSON.parse(response.content["SaleList"]));
};

// find a particular sale by name
const searchSales = (z, bundle) => {
  const responsePromise = z.request({
    url: `${apiEndpoint}/SaleList`,
    params: {
      search: bundle.inputData.string
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content["SaleList"]));
};

// create a sale
const createSale = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: `${apiEndpoint}/Sale`,
    body: {
      ID: bundle.inputData.id,
      name: bundle.inputData.name // json by default
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

module.exports = {
  key: 'sale',
  noun: 'Sale',

  get: {
    display: {
      label: 'Get Sale',
      description: 'Gets a sale.'
    },
    operation: {
      inputFields: [
        {
          key: 'id',
          required: true
        }
      ],
      perform: getSale
    }
  },

  list: {
    display: {
      label: 'New Sale',
      description: 'Lists the sales.'
    },
    operation: {
      perform: listSales
    }
  },

  search: {
    display: {
      label: 'Find Sale',
      description: 'Finds a sale by searching.'
    },
    operation: {
      inputFields: [
        {
          key: 'string',
          required: true,
          type: 'string',
          helpText: 'Only return sales with search value contained in one of these fields: OrderNumber, Status, Customer, invoiceNumber, CustomerReference, CreditNoteNumber'
        }
      ],
      perform: searchSales
    },
  },

  // create: {
  //   display: {
  //     label: 'Create Sale',
  //     description: 'Creates a new sale.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'name', required: true}
  //     ],
  //     perform: createSale
  //   },
  // },

  // sample: {
  //   id: 1,
  //   name: 'Test'
  // },

  // outputFields: [
  //   {key: 'id', label: 'ID'},
  //   {key: 'name', label: 'Name'}
  // ]
};
