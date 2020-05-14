#!/usr/bin/env node

var ArgumentParser = require("argparse").ArgumentParser;
var inquirer = require("inquirer");
var fs = require("fs");
var path = require("path");
var tools =  require("name-styles");
var va = require("./index.js");

// 命令行参数

var parser = new ArgumentParser({
  version: require("./package.json").version,
  addHelp: true,
  description: "自动生成项目文件工具",
});

var subparsers = parser.addSubparsers();

var akitaParser = subparsers.addParser("akita", {
  description: "生成 akita 使用的 state 和 query 文件",
  help: "生成 akita 使用的 state 和 query 文件",
  addHelp: true,
});

akitaParser.addArgument(["-n", "--name"], {
  help: "设置一个模块名，如：userInfo，会自动补全相关文件名和变量名",
  type: "string",
  required: true,
});

var componentParser = subparsers.addParser("component", {
  description: "生成 component.ts 文件",
  help: "生成 component.ts 文件",
  addHelp: true,
});

componentParser.addArgument(["-n", "--name"], {
  help: "设置一个模块名，如：userInfo，会自动补全相关文件名和变量名",
  type: "string",
  required: true,
});

var controllerParser = subparsers.addParser("controller", {
  description: "生成 controller 文件",
  help: "生成 controller 文件",
  addHelp: true,
});

controllerParser.addArgument(["-n", "--name"], {
  help: "设置一个模块名，如：userInfo，会自动补全相关文件名和变量名",
  type: "string",
  required: true,
});

var dtoParser = subparsers.addParser("dto", {
  description: "生成 dto 文件",
  help: "生成 dto 文件",
  addHelp: true,
});

dtoParser.addArgument(["-n", "--name"], {
  help: "设置一个模块名，如：userInfo，会自动补全相关文件名和变量名",
  type: "string",
  required: true,
});

var serviceParser = subparsers.addParser("service", {
  description: "生成 service 文件",
  help: "生成 service 文件",
  addHelp: true,
});

serviceParser.addArgument(["-n", "--name"], {
  help: "设置一个模块名，如：userInfo，会自动补全相关文件名和变量名",
  type: "string",
  required: true,
});

var dbServiceParser = subparsers.addParser("dbservice", {
  description: "生成 dbservice 文件",
  help: "生成 dbservice 文件",
  addHelp: true,
});

dbServiceParser.addArgument(["-n", "--name"], {
  help: "设置一个模块名，如：userInfo，会自动补全相关文件名和变量名",
  type: "string",
  required: true,
});

var dbmodelParser = subparsers.addParser("dbmodel", {
  description: "生成 dbmodel 文件",
  help: "生成 dbmodel 文件",
  addHelp: true,
});

dbmodelParser.addArgument(["-n", "--name"], {
  help: "设置一个模块名，如：userInfo，会自动补全相关文件名和变量名",
  type: "string",
  required: true,
});

var moduleParser = subparsers.addParser("module", {
  description: "生成 component.ts 和 akita 文件",
  help: "生成 component.ts 和 akita 文件",
  addHelp: true,
});

moduleParser.addArgument(["-n", "--name"], {
  help: "设置一个模块名，如：userInfo，会自动补全相关文件名和变量名",
  type: "string",
  required: true,
});

var dbmodelParser = subparsers.addParser("function", {
  description: "生成 controller、service、deservvice、dbmodel、dto 文件",
  help: "生成 dbmodel 文件",
  addHelp: true,
});

dbmodelParser.addArgument(["-n", "--name"], {
  help: "设置一个模块名，如：userInfo，会自动补全相关文件名和变量名",
  type: "string",
  required: true,
});

var name;
var args = parser.parseArgs();
var command = process.argv[2];

// 逻辑

if (args.name !== null) {
  name = args.name;
} else {
  inquirer
    .prompt([
      {
        type: "input",
        message: "设置一个模块名:",
        name: "name",
        require: true,
      },
    ])
    .then((answers) => {
      name = answers.name;
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    });
}

switch(command) {
  case 'akita':
  case 'component':
  case 'controller':
  case 'dto':
  case 'service':
    va.generate(command, process.cwd(), name);
    break;
  case 'dbservice':
    va.generate('db-service', process.cwd(), name);
    break;
  case 'dbmodel':
    va.generate('db-model', process.cwd(), name);
    break;
  case 'module':
    va.generate('akita', process.cwd(), name);
    va.generate('component', path.join(process.cwd(), 'pages'), name);
    break;
  case 'function':
    va.generate('controller',path.join(process.cwd(), 'api'), name);
    va.generate('dto', path.join(process.cwd(), 'request-dto'), name);
    va.generate('service', path.join(process.cwd(), 'services'), name);
    va.generate('db-service', path.join(process.cwd(), 'services', 'db-service'), name);
    va.generate('db-model', path.join(process.cwd(), 'models'), name);
    break;
  default:
    break; 
}


