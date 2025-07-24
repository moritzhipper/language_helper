import { Component, forwardRef, input } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

export type RadioCompInputConfig = {
  label?: string
  value: string | number | boolean
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

  value: string | number | boolean | undefined = undefined

  onChange = (value: string | number | boolean) => {}
  onTouched = () => {}

  writeValue(value: string | number | boolean): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setValue(event: Event) {
    const target = event.target as HTMLInputElement
    const selectedStringValue = target.value

    // Find the matching option to preserve the original data type (string or number)
    const matchingOption = this.config().find(
      (option) => String(option.value) === selectedStringValue
    )

    if (matchingOption) {
      const originalValue = matchingOption.value
      this.writeValue(originalValue)
      this.onChange(originalValue)
    }

    this.onTouched()
  }
}
