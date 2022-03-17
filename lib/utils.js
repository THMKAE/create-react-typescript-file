"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFile = exports.createDirectory = exports.pathResolver = exports.doesPathExist = exports.log = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
exports.log = {
    e: function (message, exit) {
        console.error(message);
        if (exit)
            process.exit(0);
    },
    i: function (message) { return console.info(message); },
};
var doesPathExist = function (dir) {
    return fs_1.default.existsSync(dir);
};
exports.doesPathExist = doesPathExist;
var pathResolver = function () {
    var dirArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        dirArgs[_i] = arguments[_i];
    }
    return path_1.default.resolve.apply(path_1.default, dirArgs);
};
exports.pathResolver = pathResolver;
var createDirectory = function (directory) {
    fs_1.default.mkdirSync(directory);
    exports.log.i("\u2705 Created directory at \"".concat(directory, "\""));
};
exports.createDirectory = createDirectory;
var createFile = function (path, content, name) {
    fs_1.default.writeFileSync(path, content);
    exports.log.i("\u2705 Created \"".concat(name, "\" file"));
};
exports.createFile = createFile;
