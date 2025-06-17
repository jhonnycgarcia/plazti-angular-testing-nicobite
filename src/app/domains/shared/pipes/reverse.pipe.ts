import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
  standalone: true,
})
export class ReversePipe implements PipeTransform {
  transform(value: string): string {
    const parsed = value.trim();
    if (parsed.length === 0) return '';
    return parsed.split('').reverse().join('');
  }
}
