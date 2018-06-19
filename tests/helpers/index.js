const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

global.sinon = sinon;
global.expect = chai.expect;
global.assert = chai.assert;
