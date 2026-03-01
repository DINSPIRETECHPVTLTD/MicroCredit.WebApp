import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton } from '@ionic/angular/standalone';

import { EmailControlComponent } from '../../../../shared/components/email-control';
import { PasswordControlComponent } from '../../../../shared/components/password-control';
import { User } from '../../models/user.model';
import { UserFormValue } from '../../models/user-form-value.model';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.page.html',
  styleUrls: ['./add-edit-user.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    EmailControlComponent,
    PasswordControlComponent,
  ],
})
export class AddEditUserPage implements OnChanges {
  @Input() user: User | null = null;
  @Input() roles: string[] = ['Admin', 'User', 'Staff'];
  @Output() save = new EventEmitter<UserFormValue>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isEditMode = false;
  showPassword = false;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      role: ['User', [Validators.required]],
      password: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const user = changes['user']?.currentValue as User | null;
    this.isEditMode = !!user;
    if (user) {
      this.form.patchValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        password: '',
      });
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      this.showPassword = false;
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
      this.form.patchValue({ password: '' });
    }
  }

  get title(): string {
    return this.isEditMode ? 'Edit User' : 'Add User';
  }

  get passwordRequired(): boolean {
    return !this.isEditMode || this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const value: UserFormValue = {
      email: raw.email,
      firstName: raw.firstName,
      lastName: raw.lastName,
      role: raw.role,
    };
    if (this.isEditMode) {
      value.id = this.user!.id;
      if (raw.password) value.password = raw.password;
    } else {
      value.password = raw.password;
    }
    this.save.emit(value);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  togglePasswordField(): void {
    this.showPassword = !this.showPassword;
    const ctrl = this.form.get('password');
    if (this.showPassword) {
      ctrl?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      ctrl?.setValidators([]);
      ctrl?.setValue('');
    }
    ctrl?.updateValueAndValidity();
  }
}
