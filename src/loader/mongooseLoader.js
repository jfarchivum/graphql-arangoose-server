/**
 * Helper to batch queries on mongoose
 * @flow
 */
function indexResults(results, indexField, cacheKeyFn = key => key) {
  const indexedResults = new Map();
  results.forEach((res) => {
    indexedResults.set(cacheKeyFn(res[indexField]), res);
  });
  return indexedResults;
}

function normalizeResults(keys, indexField, cacheKeyFn = key => key) {
  return (results) => {
    const indexedResults = indexResults(results, indexField, cacheKeyFn);
    return keys.map(val => indexedResults.get(cacheKeyFn(val)) || new Error(`Key not found : ${val}`));
  };
}

export const cacheKeyFn = key => key.toString();

export default async (model, ids: Array<string> ) => {
  const results = await model.find( {_id : { $in : ids }});
  return normalizeResults(ids, '_id', cacheKeyFn)(results);
};
