declare module 'xlsx' {
  export const utils: any;
  export function write(workbook: any, opts: any): any;
  export function read(data: any, opts?: any): any;
  export function book_new(): any;
}
