// @angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// @CKEditor
import { CKEditorModule } from 'ng2-ckeditor';

// @fontawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHeart,
  faPlay,
  faGraduationCap,
  faTools,
  faPlus,
  faEdit,
  faTimes,
  faStar,
  faBan,
  faCheck,
  faPhone,
  faEnvelope,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';

// @services
import { RouterService } from './services/router.service';
import { DataService } from './services/data.service';

// @components
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    CKEditorModule
  ],
  providers: [
    RouterService,
    DataService
  ],
  bootstrap: [
    AppComponent
  ]
})
class AppModule {
  constructor() {
    library.add(
      faHeart,
      faPlay,
      faGraduationCap,
      faTools,
      faPlus,
      faEdit,
      faTimes,
      faStar,
      faBan,
      faCheck,
      faPhone,
      faEnvelope,
      faHome,
      faFacebook,
      faTwitter,
      faLinkedin
    );
  }
}

export {
  AppModule
};
