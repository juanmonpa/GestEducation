import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CloudAddPageRoutingModule } from './cloud-add-routing.module';

import { CloudAddPage } from './cloud-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CloudAddPageRoutingModule
  ],
  declarations: [CloudAddPage]
})
export class CloudAddPageModule {}
