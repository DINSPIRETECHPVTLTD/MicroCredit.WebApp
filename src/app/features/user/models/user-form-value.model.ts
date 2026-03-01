/** Form value for add/edit user. */
export interface UserFormValue {
  id?: number;
  email: string;
  firstName: string;
  surname: string;
  role: string;
  phoneNumber?: string;
  password?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  pinCode?: string;
}
