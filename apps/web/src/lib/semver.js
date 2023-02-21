// Our own basic semver functions to get past the rollup+semver issue
import { head, tail } from 'lodash-es';


// is semver A greater than or equal to semver b?
export function gte (a,b)  {
  const alist = a.split(".").map(a=> parseFloat(a));
  const blist = b.split(".").map(b => parseFloat(b));
  return isGte(alist,blist);
}

export function gt (a,b) {
  const alist = a.split(".").map(a=> parseFloat(a));
  const blist = b.split(".").map(b => parseFloat(b));
  return isGt(alist,blist);
}

export function lte (a,b) {
  const alist = a.split(".").map(a=> parseFloat(a));
  const blist = b.split(".").map(b => parseFloat(b));
  return isLte(alist,blist);
}

export function lt (a,b) {
  const alist = a.split(".").map(a=> parseFloat(a));
  const blist = b.split(".").map(b => parseFloat(b));
  return isLt(alist,blist);
}

function isGte (alist,blist) {
  if (tail(alist).length === 0) {
    return head(alist) >= head(blist)
  } else {
    if (head(alist) < head(blist)) {
      return false
    } else {
      return isGte(tail(alist),tail(blist));
    }
  }
}

function isGt (alist,blist) {
  if (tail(alist).length === 0) {
    return head(alist) > head(blist)
  } else {
    if (head(alist) > head(blist)) {
      return true
    } else if (head(blist) > head(alist)) {
      return false
    }
    else {
      return isGt(tail(alist),tail(blist));
    }
  }
}

function isLte (alist,blist) {
  if (tail(alist).length === 0) {
    return head(alist) <= head(blist)
  } else {
    if (head(blist) > head(alist)) {
      return true
    } else {
      return isLte(tail(alist),tail(blist));
    }
  }
}

function isLt (alist,blist) {
  if (tail(alist).length === 0) {
    return head(alist) < head(blist)
  } else {
    if (head(alist) < head(blist)) {
      return true
    } else {
      return isLt(tail(alist),tail(blist));
    }
  }
}
