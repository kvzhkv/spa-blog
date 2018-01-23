import { Directive, ElementRef, HostListener, Renderer, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DATE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessorDirective),
  multi: true
};

/**
 * The accessor for writing a value and listening to changes on a date input element
 *
 *  ### Example
 *  `<input type="date" name="myBirthday" ngModel useValueAsDate>`
 */
@Directive({
  // this selector changes the previous behavior silently and might break existing code
  // selector: 'input[type=date][formControlName],input[type=date][formControl],input[type=date][ngModel]',

  // this selector is an opt-in version
  selector: '[useValueAsDate]',
  providers: [DATE_VALUE_ACCESSOR]
})
export class DateValueAccessorDirective implements ControlValueAccessor {

  @HostListener('input', ['$event.target.valueAsDate']) onChange = (_: any) => { };
  @HostListener('blur', []) onTouched = () => { };

  constructor(private _renderer: Renderer, private _elementRef: ElementRef) { }

  writeValue(value: number): void {
    if (!value) {
      this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', null);
      return;
    }
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'valueAsDate', this.convertFromTimestamp(value));
  }

  convertToTimestamp(value: Date): number {
    if (value !== null) {
      return value.getTime();
    } else {
      return null;
    }
  }

  convertFromTimestamp(value: number): Date { // FIXME: add try catch???
    return new Date(value);
  }

  registerOnChange(fn: (_: any) => void): void { // FIXME: not sure of this approach
    let func = (data: Date) => {
        fn(this.convertToTimestamp(data));
    }
    this.onChange = func;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }
}