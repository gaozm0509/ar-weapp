"use strict";
/**
 * @license
 * Copyright 2019 Victor Dibia.
 * Handtrack.js - A library for prototyping realtime hand tracking using neural networks.
 * Licensed under the MIT License (the "License");
 * Code snippets from the tensorflow coco-ssd example are reused here - https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd
 * =============================================================================
 */

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
Object.defineProperty(exports, "__esModule", { value: true });
const tf = require("@tensorflow/tfjs-converter");
const tf_core = require('@tensorflow/tfjs-core')
var basePath = "https://cdn.jsdelivr.net/npm/handtrackjs/models/web/";
var defaultParams = {
    flipHorizontal: true,
    outputStride: 16,
    imageScaleFactor: 0.7,
    maxNumBoxes: 20,
    iouThreshold: 0.5,
    scoreThreshold: 0.99,
    modelType: "ssdlitemobilenetv2"
};
function load(params) {
    return __awaiter(this, void 0, void 0, function () {
        var modelParams, objectDetection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    modelParams = Object.assign({}, defaultParams, params);
                    objectDetection = new ObjectDetection(modelParams);
                    return [4 /*yield*/, objectDetection.load()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, (objectDetection)];
            }
        });
    });
}
exports.load = load;
function startVideo(video) {
    // Video must have height and width in order to be used as input for NN
    // Aspect ratio of 3/4 is used to support safari browser.
    video.width = video.width || 640;
    video.height = video.height || video.width * (3 / 4);
    return new Promise(function (resolve, reject) {
        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    facingMode: "user"
                }
            })
            .then(function (stream) {
                window.localStream = stream;
                video.srcObject = stream;
                video.onloadedmetadata = function () {
                    video.play();
                    resolve(true);
                };
            }).catch(function (err) {
                resolve(false);
            });
    });
}
exports.startVideo = startVideo;
function stopVideo() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (window.localStream) {
                window.localStream.getTracks().forEach(function (track) {
                    track.stop();
                    return true;
                });
            }
            else {
                return [2 /*return*/, false];
            }
            return [2 /*return*/];
        });
    });
}
exports.stopVideo = stopVideo;
var ObjectDetection = /** @class */ (function () {
    function ObjectDetection(modelParams) {
        this.modelPath = basePath + modelParams.modelType + "/tensorflowjs_model.pb";
        this.weightPath = basePath + modelParams.modelType + "/weights_manifest.json";
        this.modelParams = modelParams;
    }
    ObjectDetection.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, result;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.fps = 0;
                        _a = this;
                        // return [4 /*yield*/, tf.loadFrozenModel(this.modelPath, this.weightPath)];
                        // let url = 'http://47.91.230.0:8089/model.json'
                        // let url = 'http://192.168.3.127:8080/model.json' //本机
                        let url = 'https://www.baozangxiong.com/models/handtrack/model.json'
                        return [4 /*yield*/, tf.loadGraphModel(url)];

                    case 1:
                        _a.model = _b.sent();
                        return [4 /*yield*/, this.model.executeAsync(tf_core.zeros([1, 300, 300, 3]))];
                    case 2:
                        result = _b.sent();
                        result.map(function (t) {
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, t.data()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            });
                        });
                        result.map(function (t) {
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, t.dispose()];
                                });
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ObjectDetection.prototype.detect = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var timeBegin, _a, height, width, resizedHeight, resizedWidth, batched;
            height = input.height
            width = input.width
            var _this = this;
            return __generator(this, function (_b) {
                // let temp = tf_core.tensor(new Uint8Array(input.data), [input.height, input.width, 4])
                timeBegin = Date.now();
                // _a = temp, height = _a[0], width = _a[1];
                resizedHeight = getValidResolution(this.modelParams.imageScaleFactor, height, this.modelParams.outputStride);
                resizedWidth = getValidResolution(this.modelParams.imageScaleFactor, width, this.modelParams.outputStride);
                batched = tf_core.tidy(function () {
                    const input_data = tf_core.tidy(() => {
                        const temp = tf_core.tensor(new Uint8Array(input.data), [input.height, input.width, 4]);
                        return temp.slice([0, 0, 0], [-1, -1, 3]);
                    })
                    let pixeld_data = { data: new Uint8Array(input.data), width: input.width, height: input.height }
                    let imageTensor = tf_core.browser.fromPixels(pixeld_data);
                    if (_this.modelParams.flipHorizontal) {
                        return imageTensor.reverse(1).resizeBilinear([resizedHeight, resizedWidth]).expandDims(0);
                    }
                    else {
                        return imageTensor.resizeBilinear([resizedHeight, resizedWidth]).expandDims(0);
                    }
                });
                // const result = await this.model.executeAsync(batched);
                self = this;
                return [2 /*return*/, this.model.executeAsync(batched).then(function (result) {
                    var scores = result[0].dataSync();
                    var boxes = result[1].dataSync();
                    // clean the webgl tensors
                    batched.dispose();
                    tf_core.dispose(result);
                    // console.log("scores result",scores, boxes)
                    var _a = calculateMaxScores(scores, result[0].shape[1], result[0].shape[2]), maxScores = _a[0], classes = _a[1];
                    var prevBackend = tf_core.getBackend();
                    // run post process in cpu
                    tf_core.setBackend('cpu');
                    var indexTensor = tf_core.tidy(function () {
                        var boxes2 = tf_core.tensor2d(boxes, [
                            result[1].shape[1],
                            result[1].shape[3]
                        ]);
                        return tf_core.image.nonMaxSuppression(boxes2, scores, self.modelParams.maxNumBoxes, // maxNumBoxes
                            self.modelParams.iouThreshold, // iou_threshold
                            self.modelParams.scoreThreshold // score_threshold
                        );
                    });
                    var indexes = indexTensor.dataSync();
                    indexTensor.dispose();
                    // restore previous backend
                    tf_core.setBackend(prevBackend);
                    var predictions = self.buildDetectedObjects(width, height, boxes, scores, indexes, classes);
                    var timeEnd = Date.now();
                    self.fps = Math.round(1000 / (timeEnd - timeBegin));
                    return predictions;
                })];
            });
        });
    };
    ObjectDetection.prototype.buildDetectedObjects = function (width, height, boxes, scores, indexes, classes) {
        var count = indexes.length;
        var objects = [];
        for (var i = 0; i < count; i++) {
            var bbox = [];
            for (var j = 0; j < 4; j++) {
                bbox[j] = boxes[indexes[i] * 4 + j];
            }
            var minY = bbox[0] * height;
            var minX = bbox[1] * width;
            var maxY = bbox[2] * height;
            var maxX = bbox[3] * width;
            bbox[0] = minX;
            bbox[1] = minY;
            bbox[2] = maxX - minX;
            bbox[3] = maxY - minY;
            objects.push({
                bbox: bbox,
                class: classes[indexes[i]],
                score: scores[indexes[i]]
            });
        }
        return objects;
    };
    ObjectDetection.prototype.getFPS = function () {
        return this.fps;
    };
    ObjectDetection.prototype.setModelParameters = function (params) {
        this.modelParams = Object.assign({}, this.modelParams, params);
    };
    ObjectDetection.prototype.getModelParameters = function () {
        return this.modelParams;
    };
    ObjectDetection.prototype.renderPredictions = function (predictions, canvas, context, mediasource) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save()
        if (this.modelParams.flipHorizontal) {
            context.scale(-1, 1);
            context.translate(-mediasource.width, 0);
        }
        // context.drawImage(mediasource, 0, 0, mediasource.width, mediasource.height);
        context.restore();
        for (var i = 0; i < predictions.length; i++) {
            context.beginPath();
            context.fillStyle = "yellow"
            context.strokeStyle = "yellow"

            let x = canvas.width - predictions[i].bbox[0] - predictions[i].bbox[2]
            let y = predictions[i].bbox[1]
            let w = predictions[i].bbox[2]
            let h = predictions[i].bbox[3]
            context.fillRect(x + w / 2, y + h / 2, 5, 5);
            context.moveTo(x, y);//线条开始位置
            context.lineTo(x + w, y);//线条经过点
            context.lineTo(x + w, y + h);
            context.lineTo(x, y + h);
            
            context.closePath();//结束绘制线条，不是必须的
            context.stroke()
            context.draw(false)
        }
        // canvas.width = mediasource.width;
        // canvas.height = mediasource.height;
        // // console.log("render", mediasource.width, mediasource.height)
        // context.save();
        // if (this.modelParams.flipHorizontal) {
        //     context.scale(-1, 1);
        //     context.translate(-mediasource.width, 0);
        // }
        // // context.drawImage(mediasource, 0, 0, mediasource.width, mediasource.height);
        // context.restore();
        // context.font = '10px Arial';
        // // console.log('number of detections: ', predictions.length);
        // for (var i = 0; i < predictions.length; i++) {
        //     context.beginPath();
        //     context.fillStyle = "#BA4241";
        //     context.fillRect(predictions[i].bbox[0], predictions[i].bbox[1] - 17, predictions[i].bbox[2], 17);
        //     // context.rect.apply(context, predictions[i].bbox);
        //     // draw a dot at the center of bounding box
        //     context.lineWidth = 1;
        //     context.strokeStyle = '#0063FF';
        //     context.fillStyle = "#0063FF"; // "rgba(244,247,251,1)";
        //     context.fillRect(predictions[i].bbox[0] + (predictions[i].bbox[2] / 2), predictions[i].bbox[1] + (predictions[i].bbox[3] / 2), 5, 5);
        //     context.stroke();
        //     context.fillText(predictions[i].score.toFixed(3) + ' ' + " | hand", predictions[i].bbox[0] + 5, predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 10);
        // }
        // // Write FPS to top left
        // context.font = "bold 12px Arial";
        // context.fillText("[FPS]: " + this.fps, 10, 20);
        // context.stroke()
        // context.fill()
        // context.draw()
    };
    ObjectDetection.prototype.dispose = function () {
        if (this.model) {
            this.model.dispose();
        }
    };
    return ObjectDetection;
}());
exports.ObjectDetection = ObjectDetection;
function getValidResolution(imageScaleFactor, inputDimension, outputStride) {
    var evenResolution = inputDimension * imageScaleFactor - 1;
    return evenResolution - (evenResolution % outputStride) + 1;
}
function getInputTensorDimensions(input) {
    // let temp = tf_core.tensor(new Uint8Array(input.data), [input.height, input.width, 4])
    // return temp
    return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] : [input.height, input.width];
}
function calculateMaxScores(scores, numBoxes, numClasses) {
    var maxes = [];
    var classes = [];
    for (var i = 0; i < numBoxes; i++) {
        var max = Number.MIN_VALUE;
        var index = -1;
        for (var j = 0; j < numClasses; j++) {
            if (scores[i * numClasses + j] > max) {
                max = scores[i * numClasses + j];
                index = j;
            }
        }
        maxes[i] = max;
        classes[i] = index;
    }
    // console.log([maxes, classes])
    return [maxes, classes];
}
//# sourceMappingURL=handtrack.js.map