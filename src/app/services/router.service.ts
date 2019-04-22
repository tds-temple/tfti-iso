// @rxjs
import { BehaviorSubject } from 'rxjs';

class RouterService {
  private pathSubject = new BehaviorSubject<string>('');
  private viewSubject = new BehaviorSubject<string>('');
  private resourcesModeSubject = new BehaviorSubject<string>('');
  private agencyModeSubject = new BehaviorSubject<string>('');
  private adminModeSubject = new BehaviorSubject<string>('');
  private adminEntitySubject = new BehaviorSubject<string>('');
  private modalSubject = new BehaviorSubject<string>('');

  public path$ = this.pathSubject.asObservable();
  public view$ = this.viewSubject.asObservable();
  public resourcesMode$ = this.resourcesModeSubject.asObservable();
  public agencyMode$ = this.agencyModeSubject.asObservable();
  public adminMode$ = this.adminModeSubject.asObservable();
  public adminEntity$ = this.adminEntitySubject.asObservable();
  public modal$ = this.modalSubject.asObservable();

  constructor() {
    this.setPath('login');
    this.setView('suppliers');
    this.setResourceMode('tools');
    this.setAgencyMode('agency');
    this.setAdminMode('none');
    this.setAdminEntity('none');
    this.setModal('none');
  }

  public setPath(path: string) {
    this.pathSubject.next(path);
  }

  public setView(view: string) {
    this.viewSubject.next(view);
  }

  public setResourceMode(mode: string) {
    this.resourcesModeSubject.next(mode);
  }

  public setAgencyMode(mode: string) {
    this.agencyModeSubject.next(mode);
  }

  public setAdminMode(mode: string) {
    this.adminModeSubject.next(mode);
  }

  public setAdminEntity(entity: string) {
    this.adminEntitySubject.next(entity);
  }

  public setModal(modal: string) {
    this.modalSubject.next(modal);
  }

  public closeModals() {
    this.modalSubject.next('none');
  }

  public openUrlInNewTab(url: string) {
    window.open(url);
  }
}

export {
  RouterService
};
