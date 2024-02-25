import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(filterValue: string, members: any[]): any[] {
    if (!filterValue) {
      return members;
    }

    const filterValueLower = filterValue.toLowerCase();
    return members.filter(
      (member) =>
        member.email.toLowerCase().includes(filterValueLower) ||
        member.role.toLowerCase().includes(filterValueLower)
    );
  }
}
