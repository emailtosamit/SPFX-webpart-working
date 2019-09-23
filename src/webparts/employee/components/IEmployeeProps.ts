import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEmployeeProps {
  listName: string;
  pageTitle:string;
  context:WebPartContext;
}
