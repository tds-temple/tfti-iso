import { NoteModel } from './note.model';

interface UserModel {
  bio: string;
  email: string;
  facebook: string;
  favorites: string[];
  id: string;
  linkedIn: string;
  location: string;
  name: string;
  notes: NoteModel[];
  phone: string;
  twitter: string;
  url: string;
  username: string;
}

export {
  UserModel
};
