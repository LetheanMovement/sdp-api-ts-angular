import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { letheanSDPConfiguration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { VpnService } from './api/vpn.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class letheanSDPApiModule {
    public static forRoot(configurationFactory: () => letheanSDPConfiguration): ModuleWithProviders {
        return {
            ngModule: letheanSDPApiModule,
            providers: [ { provide: letheanSDPConfiguration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: letheanSDPApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('letheanSDPApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
