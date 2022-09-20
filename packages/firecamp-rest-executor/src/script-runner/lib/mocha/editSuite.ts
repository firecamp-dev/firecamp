import * as Utils from './mochaService'

/**
 * Modify the existing suite as per requirement
 * @param data
 * @returns {{suites: *, build: *}}
 */
const editSuite = async (data) => {
  try {
    const allSuites = data.suite;
    Utils.TraverseSuites(allSuites);

    const obj = {
      reportTitle: 'VigoReport',
      stats: data.stats,
      suites: allSuites,
      //allTests: allTests.map(Utils.CleanTest),
      //allPending: allPending,
      //allPasses: allPasses.map(Utils.CleanTest),
      //allFailures: allFailures.map(Utils.CleanTest),
      copyrightYear: new Date().getFullYear(),
    };

    obj.stats.total = Utils.GetTotalTestsCount();
    obj.stats.pass = obj.stats.passes;
    obj.stats.fail = obj.stats.failures;
    obj.stats.finish = obj.stats.end;

    const passPercentage =
      Math.round(
        (obj.stats.pass / (obj.stats.total - obj.stats.pending)) * 1000
      ) / 10;
    const pendingPercentage =
      Math.round((obj.stats.pending / obj.stats.total) * 1000) / 10;

    obj.stats.passPer = passPercentage;
    obj.stats.pendingPer = pendingPercentage;
    obj.stats.other =
      obj.stats.pass + obj.stats.fail + obj.stats.pending - obj.stats.tests;
    //obj.stats.hasOther = obj.stats.other > 0
    obj.stats.skip = obj.stats.total - obj.stats.tests;
    //obj.stats.skipPer = Math.round((obj.stats.skip / obj.stats.total) * 1000) / 10
    //obj.stats.hasSkipped = obj.stats.skip > 0
    obj.stats.fail = obj.stats.fail - obj.stats.other;
    obj.stats.failPer =
      Math.round((obj.stats.fail / obj.stats.total) * 1000) / 10;
    //obj.stats.passPercentClass = _getPercentClass(passPercentage)
    //obj.stats.pendingPercentClass = _getPercentClass(pendingPercentage)

    // pending is added in skip
    obj.stats.skip = (obj.stats.skip || 0) + (obj.stats.pending || 0);
    obj.stats.skipPer =
      Math.round((obj.stats.skip / obj.stats.total) * 1000) / 10;

    delete obj.stats.passes;
    delete obj.stats.failures;
    delete obj.stats.end;

    Utils.ApplyChildMetaHierarchy(obj.suites);

    return Promise.resolve({
      build: Object.assign(obj.stats, {
        tz: new Date().getTimezoneOffset() * -1,
      }),
      suites: obj.suites,
    });
  } catch (error) {
    console.error({
      API: 'editSuite',
      error,
    });

    return Promise.reject(error);
  }
};

export default editSuite;
