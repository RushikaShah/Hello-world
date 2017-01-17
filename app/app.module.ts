import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { FileUploadDemoComponent }  from './angular-2-upload-file';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    FileUploadDemoComponent
    
  ],
  

  bootstrap: [ FileUploadDemoComponent ]
})
export class AppModule { }
