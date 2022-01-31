## @lethean/sdp-angular@1.2.2

### Building

To install the required dependencies and to build the typescript sources run:
```
npm install
npm run build
```

### publishing

First build the package then run ```npm publish dist``` (don't forget to specify the `dist` folder!)

### consuming

Navigate to the folder of your consuming project and run one of next commands.

_published:_

```
npm install @lethean/sdp-angular@1.2.2 --save
```

_without publishing (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE/dist.tgz --save
```

_It's important to take the tgz file, otherwise you'll get trouble with links on windows_

_using `npm link`:_

In PATH_TO_GENERATED_PACKAGE/dist:
```
npm link
```

In your project:
```
npm link @lethean/sdp-angular
```

__Note for Windows users:__ The Angular CLI has troubles to use linked npm packages.
Please refer to this issue https://github.com/angular/angular-cli/issues/8284 for a solution / workaround.
Published packages are not effected by this issue.


#### General usage

In your Angular project:


```
// without configuring providers
import { letheanSDPApiModule } from '@lethean/sdp-angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        letheanSDPApiModule,
        // make sure to import the HttpClientModule in the AppModule only,
        // see https://github.com/angular/angular/issues/20575
        HttpClientModule
    ],
    declarations: [ AppComponent ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
```

```
// configuring providers
import { letheanSDPApiModule, letheanSDPConfiguration, letheanSDPConfigurationParameters } from '@lethean/sdp-angular';

export function apiConfigFactory (): letheanSDPConfiguration {
  const params: letheanSDPConfigurationParameters = {
    // set configuration parameters here.
  }
  return new letheanSDPConfiguration(params);
}

@NgModule({
    imports: [ letheanSDPApiModule.forRoot(apiConfigFactory) ],
    declarations: [ AppComponent ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
```

```
// configuring providers with an authentication service that manages your access tokens
import { letheanSDPApiModule, letheanSDPConfiguration } from '@lethean/sdp-angular';

@NgModule({
    imports: [ letheanSDPApiModule ],
    declarations: [ AppComponent ],
    providers: [
      {
        provide: letheanSDPConfiguration,
        useFactory: (authService: AuthService) => new letheanSDPConfiguration(
          {
            basePath: environment.apiUrl,
            accessToken: authService.getAccessToken.bind(authService)
          }
        ),
        deps: [AuthService],
        multi: false
      }
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
```

```
import { DefaultApi } from '@lethean/sdp-angular';

export class AppComponent {
    constructor(private apiGateway: DefaultApi) { }
}
```

Note: The letheanSDPApiModule is restricted to being instantiated once app wide.
This is to ensure that all services are treated as singletons.

#### Using multiple OpenAPI files / APIs / letheanSDPApiModules
In order to use multiple `letheanSDPApiModules` generated from different OpenAPI files,
you can create an alias name when importing the modules
in order to avoid naming conflicts:
```
import { letheanSDPApiModule } from 'my-api-path';
import { letheanSDPApiModule as OtherApiModule } from 'my-other-api-path';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    letheanSDPApiModule,
    OtherApiModule,
    // make sure to import the HttpClientModule in the AppModule only,
    // see https://github.com/angular/angular/issues/20575
    HttpClientModule
  ]
})
export class AppModule {

}
```


### Set service base path
If different than the generated base path, during app bootstrap, you can provide the base path to your service.

```
import { BASE_PATH } from '@lethean/sdp-angular';

bootstrap(AppComponent, [
    { provide: BASE_PATH, useValue: 'https://your-web-service.com' },
]);
```
or

```
import { BASE_PATH } from '@lethean/sdp-angular';

@NgModule({
    imports: [],
    declarations: [ AppComponent ],
    providers: [ provide: BASE_PATH, useValue: 'https://your-web-service.com' ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
```


#### Using @angular/cli
First extend your `src/environments/*.ts` files by adding the corresponding base path:

```
export const environment = {
  production: false,
  API_BASE_PATH: 'http://127.0.0.1:8080'
};
```

In the src/app/app.module.ts:
```
import { BASE_PATH } from '@lethean/sdp-angular';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ ],
  providers: [{ provide: BASE_PATH, useValue: environment.API_BASE_PATH }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```
