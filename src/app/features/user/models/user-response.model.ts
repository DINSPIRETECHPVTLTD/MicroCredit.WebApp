/** User as returned from API (GET /User/Org). */
export interface UserResponse {
  id: number;
  firstName: string;
  surname: string;
  email: string;
  role: string;
  address: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pinCode: string;
  phoneNumber: string;
}
