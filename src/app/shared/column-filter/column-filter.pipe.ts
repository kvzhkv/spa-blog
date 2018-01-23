import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnFilter'
})

export class ColumnFilterPipe implements PipeTransform {
  transform(posts: any[], column: number, columnsNumber: number): any[] {
    return posts.filter((item, i) => {
      return i % columnsNumber === column;
    });
  }
}
