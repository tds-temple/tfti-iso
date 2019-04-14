import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
class LoginComponent {
  constructor(public data: DataService) { }
}

export {
  LoginComponent
};
