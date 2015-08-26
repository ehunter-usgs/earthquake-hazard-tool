'use strict';

var HazardCurve = require('HazardCurve'),
    HazardUtil = require('HazardUtil'),

    Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    Util = require('util/Util');


var _PERIOD_TO_NUMBER = {
  'PGA': 0.0,
  'PGV': 0.0,
  'SA0P1': 0.1,
  'SA0P2': 0.2,
  'SA0P3': 0.3,
  'SA0P5': 0.5,
  'SA0P75': 0.75,
  'SA1P0': 1.0,
  'SA2P0': 2.0,
  'SA3P0': 3.0,
  'SA4P0': 4.0,
  'SA5P0': 5.0
};

var HazardResponse = function (params) {
  var _this,
      _initialize,

      _createCurve,
      _spatiallyInterpolate;


  _this = Model();

  _initialize = function (params) {
    var attributes;

    attributes = {
      'xlabel': '',
      'ylabel': '',
      'curves': []
    };

    params = params || [];

    params.map(function (response) {
      attributes.xlabel = response.metadata.xlabel;
      attributes.ylabel = response.metadata.ylabel;

      attributes.curves.push(_createCurve(response));
    });

    attributes.curves = Collection(attributes.curves);


    _this.set(attributes);
  };


  _createCurve = function (response) {
    var data,
        metadata,
        yvalues;

    data = response.data;
    metadata = response.metadata;

    yvalues = _spatiallyInterpolate(metadata.latitude, metadata.longitude, data);

    return HazardCurve({
      label: metadata.imt.display,
      period: _PERIOD_TO_NUMBER[metadata.imt.value],
      data: HazardUtil.coallesce(metadata.xvalues, yvalues)
    });
  };

  _spatiallyInterpolate = function (latitude, longitude, data) {
    var bottom,
        numYValues,
        result,
        top,
        y0,
        y1,
        y2,
        y3;

    result = [];
    numYValues = data.length;

    if (numYValues === 1) {
      result = data[0].yvalues;
    } else if (numYValues === 2) {
      y0 = data[0];
      y1 = data[1];

      if (y0.latitude === y1.latitude) {
        // Latitudes match, interpolate with respect to longitude
        result = HazardUtil.interpolateCurve(y0.longitude, y0.yvalues,
            y1.longitude, y1.yvalues, longitude);
      } else if (y0.longitude === y1.longitude) {
        // Latitudes match, interpolate with respect to latitude
        result = HazardUtil.interpolateCurve(y0.latitude, y0.yvalues,
            y1.latitude, y1.yvalues, latitude);
      }
    } else if (numYValues === 4) {
      y0 = data[0];
      y1 = data[1];
      y2 = data[2];
      y3 = data[3];

      // Interpolate top (first) two points with respect to longitude
      top = HazardUtil.interpolateCurve(y0.longitude, y0.yvalues,
          y1.longitude, y1.yvalues, longitude);

      // Interpolate bottom (second) two points with respect to longitude
      bottom = HazardUtil.interpolateCurve(y2.longitude, y2.yvalues,
          y3.longitude, y3.yvalues, longitude);

      // Interpolate top/bottom (interpolated) results with respect to latitude
      result = HazardUtil.interpolateCurve(y0.latitude, top,
          y2.latitude, bottom, latitude);
    }

    return result;
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _createCurve = null;
    _spatiallyInterpolate = null;

    _initialize = null;
    _this = null;
  });


  _initialize(params);
  params = null;
  return _this;
};

module.exports = HazardResponse;
