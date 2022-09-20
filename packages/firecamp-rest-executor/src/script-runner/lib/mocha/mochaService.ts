// @ts-nocheck
import _each from 'lodash/each'
import _map from 'lodash/map'
import _forOwn from 'lodash/forOwn'
import _pick from 'lodash/pick'
import _countBy from 'lodash/countBy'
import { nanoid as id } from 'nanoid'

const PASS = 1
const FAIL = 2
const SKIP = 3

export function SumUpChildMeta(suite) {
  const queue = []
  const obj = {
    pass: suite.meta.pass || 0,
    fail: suite.meta.fail || 0,
    skip: suite.meta.skip || 0,
    total: suite.meta.total || 0,
    pending: suite.meta.pending || 0,
    duration: suite.meta.duration || 0
  }

  let next = suite.suites
  while (next) {
    _each(next, (suite, i) => {
      if (suite.meta) {
        obj.pass += suite.meta.pass
        obj.fail += suite.meta.fail
        obj.skip += suite.meta.skip
        obj.pending += suite.meta.pending
        obj.total += suite.meta.total
        obj.duration += suite.meta.duration

        obj.passPer = (obj.pass * 100) / obj.total
        obj.failPer = (obj.fail * 100) / obj.total
        obj.skipPer = (obj.skip * 100) / obj.total
        obj.pendingPer = (obj.pending * 100) / obj.total
      }
      queue.push(suite)
    })
    next = queue.shift()
  }
  return obj
}

export function ApplyChildMetaHierarchy(build) {
  const queue = []
  let next = build
  while (next) {
    _map(next.suites, b => {
      b.childMeta = SumUpChildMeta(b)
      queue.push(b)
    })
    next = queue.shift()
  }
}

/**
 * Remove all properties from an object except
 * those that are in the propsToKeep array.
 *
 * @param {Object} obj
 * @param {Array} propsToKeep
 * @api private
 */
export function RemoveAllPropsFromObjExcept(obj, propsToKeep) {
  _forOwn(obj, (val, prop) => {
    if (propsToKeep.indexOf(prop) === -1) {
      delete obj[prop]
    }
  })
}

/**
 * Do a breadth-first search to find
 * and format all nested 'suite' objects.
 *
 * @param {Object} suite
 * @api private
 */
export function TraverseSuites(suite) {
  const queue = []
  let next = suite
  while (next) {
    if (next.root) {
      CleanSuite(next)
    }
    if (next.suites.length) {
      _each(next.suites, (suite, i) => {
        CleanSuite(suite)
        queue.push(suite)
      })
    }
    next = queue.shift()
  }
}

let TOTAL_TEST = 0
/**
 * Modify the suite object to add properties needed to render
 * the template and remove properties we do not need.
 *
 * @param {Object} suite
 * @api private
 */
export function CleanSuite(suite) {
  suite.id = id()

  const cleanTests = _map(suite.tests, CleanTest)
  let duration = 0

  const testCount = _countBy(suite.tests, t => {
    switch (t.state) {
      case 'passed':
        return 'pass'
        break
      case 'failed':
        return 'fail'
        break
      case 'skipped':
        return 'skip'
        break
      case 'pending':
        return 'skip'
        break
      default:
        return 'skip'
        break
    }
  })

  _each(cleanTests, test => {
    duration += test.duration
  })

  TOTAL_TEST += suite.tests ? suite.tests.length : 0

  suite.tests = cleanTests
  suite.fullFile = suite.file || ''
  suite.file = suite.file ? suite.file.replace(process.cwd(), '') : ''
  //suite.passes = passingTests
  //suite.failures = failingTests
  //suite.pending = pendingTests
  //suite.skipped = skippedTests
  suite.hasTests = suite.tests.length > 0
  suite.hasSuites = suite.suites.length > 0
  suite.meta = {
    total: suite.tests.length || 0,
    pass: testCount.pass || 0,
    fail: testCount.fail || 0,
    skip: testCount.skip || 0,
    pending: testCount.pending || 0,
    hasPass: testCount.pass > 0,
    hasFail: testCount.fail > 0,
    hasPending: testCount.pending > 0,
    hasSkipped: testCount.skip > 0,
    duration
  }
  if (suite.root) {
    suite.rootEmpty = suite.total === 0
  }

  RemoveAllPropsFromObjExcept(suite, [
    'title',
    'fullFile',
    'meta',
    'file',
    'tests',
    'suites',
    'passes',
    'failures',
    'pending',
    'skipped',
    'hasTests',
    'hasSuites',
    'total',
    'totalPasses',
    'totalFailures',
    'totalPending',
    'totalSkipped',
    'hasPasses',
    'hasFailures',
    'hasPending',
    'hasSkipped',
    'root',
    'id',
    'duration',
    'rootEmpty',
    '_timeout'
  ])
}

export function GetTotalTestsCount() {
  return TOTAL_TEST
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */
export function CleanTest(test) {
  const err = test.err
    ? _pick(test.err, ['name', 'message', 'stack'])
    : test.err

  /*  if (err && err.stack) {
    // err.stack = Highlight.fixMarkup(Highlight.highlightAuto(err.stack).value)
  }*/

  const cleaned = {
    title: test.title,
    fullTitle: test.fullTitle(),
    timedOut: test.timedOut,
    duration: test.duration || 0,
    speed: test.speed,
    //pass: test.state === 'passed',
    //fail: test.state === 'failed',
    //pending: test.pending,
    err,
    isRoot: test.parent.root
    //id: id(),
    //parentId: test.parent.id
  }

  if (test.state === 'passed') {
    cleaned.state = PASS
  } else if (test.state === 'failed') {
    cleaned.state = FAIL
  } else {
    cleaned.state = SKIP
  }
  //cleaned.skipped = (!cleaned.pass && !cleaned.fail && !cleaned.pending)

  return cleaned
}

export function getOsInfo() {
  const os = require('os')
  return {
    name: os.type(),
    hostname: os.hostname(),
    arc: os.arch(),
    version: os.release(),
    ram: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`
  }
}

export function getSDKinfo(cb) {
  return {
    name: 'Node',
    version: process.version,
    arc: process.arch,
    npmVersion: ''
  }
}
