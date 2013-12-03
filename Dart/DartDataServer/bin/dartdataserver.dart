import 'dart:io';
import 'dart:convert';
import 'dart:mirrors';


abstract class Serializable {

  Map toJson() {
    Map map = new Map();
    InstanceMirror im = reflect(this);
    ClassMirror cm = im.type;
    var decls = cm.declarations.values.where((dm) => dm is VariableMirror);
    decls.forEach((dm) {
      var key = MirrorSystem.getName(dm.simpleName);
      var val = im.getField(dm.simpleName).reflectee;
      map[key] = val;
    });


    return map;
  }


}

class SecurityDocument extends Object with Serializable {
  num id;

  String version;

  String name;

  String info;
}

class DatabaseServer extends Object {
  String host = '127.0.0.1';
  int port = 7085;

  String sparqlHost = 'http://internal.opendata.cz:8895/sparql';
  Map sparqlMap = new Map();

  DatabaseServer() {
    // sparql.json obsahuje SPARQL dotazy
    /*File sparqlDb = new File("sparql.json");
    String content = sparqlDb.readAsStringSync(encoding: UTF8);
    queryMap = JSON.decode(content);*/

    print("Loading SPARQL queries");
    LoadSparqlQueries();

    print("Starting database service");
    HttpServer.bind(host, port).then((server) {
      server.listen((HttpRequest request) {

        if (request.uri.path.isEmpty) {
          request.response.statusCode = 404;
          request.response.write("Query not found");
          request.response.close();
          return;
        }


        // ostraneni pocatecniho lomitka "/"
        String key = request.uri.path.substring(1);
        //print(key);
        if (!sparqlMap.containsKey(key)) {
          request.response.statusCode = 404;
          request.response.write("Query not found");
          request.response.close();
          return;
        }

        String sparqlQuery = sparqlMap[key];

        // nahrazeni napr. "abc" za "_query_", pokud je v URL "?query=abc"
        request.uri.queryParameters.forEach((key, value) {
          sparqlQuery = sparqlQuery.replaceAll("_" + key + "_", value);
        });

        Map<String, String> queryParams = new Map();
        queryParams['format'] = 'application/sparql-results+json';
        queryParams['timeout'] = '0';
        queryParams['debug'] = 'on';
        queryParams['query'] = sparqlQuery;

        Uri virtuoso = Uri.parse(sparqlHost);

        Uri uri = new Uri(
            scheme: virtuoso.scheme,
            host: virtuoso.host,
            port: virtuoso.port,
            path: virtuoso.path,
            queryParameters: queryParams);

        //print(uri);

        request.response.statusCode = 200;
        request.response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
        request.response.headers.add("Access-Control-Allow-Origin", "*");
        request.response.headers.add('Access-Control-Allow-Headers', '*');

        print('Data provider: ' + key);
        print('Virtuoso URL: ' + uri.toString());

        // Klient pro dotazovani DB serveru
        HttpClient client = new HttpClient();
        client.getUrl(uri).then((HttpClientRequest req) {
          return req.close();
        }).then((HttpClientResponse response) {
          response.listen((data) {
            // data se preposilaji uzivateli hned
            request.response.add(data);
          }, onDone: () {
            request.response.close();
          }, onError: (e) {
            print('error: $e');
          });
          //request.pipe(response);
        });


      });
    });
  }

  void LoadSparqlQueries() {
    Directory dir = new Directory("sparql");
    dir.listSync(recursive: false, followLinks: false).forEach((FileSystemEntity ent) {
      if (ent.path.endsWith(".sparql")) {
        File file = new File(ent.path);
        int pathLength = ent.path.length;
        int pref = "/sparql".length;
        int ext = ".sparql".length;
        String key = ent.path.substring(pref, pathLength - ext);
        print('Adding data provider: ' + key);
        sparqlMap[key] = file.readAsStringSync(encoding: UTF8);
      }
    });
  }
}

void main() {
  print("Hello, World!");

  var data = [];
  var doc = new SecurityDocument();
  doc.id = 1234;
  doc.name = "Security document #123";
  doc.version = "1.2.3";
  doc.info = "Additional info for document #123";
  data.add(doc);
  doc = new SecurityDocument();
  doc.id = 4321;
  doc.name = "Security document #124";
  doc.version = "1.0.0";
  doc.info = "Additional info";
  data.add(doc);

  var server = HttpServer.bind('127.0.0.1', 7080).then((server) {
    server.listen((HttpRequest request) {
      request.response.statusCode = 200;
      request.response.write(JSON.encode(data));
      request.response.close();
    });
  });

  DatabaseServer dbserver = new DatabaseServer();
}
