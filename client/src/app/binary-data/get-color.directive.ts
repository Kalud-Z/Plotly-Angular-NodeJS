import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appGetColor]'
})

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
export class GetColorDirective {
  finalColor: string;
  @Input() colorValue: number;

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const targetElement  = this.elRef.nativeElement;
    this.renderer.setStyle(targetElement, 'background', this.getColor(this.colorValue));
  }


  getColor(value: number): string {
    if(value === 0) { return 'blue' }
    if(value === 50) { return 'blue' }
    if(value === 100) { return 'red' }
    if(value === 150) { return 'yellow' }
    if(value === 200) { return 'gray' }
    if(value === 250) { return 'pink' }
  }



} //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
