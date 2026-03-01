/** Form value for add/edit user. */
export interface UserFormValue {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password?: string;
}
