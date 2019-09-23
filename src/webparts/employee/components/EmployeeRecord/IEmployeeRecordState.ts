export interface IEmployeeRecordState{
    fullName:string;
    addUsers:string[];
    selectedItem?: { key: string | number | undefined,text?: string | number | undefined  };
    selectedItemLookup?: { key: string | number | undefined,text?: string | number | undefined };
    companyList:any[];
    isPermanent?:boolean;
    department:{ key: string | number | undefined,text?: string | number | undefined  };
    
}
