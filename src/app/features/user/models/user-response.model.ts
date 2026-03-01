/** User as returned from API (GET /User/Org). */
export interface UserResponse {
  id: number;
  firstName: string;
  surname: string;
  email: string;
  role: string;
  address: string; // matches API property name
}
