import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable()
export class SweerAlertService {

constructor() { }
  okMessage(title: string, text: string, okButton: boolean = true, cancelButton: boolean = false) {
     Swal({
      title: title,
      text: text,
      type: 'success',
      showConfirmButton: okButton,
      showCancelButton: cancelButton,
    });
  }

  onError(title: string, text: string, okButton: boolean = true, cancelButton: boolean = false) {
     Swal({
      title: title,
      text: text,
      type: 'error',
      showCancelButton: cancelButton,
      showConfirmButton: okButton,
    });
  }
}
