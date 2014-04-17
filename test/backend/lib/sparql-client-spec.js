var SparqlClient = require('../../../backend/lib/sparql-client');

describe("SparqlClient", function() {

    var sparqlClient = new SparqlClient();

    it('should get and set params', function() {
        sparqlClient.getParam.bind(null, undefined).should.throwError();
        sparqlClient.getParam.bind(null, "undefined").should.throwError();
        sparqlClient.setParam.bind(null, undefined, "value1").should.throwError();
        sparqlClient.setParam.bind(null, "param1", undefined).should.throwError();
        sparqlClient.setParam.bind(null, undefined, undefined).should.throwError();
        sparqlClient.setParam.bind(null, "param1", "value1").should.not.throwError();
        sparqlClient.getParam.bind(null, "param1").should.not.throwError();
    });

    // TODO SparqlClient.prototype.sendRequest
});