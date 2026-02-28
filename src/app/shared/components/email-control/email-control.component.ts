import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonInput } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-control',
  standalone: true,
  templateUrl: './email-control.component.html',
  styleUrls: ['./email-control.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonItem, IonInput],
})
export class EmailControlComponent implements ControlValueAccessor {
  @Input() label = 'Email';
  @Input() labelPlacement: 'stacked' | 'fixed' | 'floating' = 'stacked';
  @Input() placeholder = 'Enter your email';

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

  get errorEmail(): boolean {
    return !!this.ngControl?.errors?.['email'];
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
    const value = (e.detail?.value as string) ?? (e.target as HTMLIonInputElement)?.value ?? '';
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
