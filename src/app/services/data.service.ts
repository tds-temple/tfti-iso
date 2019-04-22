// @angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

// @rxjs
import { BehaviorSubject } from 'rxjs';

// @services
import { RouterService } from './router.service';

// @models
import { SupplierModel } from '../models/supplier.model';
import { ResourceModel } from '../models/resource.model';
import { UserModel } from '../models/user.model';
import { NoteModel } from '../models/note.model';

// @environments
import { environment } from '../../environments/environment';

@Injectable()
class DataService {
  private baseUrl: string = environment.apiBase;

  private suppliersSubject = new BehaviorSubject<SupplierModel[]>(null);
  private selectedSupplierSubject = new BehaviorSubject<SupplierModel>(null);

  private resourcesSubject = new BehaviorSubject<ResourceModel[]>(null);
  private selectedResourceSubject = new BehaviorSubject<ResourceModel>(null);

  private learningResourcesSubject = new BehaviorSubject<ResourceModel[]>(null);
  private selectedLearningResourceSubject = new BehaviorSubject<ResourceModel>(null);

  private usersSubject = new BehaviorSubject<UserModel[]>(null);
  private selectedUserSubject = new BehaviorSubject<UserModel>(null);
  private currentUserSubject = new BehaviorSubject<UserModel>(null);

  private selectedNoteSubject = new BehaviorSubject<NoteModel>(null);


  public suppliers$ = this.suppliersSubject.asObservable();
  public selectedSupplier$ = this.selectedSupplierSubject.asObservable();

  public resources$ = this.resourcesSubject.asObservable();
  public selectedResource$ = this.selectedResourceSubject.asObservable();

  public learningResources$ = this.learningResourcesSubject.asObservable();
  public selectedLearningResource$ = this.selectedLearningResourceSubject.asObservable();

  public users$ = this.usersSubject.asObservable();
  public selectedUser$ = this.selectedUserSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  public selectedNote$ = this.selectedNoteSubject.asObservable();

  constructor(private http: HttpClient, private router: RouterService) {
    this.getSuppliers();
    this.getResources();
    this.getLearningResources();
    this.getUsers();
  }

  /////////////////////////// Suppliers ////////////////////////////
  getSuppliers() {
    this.http.get(`${this.baseUrl}/suppliers.json`).subscribe({
      next: (data) => {
        const dataArray: SupplierModel[] = [];
        for(let key in data) {
          dataArray.push({ ...data[key], id: key })
        }
        this.suppliersSubject.next(dataArray);
      },
      error: err => console.log(err)
    });
  }

  selectSupplier(id: string) {
    this.suppliers$.subscribe({
      next: (suppliers: SupplierModel[]) => {
        const supplier: SupplierModel = suppliers.find(x => x.id === id);
        if (supplier) {
          this.selectedSupplierSubject.next(supplier);
        }
      },
      error: err => console.log(err)
    });
  }

  deleteSupplier(supplier) {
    this.http.delete(`${this.baseUrl}/suppliers/${supplier.id}.json`).subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }
  /////////////////////////// Resources ////////////////////////////
  getResources() {
    this.http.get(`${this.baseUrl}/resources.json`).subscribe({
      next: (data) => {
        const dataArray: ResourceModel[] = [];
        for(let key in data) {
          dataArray.push({ ...data[key], id: key, type: 'resources' })
        }
        this.resourcesSubject.next(dataArray);
      },
      error: err => console.log(err)
    });
  }

  selectResource(id: string) {
    this.resources$.subscribe({
      next: (resources: ResourceModel[]) => {
        const resource: ResourceModel = resources.find(x => x.id === id);
        if (resource) {
          this.selectedResourceSubject.next(resource);
        }
      },
      error: err => console.log(err)
    });
  }

  deleteResource(resource, type) {
    this.http.delete(`${this.baseUrl}/${type}/${resource.id}.json`).subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }
  /////////////////////////// Learning Resources ////////////////////////////
  getLearningResources() {
    this.http.get(`${this.baseUrl}/learningResources.json`).subscribe({
      next: (data) => {
        const dataArray: ResourceModel[] = [];
        for(let key in data) {
          dataArray.push({ ...data[key], id: key, type: 'learningResources' })
        }
        this.learningResourcesSubject.next(dataArray);
      },
      error: err => console.log(err)
    });
  }

  selectLearningResource(id: string) {
    this.learningResources$.subscribe({
      next: (resources: ResourceModel[]) => {
        const resource: ResourceModel = resources.find(x => x.id === id);
        if (resource) {
          this.selectedLearningResourceSubject.next(resource);
        }
      },
      error: err => console.log(err)
    });
  }
  /////////////////////////// Users ////////////////////////////
  getUsers() {
    this.http.get(`${this.baseUrl}/users.json`).subscribe({
      next: (data) => {
        const dataArray: UserModel[] = [];
        for(let key in data) {
          const favoritesArray: string[] = [];
          const notesArray: NoteModel[] = [];
          if(data[key].hasOwnProperty('favorites')) {
            const favorites: string[] = data[key].favorites
            for(let f in favorites) {
              favoritesArray.push(favorites[f])
            }
          }
          if(data[key].hasOwnProperty('notes')) {
            const notes: NoteModel[] = data[key].notes
            for(let n in notes) {
              notesArray.push(notes[n])
            }
          }
          dataArray.push({ ...data[key], id: key, favorites: favoritesArray, notes: notesArray })
        }
        this.usersSubject.next(dataArray);
      },
      error: err => console.log(err)
    });
  }

  selectUser(id: string) {
    this.users$.subscribe({
      next: (users: UserModel[]) => {
        const user: UserModel = users.find(x => x.id === id);
        if (user) {
          this.selectedUserSubject.next(user);
        }
      },
      error: err => console.log(err)
    });
  }

  login(form: NgForm) {
    const username = form.value.username;
    const password = form.value.password;
    this.users$.subscribe({
      next: (users: UserModel[]) => {
        const user: UserModel = users.find(x => x.username === username);
        if (user) {
          if (password === environment.adminKey) {
            this.router.setAgencyMode('admin');
            this.currentUserSubject.next(user);
            this.router.setPath('dashboard');
          } else if (password === environment.agencyKey) {
            this.router.setAgencyMode('agency');
            this.currentUserSubject.next(user);
            this.router.setPath('dashboard');
          } else {
            alert(`Password ${password} was not found.`);
          }
        } else {
          alert(`Username ${username} was not found.`);
        }
      },
      error: err => console.log(err)
    });
  }

  selectNote(id: string) {
    this.currentUser$.subscribe({
      next: (user: UserModel) => {
        const note: NoteModel = user.notes.find(x => x.noteID === id);
        if (note) {
          this.selectedNoteSubject.next(note);
        }
      },
      error: err => console.log(err)
    });
  }

  updateUser(user) {
    this.http.put(`${this.baseUrl}/users/${user.id}.json`, user).subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }

  deleteUser(user) {
    this.http.delete(`${this.baseUrl}/users/${user.id}.json`).subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }
}

export {
  DataService
};
