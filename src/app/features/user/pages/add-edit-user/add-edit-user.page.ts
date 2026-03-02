import {
  Component,
  OnInit,
  inject,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { NgFor } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItemDivider,
  IonIcon,
  IonFooter,
} from '@ionic/angular/standalone';

import { firstValueFrom } from 'rxjs';

import { EmailControlComponent } from '../../../../shared/components/email-control';
import { PasswordControlComponent } from '../../../../shared/components/password-control';
import { OrgRoles } from '../../../../shared/config/roles.constants';
import { UserResponse } from '../../models/user-response.model';
import { CreateUserRequest } from '../../models/create-user-request.model';
import { UpdateUserRequest } from '../../models/update-user-request.model';
import { UserService } from '../../services/user.service';

function passwordMatchValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const g = form as FormGroup;
    const p = g.get('password')?.value;
    const c = g.get('confirmPassword')?.value;
    if (p == null || c == null || p === '' || c === '') return null;
    return p !== c ? { confirmPasswordMismatch: true } : null;
  };
}

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.page.html',
  styleUrls: ['./add-edit-user.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonItemDivider,
    IonIcon,
    IonFooter,
    EmailControlComponent,
    PasswordControlComponent,
  ],
})
export class AddEditUserPage implements OnInit {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly modalController = inject(ModalController);
  private readonly userService = inject(UserService);

  @Input() userResponse: UserResponse | null = null;

  user: UserResponse | null = null;
  roles = ['Owner', 'Investor'];
  form!: FormGroup;
  saving = false;
  errorMessage: string | null = null;

  get isEditMode(): boolean {
    return !!this.user;
  }

  constructor() {

  }

  ngOnInit(): void {

  }

  getConfirmPasswordError(): string {
    const c = this.form.get('confirmPassword');
    if (c?.errors?.['required']) return 'Confirm password is required.';
    if (this.form.errors?.['confirmPasswordMismatch'] || c?.errors?.['confirmPasswordMismatch']) return 'Passwords do not match.';
    return 'Invalid.';
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (!this.isEditMode && this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      this.form.setErrors({ ...this.form.errors, confirmPasswordMismatch: true });
      return;
    }
    
  }

  onCancel(): void {
      this.modalController.dismiss();

  }
}
