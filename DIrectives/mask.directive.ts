import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMaskPassword]',
})
export class MaskPasswordDirective {

  public originalText: string = '';

  constructor(private el: ElementRef) {
    this.originalText = this.el.nativeElement.value;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const cursorStart = this.el.nativeElement.selectionStart;
    const cursorEnd = this.el.nativeElement.selectionEnd;

    if (value.length < this.originalText.length) {
      // remove a character
      const diff = this.originalText.length - value.length;
      this.originalText =
        this.originalText.substring(0, cursorStart) +
        this.originalText.substring(cursorStart + diff);
    } else {
      // add a character
      const diff = value.length - this.originalText.length;
      const addedText = value.substring(cursorStart - diff, cursorStart);
      this.originalText =
        this.originalText.substring(0, cursorStart - diff) +
        addedText +
        this.originalText.substring(cursorStart - diff);
    }
    // clean text
    this.originalText = this.cleanText(this.originalText);
    // apply masking
    const maskedText = this.maskText(this.originalText);
    this.el.nativeElement.value = maskedText;

    const cursorPos = cursorStart + (maskedText.length - value.length);
    this.el.nativeElement.setSelectionRange(cursorPos, cursorPos);
  }

  private cleanText(text: string): string {
    return text.replace(/[^a-zA-Z0-9]/g, '');
  }

  private maskText(text: string): string {
    const masked = text.replace(/./g, '*');
    return masked;
  }

}
