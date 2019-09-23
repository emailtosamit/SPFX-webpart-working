import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEmployeeRecordProps{
    listName:string;
    fullName:string;
    context:WebPartContext;
    // companyList?:IcompanyListOption[];
}
// export declare interface IcompanyListOption {
//     key: string | number;
//     text: string;
// }