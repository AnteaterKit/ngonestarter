import { NgModule, ModuleWithProviders } from '@angular/core';
import { ButtonModule } from './button/button.module';

@NgModule({
  providers: [],
  exports: [
   ButtonModule
  ]
})
export class OneModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OneModule
    };
  }
}
