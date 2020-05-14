var fs = require("fs");
var path = require("path");
var tools = require("name-styles");

var VA = (function () {
  function formatPath(dirname) {
    dirname = dirname.replace(/\\/g, "/");
    if (dirname.charAt(0) === "/") {
      dirname = dirname.slice(1);
    }
    return dirname;
  }

  function mkdirSync(dirname, callback) {
    const exists = fs.existsSync(dirname);
    if (exists) {
      callback();
    } else {
      mkdirSync(path.dirname(dirname), function () {
        fs.mkdir(dirname, callback);
      });
    }
  }

  // 模板
  var dbModelTemplate = function (className, fileName, varName) {
    return `export class ${className}Model {
}
`;
  };
  var dbServiceTemplate = function (className, fileName, varName) {
    return `export class ${className}DbService {
  constructor() {
  }
}
`;
  };

  var businessServiceTemplate = function (className, fileName, varName) {
    return `export class ${className}Service {
  constructor() {
  }
}
`;
  };

  var dtoTemplate = function (className, fileName, varName) {
    return `export class ${className}RequestDto {
public todo: number = undefined;
}
`;
  };

  var controllerTemplate = function (className, fileName, varName) {
    return `import { ${className}RequestDto } from '../request-dto/${fileName}.request-dto';
import { ${className}Service } from '../services/${fileName}.service';

export class ${className}Controller {
  constructor(private ${varName}Service: ${className}Service) {
  }
}
`;
  };

  var serviceTemplate = function (className, fileName, varName) {
    return `import { Observable, Observer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnvUtil } from 'src/environments/environment.util';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ${className}Store } from '../states/${fileName}.store';
import { ${className}Entity } from '../states/${fileName}.model';

/**
 * ${className}Service
 *
 * @export
 * @class ${className}Service
 */
@Injectable({
  providedIn: 'root'
})
export class ${className}Service implements OnDestroy {
  /**
   *Creates an instance of ${className}Service.
    * @param {HttpClient} http
    * @param {LocalStorageService} store
    * @memberof ${className}Service
    */
  constructor(
    private http: HttpClient,
    private ${varName}Store: ${className}Store
  ) {
  }

  /**
   * ngOnDestroy
   *
   * @memberof ${className}Service
   */
  public ngOnDestroy(): void {}
}
`;
  };

  var componentTemplate = function (className, fileName, varName) {
    return `import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


/**
 * ${className}Component
 *
 * @export
 * @class ${className}Component
 * @extends {BasePage}
 * @implements {OnInit}
 */
@Component({
  selector: 'app-${fileName}',
  templateUrl: './${fileName}.component.html',
  styleUrls: ['./${fileName}.component.scss']
})
export class ${className}Component implements OnInit, OnDestroy {
  /**
   * Creates an instance of ${className}Component.
   * @param {Injector} injector
   * @memberof ${className}Component
   */
  constructor(
    public injector: Injector,
    private routerinfo: ActivatedRoute,
    private translate: TranslateService,
    private router: Router
  ) {
    super(injector);
  }

  /**
   * angular life cycle
   *
   * @memberof ${className}Component
   */
  public ngOnInit(): void {
    
  }

  /**
   * angular life cycle
   *
   * @memberof ${className}Component
   */
  public ngOnDestroy(): void {}
}
`;
  };

  var modelTemplate = function (className, fileName, varName) {
    return `/**
* ${className}Entity
*
* @exportA
* @interface ${className}Entity
*/
export interface ${className}Entity {

}
`;
  };

  var storeTemplate = function (className, fileName, varName) {
    return `import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { ${className}Entity } from './${fileName}.model';

/**
 * initialState
 *
 */
export function initialState(): ${className}Entity {
  return {};
}

/**
 * ${className}Store
 *
 * @export
 * @class ${className}Store
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({
name: '${varName}',
  resettable: true
})
export class ${className}Store extends Store<${className}Entity> {
  constructor() {
    super(initialState());
  }
}
`;
  };
  var queryTemplate = function (className, fileName, varName) {
    return `import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ${className}Entity } from '../states/${fileName}.model';
import { ${className}Store } from '../states/${fileName}.store';

/**
 * ${className}Query
 *
 * @export
 * @class ${className}Query
 * @extends {Query<${className}Entity>}
 */
@Injectable({ providedIn: 'root' })
export class ${className}Query extends Query<${className}Entity> {
  public readonly loading$ = this.selectLoading();
  constructor(protected store: ${className}Store) {
    super(store);
  }
}  
`;
  };

  return {
    generate: function (command, targetPath, name, createForder) {
      try {
        var fileName = tools.hyphen(name);
        var varName = tools.camel(name);
        var className = tools.pascal(name);
        if (createForder) {
          targetPath = path.join(targetPath, fileName);
        }
        switch (command) {
          case "db-model":
            var modelPath = formatPath(path.join(targetPath));
            mkdirSync(modelPath, () => {
              fs.writeFileSync(
                path.join(modelPath, fileName + ".model.ts"),
                dbModelTemplate(className, fileName, varName)
              );
            });
            break;
          case "db-service":
            var dbServicePath = formatPath(path.join(targetPath));
            mkdirSync(dbServicePath, () => {
              fs.writeFileSync(
                path.join(dbServicePath, fileName + "-db.service.ts"),
                dbServiceTemplate(className, fileName, varName)
              );
            });
            break;
          case "service":
            var businessServicePath = formatPath(path.join(targetPath));
            mkdirSync(businessServicePath, () => {
              fs.writeFileSync(
                path.join(businessServicePath, fileName + ".service.ts"),
                businessServiceTemplate(className, fileName, varName)
              );
            });
            break;
          case "dto":
            var dtoPath = formatPath(path.join(targetPath));
            mkdirSync(dtoPath, () => {
              fs.writeFileSync(
                path.join(dtoPath, fileName + ".request-dto.ts"),
                dtoTemplate(className, fileName, varName)
              );
            });
            break;
          case "controller":
            var controllerPath = formatPath(path.join(targetPath));
            mkdirSync(controllerPath, () => {
              fs.writeFileSync(
                path.join(controllerPath, fileName + ".controller.ts"),
                controllerTemplate(className, fileName, varName)
              );
            });
            break;
          case "component":
            var pagePath = formatPath(path.join(targetPath));
            mkdirSync(pagePath, () => {
              fs.writeFileSync(
                path.join(pagePath, fileName + ".component.ts"),
                componentTemplate(className, fileName, varName)
              );
            });
            break;
          case "akita":
            var modelPath = formatPath(path.join(targetPath, "states"));
            var storePath = formatPath(path.join(targetPath, "states"));
            var queryPath = formatPath(path.join(targetPath, "queries"));
            var servicePath = formatPath(path.join(targetPath, "services"));

            mkdirSync(modelPath, () => {
              fs.writeFileSync(
                path.join(modelPath, fileName + ".model.ts"),
                modelTemplate(className)
              );
            });

            mkdirSync(storePath, () => {
              fs.writeFileSync(
                path.join(storePath, fileName + ".store.ts"),
                storeTemplate(className, fileName, varName)
              );
            });

            mkdirSync(queryPath, () => {
              fs.writeFileSync(
                path.join(queryPath, fileName + ".query.ts"),
                queryTemplate(className, fileName, varName)
              );
            });

            mkdirSync(servicePath, () => {
              fs.writeFileSync(
                path.join(servicePath, fileName + ".service.ts"),
                serviceTemplate(className, fileName, varName)
              );
            });
            break;
          default:
            break;
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
  };
})();

module.exports = VA;
