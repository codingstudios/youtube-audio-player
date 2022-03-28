const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 120 });

function get(id) {
  return cache.get(id);
}

function set(id, data) {
  if(!id || !data) return;
  return cache.set(id, data)
}
