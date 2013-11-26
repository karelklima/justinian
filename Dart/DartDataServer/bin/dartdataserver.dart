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

class SecurityDocument extends Object with Serializable
{
  num id;
  String version;
  String name;
  String info;
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
}
