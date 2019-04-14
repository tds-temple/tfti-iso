// @angular
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// @services
import { RouterService } from '../../services/router.service';
import { DataService } from '../../services/data.service';

// @models
import { SupplierModel } from 'src/app/models/supplier.model';
import { ResourceModel } from 'src/app/models/resource.model';
import { NoteModel } from 'src/app/models/note.model';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
class DashboardComponent implements OnInit {
  public selectedSupplier: SupplierModel = null;
  public selectedResource: ResourceModel = null;
  public selectedNote: NoteModel = null;
  public me: UserModel = null;

  public suppliers: SupplierModel[] = [];
  public favoriteSuppliers: SupplierModel[] = [];

  public showFavorites: boolean;

  constructor(public router: RouterService, public data: DataService) { }

  ngOnInit() {
    this.showFavorites = false;
    this.data.currentUser$.subscribe({
      next: (user: UserModel) => {
        this.me = user;
        console.log(this.me);
        this.data.suppliers$.subscribe({
          next: (suppliers: SupplierModel[]) => {
            this.suppliers = suppliers;
            this.setFavorites();
          }
        });
      },
      error: err => console.log(err)
    });
  }

  public selectSupplier(supplier: SupplierModel) {
    this.selectedSupplier = supplier;
  }

  public selectResource(resource: ResourceModel) {
    this.selectedResource = resource;
  }

  public selectNote(note: NoteModel) {
    this.selectedNote = note;
  }

  public updateMe() {
    this.data.updateUser(this.me);
  }

  public isFavoriteSupplier(supplier: SupplierModel) {
    if (this.me === null) {
      return false;
    }
    const favorites: string[] = this.me.favorites;
    const favorite: string = favorites.find(x => x === supplier.id);
    if (favorite) {
      return true;
    } else {
      return false;
    }
  }

  setFavorites() {
    this.favoriteSuppliers = [];

    for (let i = 0; i < this.suppliers.length; i++) {
      if (this.isFavoriteSupplier(this.suppliers[i])) {
        this.favoriteSuppliers.push(this.suppliers[i]);
      }
    }
  }

  addFavorite(id: string) {
    if (this.me.favorites.lastIndexOf(id) === -1) {
      this.me.favorites.push(id);
    }
  }

  removeFavorite(id: string) {
    const index = this.me.favorites.lastIndexOf(id);
    if ( index !== -1) {
      this.me.favorites.splice(index, 1);
    }
  }

  toggleFavorite(id: string) {
    if ( this.me.favorites.lastIndexOf(id) === -1) {
      this.addFavorite(id);
    } else {
      this.removeFavorite(id);
    }

    this.setFavorites();

    this.updateMe();
  }

  public suppliersToRender() {
    if (this.showFavorites) {
      return this.favoriteSuppliers;
    } else {
      return this.suppliers;
    }
  }

  public toggleShowFavorites() {
    this.showFavorites = !this.showFavorites;
  }

  public createNote(form: NgForm) {
    const note: NoteModel = { title: form.value.title, body: form.value.body, noteID: new Date().getMilliseconds.toString() };
    if (note) {
      if (this.me.notes.includes(note) === false) {
        this.me.notes.push(note);
        this.updateMe();
      }
      this.router.setModal('none');
    }
  }

  public deleteNote(note: NoteModel) {
    const index = this.me.notes.lastIndexOf(note);
    if ( index !== -1) {
      this.me.notes.splice(index, 1);
      this.updateMe();

      if (this.selectedNote === note) {
        this.selectedNote = null;
      }
      this.router.setModal('none');
    }
  }
}

export {
  DashboardComponent
};
