declare interface IEmployeeWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ListNameFieldLabel: string;
  TitleFieldLabel: string;
}

declare module 'EmployeeWebPartStrings' {
  const strings: IEmployeeWebPartStrings;
  export = strings;
}
