// @angular
import { Component, OnInit } from '@angular/core';

// @rxjs
import { Observable } from 'rxjs';

// @services
import { RouterService } from './services/router.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
class AppComponent {
  constructor(public router: RouterService) {}
}

export {
  AppComponent
};
