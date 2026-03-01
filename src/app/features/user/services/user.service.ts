import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserResponse } from '../models/user-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * GET /User/Org – list users for the current organization.
   */
  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.baseUrl}User/Org`);
  }

  /**
   * Same as getUsers() but mapped to User (surname → lastName, addresss → address).
   */
  getUsersAsUser(): Observable<User[]> {
    return this.getUsers().pipe(
      map((list) =>
        list.map((u) => ({
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.surname,
          role: u.role,
          address: u.addresss,
        }))
      )
    );
  }
}
