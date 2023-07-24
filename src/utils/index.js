import { isBefore, parse } from "date-fns";
import { sha256 } from "js-sha256";
import { strtotime } from "locutus/php/datetime";
import { lcfirst, strpos, substr, ucfirst } from "locutus/php/strings";
import { empty, gettype } from "locutus/php/var";
import _ from "lodash";
import * as moment from "moment";
/**
 * General utility functions for MNR app
 */
import { Notify } from "quasar";
import { i18n } from "src/boot/i18n";

/*=======================================
CONTACTS
======================================*/
export const contactAddress = (contact) => {
  const ca = [];
  if (contact.address1) ca.push(contact.address1);
  if (contact.address2) ca.push(contact.address2);
  if (contact.town) ca.push(contact.town);
  if (contact.county) ca.push(contact.county.name);
  if (contact.postcode) ca.push(contact.postcode);
  if (contact.country) ca.push(contact.country.name);
  const address = ca.length ? ca.join(", ") : "";
  return address;
};
export const contactName = (contact) => {
  const ca = [];
  if (contact.name) ca.push(contact.name);
  if (contact.surname) ca.push(contact.surname);
  const name = ca.length ? ca.join(" ") : ca.email || "";
  return name;
};
export const contactPhone = (contact) => {
  return contact.phone || "";
};
export const contactEmail = (contact) => {
  return contact.email || "";
};
export const getAssociationTargetTable = (association) => {
  return snakeToCamel(association.targetTable);
};
/**
 * Reststate returns objects for singulars, arrays for multiples
 * This will assume that either way we're interested in the first record only
 * and will extract the id from that record
 * @param {object|array} opt
 * @returns
 */
export const extractID = (opt) => {
  if (opt && opt.data) {
    const data = Array.isArray(opt.data) ? opt.data[0] : opt.data;
    return data.id;
  } else {
    return undefined;
  }
};
/**
 *
 * @param {string} expiryDate
 * @param {string} testDate (optional)
 * @returns Boolean
 */
export const isExpired = (expiryDate, testDate) => {
  if (empty(testDate)) {
    testDate = new Date();
  } else {
    testDate = parse(testDate, "yyyy-MM-dd", new Date());
  }
  const expired = isBefore(
    parse(expiryDate, "yyyy-MM-dd", new Date()),
    testDate
  );
  return expired;
};

export const getBrowserID = (navigator) => {
  return sha256(
    navigator.vendor +
      navigator.appCodeName +
      navigator.appName +
      navigator.platform +
      navigator.product +
      navigator.productSub
  );
};

/*=======================================
NOTIFICATIONS
======================================*/
/**
 * Shortcut alias for standardised and simplified notification
 */
export const notify = (message, color = "green", config = {}) => {
  const defaultConfig = {
    color,
    position: "bottom",
    icon: "report_problem",
    multiline: false,
    html: false,
  };
  if (
    config?.color == "negative" ||
    (!config.color && defaultConfig.color == "negative")
  ) {
    defaultConfig.timeout = 0;
    defaultConfig.actions = [
      {
        label: "Dismiss",
        color: "white",
        handler: () => {},
      },
    ];
  }
  config = _.merge(defaultConfig, config);
  if (Array.isArray(message)) {
    message.forEach((item) => {
      config.message = item;
    });
    Notify.create(config);
  } else {
    config.message = message;
    Notify.create(config);
  }
};
/*=======================================
CRYPTOGRAPHY
======================================*/
export const hash = (message) => {
  return sha256(JSON.stringify(message));
};
/**
 * takes the first part of the UUID as a memorable reference for the entity
 * @param {string} uuid
 */
export const uuidToRef = (uuid) => {
  if (empty(uuid)) return "";
  return uuid.replace("-", "").substring(0, 8);
};
/*=======================================
OBJECTS
======================================*/
/**
 * Find object property by value
 * @param {object} obj Object to filter properties from
 * @param {val} val The search value
 * @returns array of found keys
 */
export const filterObjectProperties = (obj, val) => {
  const foundKeys = Object.keys(obj).filter((x) => obj[x] === val);
  return foundKeys;
};
/*=======================================
ARRAYS
======================================*/
export const intersection = (arr1, arr2) => {
  return arr1.filter((x) => arr2.includes(x));
};
/*=======================================
STRINGS
======================================*/
export const snakeToCamel = (str) =>
  str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
export const snakeToLowerCamel = (str) => {
  return lcfirst(snakeToCamel(str));
};
/*=======================================
DATES
======================================*/
export const sqlDate = (date) => {
  const sqlDate = moment //-
    .unix(
      strtotime(date) //-
    ) //-
    .format("YYYY-MM-DD");
  return sqlDate;
};
export const sqlDateTime = (date) => {
  const sqlDateTime = moment //-
    .unix(
      strtotime(date) //-
    ) //-
    .format("YYYY-MM-DD HH:mm:ss");
  return sqlDateTime;
};
export const relationshipsAreEqual = (splitRelationships) => {
  let {
    oldRelationships,
    newRelationships,
    emptyOldRelationships,
    emptyNewRelationships,
  } = splitRelationships;
  if (emptyOldRelationships && emptyNewRelationships) {
    return true;
  }

  const newType = gettype(newRelationships);
  const oldType = gettype(oldRelationships);

  if (newType !== oldType) return false;
  if (newType == "array") {
    const a = oldRelationships.map((record) => record.id),
      b = newRelationships.map((record) => record.id),
      result = _.isEqualWith(a, b, checker);
    return result;
  }
  if (newType == "object") {
    return oldRelationships.id === newRelationships.id;
  }
};

export const isEqual = (a, b) => {
  return _.isEqualWith(a, b, checker);
};
/**
 * Takes ISO date string and returns MNR date string. Used by PDF
 * @param {object} dateString
 */
export const getMnrDate = (dateString, format = "dateTimeFormat") => {
  if (empty(dateString)) return ""; // don't try to format if there's no data
  const unixtime = strtotime(dateString);
  let momentFormat;
  switch (format) {
    case "dateFormat":
      momentFormat = "YYYY-MM-DD";
      const spacePos = strpos(dateString, " ");
      if (spacePos > 0) {
        const dateOnly = substr(dateString, 0, spacePos);
        dateString = dateOnly;
      }
      break;

    default:
      momentFormat = "YYYY-MM-DD HH:mm:ss";
      break;
  }
  const date = moment(dateString, momentFormat, true).format(i18n.t(format));
  return date;
};
/*=======================================
VALIDATION
======================================*/
export const qoptionRule = (type, options) => {
  return function (options) {
    const validators = [];
    if (type === "name") {
      if (options.length) {
        validators.push(
          (val) => !empty(val) || "Please select an option or type in an name"
        );
      } else {
        validators.push((val) => !empty(val) || "Please type in an name");
      }
    } else if (type === "address") {
      if (options.length) {
        validators.push(
          (val) =>
            !empty(val) || "Please select an option or type in an address"
        );
      } else {
        validators.push((val) => !empty(val) || "Please type in an address");
      }
    } else {
      validators.push((val) => !empty(val) || "Please select an option");
    }
    return [...validators];
  };
};
/*=======================================
JSONAPI
======================================*/
/**
 * Given an association object, will return a Cake-compliant
 * relationship name; i.e. singular if `manyToOne`
 * @param {object} association from table schema
 */
export const getRelationshipNameFromAssociation = (association) => {
  return association.type === "manyToOne"
    ? snakeToLowerCamel(association.singular)
    : snakeToLowerCamel(association.name);
};
/**
 * Testing whether a data object is empty is a little tricky.
 * This covers all edge cases
 * @param {object} obj
 */
export const isEmptyJSONAPIdata = (obj) => {
  if (typeof obj === "undefined") return true;
  if (obj === null) return true;
  if (empty(obj)) return true;
  if (_.isArray(obj)) {
    if (obj.length) {
      if (obj[0] === null || obj[0] === undefined) {
        return true;
      }
      return false;
    }
    return true;
  }
  if (_.isObject(obj)) {
    if (empty(Object.getOwnPropertyNames(obj))) return true;
    if (
      obj.attributes === undefined ||
      obj.id === undefined ||
      obj.relationship === undefined
    )
      return true;
    if (empty(obj.attributes) && empty(obj.id) && empty(obj.relationships))
      return true;
  }
  return false;
};
export const checkEmpty = (a, b) => {
  const aEmpty = empty(a);
  const bEmpty = empty(b);
  if (aEmpty && bEmpty) return true; // always equal
  if ((!aEmpty && bEmpty) || (aEmpty && !bEmpty)) return false; // always equal
  return undefined;
};
export const checkScalar = (a, b) => {
  const mt = checkEmpty(a, b);
  return mt === undefined ? a === b : mt;
};
export const checkArray = (a, b) => {
  const mt = checkEmpty(a, b);
  let diffA = _.differenceWith(a, b, _.isEqual);
  let diffB = _.differenceWith(b, a, _.isEqual);
  return mt === undefined ? empty(diffA) && empty(diffB) : mt;
};
export const checkObject = (a, b, isEqual = true) => {
  const mt = checkEmpty(a, b);
  return mt === undefined ? _.isEqual(a, b) : mt;
};
export const checkerType = (a, b) => {
  const aIsArray = _.isArray(a);
  const bIsArray = _.isArray(b);
  const aIsObject = _.isObject(a);
  const bIsObject = _.isObject(b);
  if (aIsArray && bIsArray) {
    return "checkArray";
  }
  if (aIsObject && !aIsArray && bIsObject && !bIsArray) {
    return "checkObject";
  }
  return "checkScalar";
};
export const checker = (a, b) => {
  const cType = checkerType(a, b);
  // console.log("checker cType", cType);
  // console.log("a", a);
  // console.log("b", b);
  const fList = {
    checkArray,
    checkScalar,
    checkObject,
  };
  const isEqual = fList[cType](a, b);
  return isEqual;
};
export const toArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.includes(",")) {
    return val.split(",");
  }
  return [val];
};
/**
 * This normalises looking for a related record from either source or submission
 * @param {object} entity parent from which to find related record
 * @param {string} relationshipName name of relationship to find
 * @param {string} relatedName name of associations to find
 * @returns {object}
 */
export const getAssociatedIdFromRelatedOrRelationship = (
  entity,
  relationshipName,
  relatedName
) => {
  if (!empty(entity.related)) {
    return entity.related[ucfirst(relatedName)]?.id || false;
  }
  if (!empty(entity.relationships)) {
    return entity.relationships[lcfirst(relationshipName)]?.data?.id || false;
  }
  return false;
};
/**
 * @why this will attempt to remove / strip any cruft in the response through serialise / deserialise
 * tbh this seems over-engineered.. what's wrong with just always serialise / deserialise instead of all this type checking? -- one ansewr is the value `undefined` which will fail parsing.
 * @param {mixed} data
 * @returns {mixed}
 */
export const strip = (data) => {
  if (_.isArray(data)) {
    return data.reduce((collector, val) => {
      if (!empty(JSON.parse(JSON.stringify(val)))) {
        collector.push(val);
      }
      return collector;
    }, []);
  } else if (_.isObject(data)) {
    return JSON.parse(JSON.stringify(data));
  } else {
    return data;
  }
};
export const logIf = (self, parameter, value, msg, type = "warn") => {
  if ((self[parameter] = value)) {
    console[type](...msg);
  }
};

export const toReststateRecord = (obj) => {
  const record = strip({
    id: obj.id,
    attributes: obj.attributes,
    relationships: obj.relationships,
    links: obj.links,
    type: obj.type,
  });
  return record;
};
