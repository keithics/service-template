import prettyFormat from 'pretty-format';
import forEach from 'lodash.foreach';
import clone from 'lodash.clone';

/**
 * Snapshot serialized that have a fixed value on id, createdAt and updatedAt
 */
const _id = '0'.repeat(24);
const token = 'this is a sample jwt token';
const createdAt = '1984-01-24T16:00:00.000Z';
const updatedAt = '1984-01-24T16:00:00.000Z';
const email = 'fixedEmailForJestOnly@jest.com';
const password = _id;
const user = _id;

const keyValues = { _id, createdAt, updatedAt, token, password, user, email };
const keys = Object.keys(keyValues);

/**
 * Recursively replaces value given the object
 * @param object
 */
function deepReplacePropertyValue(object) {
  const newObject = clone(object);

  forEach(object, (val, key) => {
    if (keys.includes(key)) {
      newObject[key] = keyValues[key];
    } else if (typeof val === 'object') {
      newObject[key] = deepReplacePropertyValue(val);
    }
  });

  return newObject;
}

expect.addSnapshotSerializer({
  serialize(val) {
    return prettyFormat(deepReplacePropertyValue(val));
  },

  test(val) {
    return val;
  },
});
