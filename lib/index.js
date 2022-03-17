#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var inquirer_1 = __importDefault(require("inquirer"));
// @ts-ignore
var package_json_1 = require("../package.json");
var config_1 = require("./config");
var inquiries_1 = require("./inquiries");
var program = new commander_1.Command();
program
    .version(package_json_1.version)
    .description('Create a React TypeScript file')
    .action(function () {
    inquirer_1.default.prompt(config_1.entryQuestions).then(function (answers) {
        var action = answers.action;
        if (action === config_1.TypeOfAction.SETUP) {
            (0, inquiries_1.setupInquiry)();
        }
        if (action === config_1.TypeOfAction.INIT) {
            (0, inquiries_1.initInquiry)();
        }
        if (action === config_1.TypeOfAction.CREATE) {
            (0, inquiries_1.createInquiry)();
        }
    });
});
program.parse();
