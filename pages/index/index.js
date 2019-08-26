"use strict";
//index.js
//获取应用实例
// import handTrack from '../../utils/handTrack';
const handTrack = require('../../utils/handTrack')
const app = getApp()

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};


var CANVAS_ID = 'image';


Page({
  data: { result: '' },
  handTrackModel: undefined,
  canvas: undefined,
  poses: undefined,
  ctx: undefined,
  canvasW: 288,
  canvasH: 352,
  testImage: undefined,

  posenet: function () {
    var _this = this
    if (this.handTrackModel == null) {
      this.setData({ result: 'loading model...' });
      let modelParams = {
        flipHorizontal: true,   // flip e.g for video  
        maxNumBoxes: 20,        // maximum number of boxes to detect
        iouThreshold: 0.5,      // ioU threshold for non-max suppression
        scoreThreshold: 0.6,    // confidence threshold for predictions.
      }
      handTrack.load(modelParams).then(lmodel => {
        // detect objects in the image.
        _this.handTrackModel = lmodel
        _this.setData({ result: 'model loaded.' });
      });
    }
    // 初始化
    // var _this = this;
    // if (this.posenetModel == null) {
    //     this.setData({ result: 'loading posenet model...' });
    //     posenet
    //         .load({
    //         architecture: 'MobileNetV1',
    //         outputStride: 16,
    //         inputResolution: 193,
    //         multiplier: 0.5,
    //         modelUrl: POSENET_URL
    //     })
    //         .then(function (model) {
    //         _this.posenetModel = model;
    //         _this.setData({ result: 'model loaded.' });
    //     });
    // }
  },
  executePosenet: function (frame) {
    var _this = this;
    if (this.handTrackModel) {
      this.handTrackModel.detect(frame).then(predictions => {
        console.log("Predictions: ", predictions);
        let canvas_prop = { width: _this.canvasW, height: _this.canvasH }
        this.handTrackModel.renderPredictions(predictions, canvas_prop, _this.ctx, frame);
      });

    }
    // if (this.posenetModel) {
    //     var start_1 = Date.now();
    //     posenet_1.detectPoseInRealTime(frame, this.posenetModel, false)
    //         .then(function (poses) {
    //         _this.poses = poses;
    //         posenet_1.drawPoses(_this);
    //         var result = Date.now() - start_1 + "ms";
    //         _this.setData({ result: result });
    //     })
    //         .catch(function (err) {
    //         console.log(err, err.stack);
    //     });
    // }
  },
  onReady: function () {
    // return
    return __awaiter(this, void 0, void 0, function () {
      var context, count, listener;
      var _this = this;
      return __generator(this, function (_a) {
        console.log('create canvas context for #image...');
        setTimeout(function () {
          _this.ctx = wx.createCanvasContext(CANVAS_ID);
        }, 500);
        _this.posenet();
        context = wx.createCameraContext(this);
        count = 0;
        listener = context.onCameraFrame(function (frame) {
          count++;
          if (count === 3) {
            _this.executePosenet(frame);
            //持续输出frme
            count = 0;
          }
        });
        listener.start();
        return [2 /*return*/];
      });
    });
  },
  onUnload: function () {
    if (this.posenetModel) {
      this.posenetModel.dispose();
    }
  }
});


