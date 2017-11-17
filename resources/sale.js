const apiEndpoint = require('../apiEndpoints').externalApi;
const listLimit = 100;

// get a single sale
const getSale = (z, bundle) => {
  const responsePromise = z.request({
    url: `${apiEndpoint}/Sale`,
    params: {
      "ID": bundle.inputData.id
    }
  });
  return responsePromise
    .then(response => {
      const data = z.JSON.parse(response.content);
      data.id = data["ID"]
      delete data["ID"];
      return data
    });
};

// get a list of sales
const listSales = (z, bundle) => {
  const resourceName = "SaleList";
  const responsePromise = z.request({
    url: `${apiEndpoint}/${resourceName}`,
    params: {
      "Limit": listLimit,
      "Page": 1
    }
  });
  return responsePromise
    .then(response => {
      var page = Math.trunc(z.JSON.parse(response.content)["Total"] / listLimit) + 1
      return z.request({
        url: `${apiEndpoint}/${resourceName}`,
        params: {
          "Limit": listLimit,
          "Page": page
        }
      }).then(response => {
        var results = z.JSON.parse(response.content)[resourceName].reverse();
        return results.map(function(sale){
          return {id: sale["ID"], sale: z.dehydrate(getSale, { id: sale["ID"] })};
        })
      })
    });
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
    .then(response => z.JSON.parse(response.content)["SaleList"]);
};

// // create a sale
// const createSale = (z, bundle) => {
//   const responsePromise = z.request({
//     method: 'POST',
//     url: `${apiEndpoint}/Sale`,
//     body: {
//       ID: bundle.inputData.id,
//       name: bundle.inputData.name
//     }
//   });
//   return responsePromise
//     .then(response => JSON.parse(response.content));
// };

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
  //   "ID": "43961a95-c946-41af-831b-cb1b7711ec1c",
  //   "OrderNumber": 'R12345'
  // },

  outputFields: [
    {key: 'ID', label: 'ID'},
    {key: 'OrderNumber', label: 'Order Number'}
  ]
};
