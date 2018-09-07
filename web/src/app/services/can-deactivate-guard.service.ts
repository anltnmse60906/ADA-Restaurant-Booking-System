import {Injectable} from "@angular/core";
import {CanDeactivate} from "@angular/router";
import {ComponentCanDeactivate} from "../shared/component-can-deactivate";

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {


  canDeactivate(component: ComponentCanDeactivate) {
    if (component.canDeactivate()) {
      if (confirm(component.showingMessage())) {
        component.callback();
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

}
