'use strict';

const path = require('path');
const htmlmin = require('html-minifier');
const loaderUtils = require('loader-utils');

module.exports = function(content) {
    const webpackRemainingChain = loaderUtils.getRemainingRequest(this).split('!');
    const filename = webpackRemainingChain[webpackRemainingChain.length - 1];

    const query = loaderUtils.parseQuery(this.query);
    const options = Object.assign({ root: process.cwd() }, query);

    const root = path.resolve(options.root);
    const templateUrl = filename.replace(root + path.sep, '');
    const minnedTemplate = htmlmin.minify(content, options.htmlmin);

    this.cacheable();

    return `
        export default '${ templateUrl }';
        angular.module('ng').run(['$templateCache', function($templateCache) {
            $templateCache.put('${ templateUrl }', ${ JSON.stringify(minnedTemplate) });
        }]);
    `;
};
