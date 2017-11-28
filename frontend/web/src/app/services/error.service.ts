import {Injectable} from '@angular/core';
@Injectable()
export class ErrorService {
  constructor() {

  }

  showAlert(title, message) {
    alert(title + '\n\n' + message);
  }
}
