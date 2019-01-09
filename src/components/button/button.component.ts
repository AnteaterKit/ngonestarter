import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: '[Button], one-button',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './button.component.html'
})
export class Button implements OnInit {
  prefixCls = 'one-button';
  ngTemplate = false;

  private _el: HTMLElement;
  private _className = '';
  private _classList: any = [];
  private _size = 'large';
  private _type: string;

  @Input()
  get type(): string {
    return this._type;
  }

  @Input()
  get size(): string {
    return this._size;
  }

  @Input()
  set className(v) {
    this._className = this._className + ' ' + v;
    this.setClassMap();
  }
  constructor(private _elementRef: ElementRef, private _render: Renderer2) {
    this._el = this._elementRef.nativeElement;
    this._render.addClass(this._el, this.prefixCls);
    this._className = this._el.className;
  }

  ngOnInit() {
  }

  private setClassMap(): void {
    this._classList = [
      this._type && `${this.prefixCls}-${this._type}`,
      this._size === 'small' && `${this.prefixCls}-${this._size}`
    ].filter(item => {
      return !!item;
    });
    this._el.className = this._className + ' ' + this._classList.join(' ');
  }
}
