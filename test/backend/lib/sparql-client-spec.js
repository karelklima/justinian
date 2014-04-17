var SparqlClient = require('../../../backend/lib/sparql-client');

describe("SparqlClient", function() {

    var sparqlClient = new SparqlClient();

    it('should get and set params', function() {
        sparqlClient.setParam.bind(sparqlClient, "param1", "value1").should.not.throwError();
        sparqlClient.getParam.bind(sparqlClient, "param1").should.not.throwError();
        sparqlClient.getParam.bind(sparqlClient, undefined).should.throwError();
        sparqlClient.getParam.bind(sparqlClient, "undefined").should.throwError();
        sparqlClient.setParam.bind(sparqlClient, undefined, "value1").should.throwError();
        sparqlClient.setParam.bind(sparqlClient, "param1", undefined).should.throwError();
        sparqlClient.setParam.bind(sparqlClient, undefined, undefined).should.throwError();
        sparqlClient.setParam.bind(sparqlClient, "param1", "value1").should.not.throwError();
        sparqlClient.getParam.bind(sparqlClient, "param1").should.not.throwError();
    });

    // TODO SparqlClient.prototype.sendRequest
});