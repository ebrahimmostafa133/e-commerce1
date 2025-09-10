import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(arr:any , kelma:string): any [] {
    if (!Array.isArray(arr) || !kelma) return arr;

    const searchTerm = kelma.toLowerCase();
    return arr.filter((item:any) =>
      Object.values(item).some((value:any) =>
        String(value).toLowerCase().includes(searchTerm)
      )
    );
  }

}
