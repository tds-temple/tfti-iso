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
  public selectedAgent: UserModel = null;

  public suppliers: SupplierModel[] = [];
  public favoriteSuppliers: SupplierModel[] = [];
  public searchResults: SupplierModel[] = [];
  public suppliersToRender: SupplierModel[] = [];

  public searchTerm: string;

  public showFavorites: boolean;

  constructor(public router: RouterService, public data: DataService) { }

  public ngOnInit() {
    this.showFavorites = false;
    this.data.currentUser$.subscribe({
      next: (user: UserModel) => {
        this.me = user;
        console.log(this.me);
        this.data.suppliers$.subscribe({
          next: (suppliers: SupplierModel[]) => {
            this.suppliers = suppliers.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            this.setFavorites();
            this.setSuppliersToRender();
          }
        });
      },
      error: err => console.log(err)
    });
  }

  public setEmailHref() {
    if (this.me.email.length >= 3) {
      return `mailto:${this.me.email}`;
    }
  }

  public clearSelections() {
    this.selectedSupplier = null;
    this.selectedResource = null;
    this.selectedAgent = null;
  }

  public goToAdmin() {
    this.clearSelections();
    this.router.setView('agency');
  }

  public search() {
    this.searchResults = [];
    this.searchResults = this.searchFor(this.searchTerm);
    this.setSuppliersToRender();
  }

  public searchFor(term: string): SupplierModel[] {
    const searchTerm = term.trim().toLowerCase();
    const suppliersToSearch = this.showFavorites ? this.favoriteSuppliers : this.suppliers;
    const qualifyingSuppliers: SupplierModel[] = [];

    if (searchTerm === '') {
      return qualifyingSuppliers;
    }

    suppliersToSearch.forEach(supplier => {
      let qualifies: boolean = false;

      if (supplier.name.toLowerCase().includes(searchTerm)) {
        qualifies = true;
      }

      supplier.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm)) {
          qualifies = true;
        }
      });

      if (qualifies) {
        qualifyingSuppliers.push(supplier);
      }
    });
    return qualifyingSuppliers;
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

  public selectAgent(agent: UserModel) {
    this.selectedAgent = agent;
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

  private setFavorites() {
    this.favoriteSuppliers = [];

    for (let i = 0; i < this.suppliers.length; i++) {
      if (this.isFavoriteSupplier(this.suppliers[i])) {
        this.favoriteSuppliers.push(this.suppliers[i]);
      }
    }
  }

  private addFavorite(id: string) {
    if (this.me.favorites.lastIndexOf(id) === -1) {
      this.me.favorites.push(id);
    }
  }

  private removeFavorite(id: string) {
    const index = this.me.favorites.lastIndexOf(id);
    if ( index !== -1) {
      this.me.favorites.splice(index, 1);
    }
  }

  public toggleFavorite(id: string) {
    if ( this.me.favorites.lastIndexOf(id) === -1) {
      this.addFavorite(id);
    } else {
      this.removeFavorite(id);
    }

    this.setFavorites();

    this.updateMe();
  }

  public setSuppliersToRender() {
    this.suppliersToRender = [];
    if (this.searchResults.length > 0) {
      this.suppliersToRender = this.searchResults;
    } else if (this.showFavorites) {
      this.suppliersToRender =  this.favoriteSuppliers;
    } else {
      this.suppliersToRender = this.suppliers;
    }
  }

  public toggleShowFavorites() {
    this.showFavorites = !this.showFavorites;
    this.setSuppliersToRender();
  }

  public createNote(form: NgForm) {
    const note: NoteModel = { title: form.value.title, body: form.value.body, noteID: new Date().getMilliseconds.toString() };
    if (note) {
      if (this.me.notes.includes(note) === false) {
        this.me.notes.push(note);
        this.updateMe();
      }
      this.router.closeModals();
    }
  }

  public openEditNoteModal() {
    if (this.selectedNote !== null) {
      this.router.setModal('edit-note');
    }
  }

  public editNote() {
    const note = this.selectedNote;
    const index = this.me.notes.lastIndexOf(note);

    if (index !== -1) {
      this.me.notes[index] = this.selectedNote;
    }

    this.updateMe();
    this.router.closeModals();
  }

  public openDeleteNoteConfirmation() {
    if (this.selectedNote !== null) {
      this.router.setModal('delete-note');
    }
  }

  public setAdminEntity(entity: string) {
    this.clearSelections();
    this.router.setAdminEntity(entity);
  }

  public deleteNote(note: NoteModel) {
    const index = this.me.notes.lastIndexOf(note);
    if ( index !== -1) {
      this.me.notes.splice(index, 1);

      this.updateMe();

      this.selectedNote = null;

      this.router.closeModals();
    }
  }

  public deleteAgent() {
    this.data.deleteUser(this.selectedAgent);
    this.selectedAgent = null;
    this.router.closeModals();
  }

  public deleteSupplier() {
    this.data.deleteSupplier(this.selectedSupplier);
    this.selectedSupplier = null;
    this.router.closeModals();
  }

  public deleteResource(type) {
    this.data.deleteResource(this.selectedSupplier, type);
    this.selectedResource = null;
    this.router.closeModals();
  }
}

export {
  DashboardComponent
};
