const fortune = require('fortune');
const mongodbAdapter = require('fortune-mongodb');
const isFunction = require('lodash/isFunction');
const { randomBytes } = require('crypto');
const { mongodb } = require('c0nfig');
const dataTypes = require('./dataTypes');

const dataTypeDefinitions = {}; // fortune adapter data type definitions
const dataTypeHooks = {}; // fortune adapter data type hooks
const dataTypeToCollectionMap = {}; // map data type names to collection names
const dataTypeIndexes = []; // mongodb collection indexes per data type
const beforeRequestHooks = {}; // custom before request hooks

// populate all data from files
Object.keys(dataTypes).forEach(key => {
  const dataType = dataTypes[key];

  dataTypeDefinitions[dataType.name] = dataType.definition;
  dataTypeHooks[dataType.name] = [
    dataType.input,
    dataType.output
  ];

  if (dataType.collection) {
    dataTypeToCollectionMap[dataType.name] = dataType.collection;
  }

  if (dataType.index) {
    dataTypeIndexes.push({
      collection: dataType.collection,
      index: dataType.index
    });
  }

  if (isFunction(dataType.beforeRequest)) {
    beforeRequestHooks[dataType.name] = dataType.beforeRequest;
  }
});

// create database adapter
const adapter = [
  mongodbAdapter, {
    url: mongodb.url,
    generateId() {
      return randomBytes(12).toString('hex');
    },
    typeMap: dataTypeToCollectionMap
  }
];

// create fortune store instance
const store = fortune(dataTypeDefinitions, {
  adapter,
  hooks: dataTypeHooks
});

// patch request with before hook
const internalRequest = store.request;
store.request = async function (options) {
  const beforeRequestHook = beforeRequestHooks[options.type];

  if (beforeRequestHook) {
    await beforeRequestHook(store, options);
  }

  return internalRequest.call(this, options);
};

// ensure mongodb collection indexes
store.on(fortune.events.connect, () => {
  dataTypeIndexes.forEach(dataType => {
    const db = store.adapter.db;

    if (!dataType.index) {
      return;
    }

    const { keys, options } = dataType.index;

    db.collection(dataType.collection).createIndex(keys, options);
  });
});

store.connect();

module.exports = store;
