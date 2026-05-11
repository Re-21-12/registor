import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { FieldBase } from '../interfaces/field-props';
import { TypeFields } from '../enums/type-fields';

@Injectable({ providedIn: 'root' })
export class FormBuilderService {
  toFormGroup(fields: FieldBase<string>[]) {
    const group: any = {};
    fields.forEach((field) => {
      const validators: any[] = [];
      if (field.rules) {
        field.rules.forEach((rule: Validators) => validators.push(rule));
      }
      if (field.state.repeatible.repeat) {
        group[field.key] = new FormArray(
          this.createRepeatableItems(field.value || '', validators),
        );
      } else {
        const initial =
          field.type === TypeFields.MULTISELECT
            ? field.value ?? []
            : field.value ?? '';
        group[field.key] = new FormControl(initial, validators);
      }
    });
    return new FormGroup(group);
  }

  private createRepeatableItems(initialValue: string, validators: any[]): FormControl[] {
    return [new FormControl(initialValue, validators)];
  }

  addItem(formArray: FormArray, value: string = '', validators: any[] = []): void {
    formArray.push(new FormControl(value, validators));
  }

  removeItem(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }
}
