import {HostListener} from "@angular/core";

export abstract class ComponentCanDeactivate {
  abstract canDeactivate(): boolean;

  abstract callback(): void

  abstract showingMessage(): string;

  @HostListener("window:beforeunLoad", ['$event'])
  unloadNotification($event: any) {
    console.log($event);
    if (this.canDeactivate()) {
      return $event.returnValue = false;
    }
  }
}
