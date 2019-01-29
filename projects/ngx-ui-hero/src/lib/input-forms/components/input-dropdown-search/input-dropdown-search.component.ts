import { Component, EventEmitter, Inject, Input, IterableDiffers, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';

import { ElementBase } from '../../base/element-base';
import { AsyncValidatorArray, ValidatorArray } from '../../base/validate';
import { InputFormsConfig } from '../../input-forms-config';
import { INPUT_FORMS_CONFIG } from '../../input-forms-config.constants';

let identifier = 0;

@Component({
  selector: 'input-dropdown-search',
  templateUrl: './input-dropdown-search.component.html',
  styleUrls: ['./input-dropdown-search.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InputDropdownSearchComponent,
    multi: true
  }]
})
export class InputDropdownSearchComponent extends ElementBase<any> implements OnInit { 
  private _lastModelInitialized: any;
  private _differData: any;
  private _data: Array<any>;
  showDropdown: boolean;
  comboTouched: boolean;
  modelInitialized: boolean;
  clickOutsideEnabled: boolean = true;
  search: string;
  selectedDisplayText: string;
  internalData: Array<any>;
  
  @ViewChild(NgModel) model: NgModel;
  @Input() public placeholder = 'Select...';
  @Input() public searchPlaceholder = 'Search...';
  @Input() public displayTextProperty: string;
  @Input() public valueProperty: string;
  @Output() public onChange = new EventEmitter<any>();

  get data(): Array<any> {
    return this._data;
  }    
  @Input('data')
  set data(value: Array<any>) {
    this._data = value;
    this.Init();
  }
  
  public identifier = `input-dropdown-search-${identifier++}`;  
 
  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: ValidatorArray,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: AsyncValidatorArray,
    @Inject( INPUT_FORMS_CONFIG ) public config: InputFormsConfig,
    private iterableDiffers: IterableDiffers,
  ) {
    super(validators, asyncValidators, config);

    if (config.dropDown) {
      Object.assign(this, config.dropDown);
    }

    this._differData = this.iterableDiffers.find([]).create(null);
  }

  ngOnInit(): void {
    this.Init();
  }
  ngDoCheck(): void {
    let changesInData = this._differData.diff(this._data);

    if (changesInData || !this.modelInitialized || this.value != this._lastModelInitialized) {
      this.Init();
    }
  }

  Init(): void {
    this.clearSearch();

    if (!this.internalData || this.internalData.length == 0) {
      return;
    }

    if (this.value) {
      this.setSelectedItemByTheCurrentModelValue();
      this._lastModelInitialized = this.value;
    } else {
      this._lastModelInitialized = undefined;
    }
    
    this.modelInitialized = true;
  }

  ToggleDropDown(value?: boolean): void {
    if (this.clickOutsideEnabled) {
      if (value == false && !this.showDropdown || (this.disabled)) return;
    
      if (value == undefined) {
        if (this.showDropdown) {
          this.setComboTouched();
        }
  
        this.showDropdown = !this.showDropdown;      
      } else {
        if (!value && this.showDropdown) {
          this.setComboTouched();
        }
        
        this.showDropdown = value;
      }
      
      this.clearSearch();
    } else {
      this.clickOutsideEnabled = true;
    }
  }
  Select(row: any): void {
    this.value = this.renderPropertyValue(this.valueProperty, row);
    this.onChange.emit(this.value);
    
    this.ToggleDropDown(false);
  }
  OnSearch(): void {
    if (!this.search || this.search.length < 3) {
      this.clearSearchResults();
      return;
    }

    this.filterData();
  }
  ClearSelection(e?: any): void {
    this.value = null;
    this.selectedDisplayText = null;
    this.comboTouched = true;
    this.showDropdown = false;
    this.onChange.emit(this.value);

    if (e) e.stopPropagation();
  }

  private setSelectedItemByTheCurrentModelValue(): void {
    if (!this.value) return;

    let row = this.data.find(x => this.value == this.renderPropertyValue(this.valueProperty, x));
    if (row) {
      this.selectedDisplayText = this.renderPropertyValue(this.displayTextProperty, row);
    }
  }
  private filterData(): void {
    this.internalData = this.data.filter(x => {
      let value = this.renderPropertyValue(this.displayTextProperty, x);

      if (value && value.toString().toUpperCase().indexOf(this.search.toUpperCase()) >= 0) {
        return true;
      }

      return false;
    });
  }
  private clearSearch(): void {
    this.search = '';
    this.clearSearchResults();
  }
  private clearSearchResults(): void {
    this.internalData = Object.assign([], this.data);
  }
  private setComboTouched(): void {
    this.comboTouched = true;
  }
  private renderPropertyValue(propertyPath: string, object: any): any {
    let parts: string[] = propertyPath.split( "." );
    let property: any = object || {};
  
    for (let i = 0; i < parts.length; i++) {
      if (!property) {
        return null;
      }

      property = property[parts[i]];
    }

    return property;
  }
 
}