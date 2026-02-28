import { Component, Input, Optional, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-control',
  standalone: true,
  templateUrl: './password-control.component.html',
  styleUrls: ['./password-control.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonItem, IonInput, IonButton, IonIcon],
})
export class PasswordControlComponent implements ControlValueAccessor {
  @Input() label = 'Password';
  @Input() labelPlacement: 'stacked' | 'fixed' | 'floating' = 'stacked';
  @Input() placeholder = 'Enter your password';
  @Input() minLength = 6;

  showPassword = signal(false);
  value = '';
  disabled = false;
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get invalid(): boolean {
    return !!this.ngControl?.invalid && !!this.ngControl?.touched;
  }

  get errorRequired(): boolean {
    return !!this.ngControl?.errors?.['required'];
  }

  get errorMinLength(): boolean {
    return !!this.ngControl?.errors?.['minlength'];
  }

  toggleVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const e = event as CustomEvent;
    const val = (e.detail?.value as string) ?? (e.target as HTMLIonInputElement)?.value ?? '';
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }
}
