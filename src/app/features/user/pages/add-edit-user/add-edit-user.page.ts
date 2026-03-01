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
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonBreadcrumbs,
  IonBreadcrumb,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
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

import { EmailControlComponent } from '../../../../shared/components/email-control';
import { PasswordControlComponent } from '../../../../shared/components/password-control';
import { User } from '../../models/user.model';
import { UserFormValue } from '../../models/user-form-value.model';
import { UserResponse } from '../../models/user-response.model';

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
    NgIf,
    NgTemplateOutlet,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonBreadcrumbs,
    IonBreadcrumb,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
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

  @Input() isModal = false;
  @Input() userResponse: UserResponse | null = null;

  user: User | null = null;
  roles = ['Owner', 'Investor'];
  form!: FormGroup;

  get isEditMode(): boolean {
    return !!this.user;
  }
  get pageTitle(): string {
    return this.isEditMode ? 'Edit User' : 'Add User';
  }

  constructor() {
    if (!this.userResponse) {
      const state = this.router.getCurrentNavigation()?.extras?.state as { user?: UserResponse } | undefined;
      const res = state?.user ?? null;
      this.user = res ? this.mapResponseToUser(res) : null;
    }
  }

  ngOnInit(): void {
    if (this.userResponse != null) {
      this.user = this.mapResponseToUser(this.userResponse);
    }
    this.buildForm();
  }

  private mapResponseToUser(r: UserResponse): User {
    return {
      id: r.id,
      firstName: r.firstName,
      surname: r.surname,
      email: r.email,
      role: r.role,
      address: r.address,
      address1: r.address,
    };
  }

  private buildForm(): void {
    const u = this.user;
    this.form = this.fb.nonNullable.group(
      {
        firstName: [u?.firstName ?? '', [Validators.required]],
        surname: [u?.surname ?? '', [Validators.required]],
        email: [u?.email ?? '', [Validators.required, Validators.email]],
        phoneNumber: [u?.phoneNumber ?? ''],
        role: [u?.role ?? 'Owner', [Validators.required]],
        password: [''],
        confirmPassword: [''],
        address1: [u?.address1 ?? u?.address ?? ''],
        address2: [u?.address2 ?? ''],
        city: [u?.city ?? ''],
        state: [u?.state ?? ''],
        pinCode: [u?.pinCode ?? ''],
      },
      { validators: this.isEditMode ? [] : [passwordMatchValidator()] }
    );
    if (this.isEditMode) {
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      this.form.get('confirmPassword')?.clearValidators();
      this.form.get('confirmPassword')?.updateValueAndValidity();
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
      this.form.get('confirmPassword')?.setValidators([Validators.required]);
      this.form.get('confirmPassword')?.updateValueAndValidity();
    }
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
    const raw = this.form.getRawValue();
    const value: UserFormValue = {
      email: raw.email,
      firstName: raw.firstName,
      surname: raw.surname,
      role: raw.role,
      phoneNumber: raw.phoneNumber || undefined,
      address1: raw.address1 || undefined,
      address2: raw.address2 || undefined,
      city: raw.city || undefined,
      state: raw.state || undefined,
      pinCode: raw.pinCode || undefined,
    };
    if (this.isEditMode && this.user) {
      value.id = this.user.id;
    } else {
      value.password = raw.password;
    }
    // TODO: call user API (create/update)
    if (this.isModal) {
      this.modalController.dismiss(value);
    } else {
      this.router.navigate(['/users']);
    }
  }

  onCancel(): void {
    if (this.isModal) {
      this.modalController.dismiss();
    } else {
      this.router.navigate(['/users']);
    }
  }
}
