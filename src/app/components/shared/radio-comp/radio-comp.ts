import { Component, forwardRef, input } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

type RadioCompValueType = string | number | boolean | null
export type RadioCompInputConfig = {
  label?: string
  value: RadioCompValueType
}[]

@Component({
  selector: 'app-radio-comp',
  imports: [],
  templateUrl: './radio-comp.html',
  styleUrl: './radio-comp.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComp),
      multi: true
    }
  ]
})
export class RadioComp implements ControlValueAccessor {
  config = input.required<RadioCompInputConfig>()
  label = input<string>()

  value: RadioCompValueType = null

  onChange = (value: RadioCompValueType) => {}
  onTouched = () => {}

  writeValue(value: RadioCompValueType): void {
    // Treat undefined like null for easier optional handling
    this.value = value ?? null
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setValue(selected: RadioCompValueType) {
    const normalized = selected ?? null
    this.writeValue(normalized)
    this.onChange(normalized)
    this.onTouched()
  }
}
