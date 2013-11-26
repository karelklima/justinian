import 'package:angular/angular.dart';

@NgController(
    selector: '[main]',
    publishAs: 'controller')
class MainController
{
  
}
class MyAppModule extends Module {
  MyAppModule() {
    type(MainController);
  }
}

main(){
  ngBootstrap(module: new MyAppModule());
}
