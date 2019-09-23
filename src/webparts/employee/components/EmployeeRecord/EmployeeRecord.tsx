import * as React from 'react';
import styles from "./EmployeeRecord.module.scss";
import { IEmployeeRecordProps } from "./IEmployeeRecord";
import {IEmployeeRecordState  } from "./IEmployeeRecordState";
import {sp,ItemAddResult} from "@pnp/sp";
import { Button } from 'office-ui-fabric-react/lib/Button';
import { TextField} from 'office-ui-fabric-react/lib/TextField';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { autobind, Checkbox, ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react';


export class EmployeeRecord extends React.Component<IEmployeeRecordProps,IEmployeeRecordState>{
    //handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    private options: any[] = [];
    private departmentOptions:any=[];

    constructor(props:IEmployeeRecordProps){
            super(props);
            this.state={fullName:this.props.fullName,addUsers:[],selectedItem:undefined, 
                selectedItemLookup :undefined,companyList:[],isPermanent:false,department:undefined }
            this.handleTextChange=this.handleTextChange.bind(this);
            this.handleSubmitButton=this.handleSubmitButton.bind(this);
            this._onCompanyChange=this._onCompanyChange.bind(this);
            this._onCompanyChangeLookup=this._onCompanyChangeLookup.bind(this);
            this._onControlledCheckboxChange=this._onControlledCheckboxChange.bind(this);
            this._onDepartmentChange=this._onDepartmentChange.bind(this);
            
            this.departmentOptions=[
                {
                  key: 'HR',
                  text: 'Human Resournce'
                },
                {
                  key: 'IT',
                  text: 'Information technology'
                },
                {
                  key: 'Security',
                  text: 'Security'
                },
                {
                  key: 'Others',
                  text: 'Others'
                }];
              

            this.GetListsItems().then((response)=>{
                for(let i=0;i<response.length;i++){
                    this.options.push({key:response[i].Id,text:response[i].Title});                
                }
                this.setState({companyList:this.options})
            }       
        );       
    }
    
     private GetListsItems():Promise<any>{
        return sp.web.lists.getByTitle("Company").items.get().then((data:any[]) => {
            console.log(data);
            return data;
        });    
      }

    
    
    private handleSubmitButton(event):void{
        
        console.log("button clicked"+this.state);
        sp.web.lists.getByTitle(this.props.listName).items.add({
            "Title":"TestTitle",
            "EmployeeName":this.state.fullName,
            "EmployeeListId": {   
                results: this.state.addUsers  
            } ,
            "EmployeeCompany1":this.state.selectedItem.text,
            "EmployeeCompanyId":this.state.selectedItemLookup.key,
            "Permanent":this.state.isPermanent,
            "Department":this.state.department==undefined?"": this.state.department.key
        }).then((iar: ItemAddResult) => {
            console.log(iar);
        }).catch(i=>console.log(i));
    }

    private handleTextChange(event){
        //this.setState({[event.target.name]:event.target.value});
        this.setState({fullName:event.target.value})

    }
    
    private _onCompanyChange(event,item:IDropdownOption){
        
        console.log('selected...' + item.key + ' ' + item.text + ' '+item.title + ' ' + item.selected);
        this.setState({ selectedItem: item });
        
    }
    private _onCompanyChangeLookup(event,item:IDropdownOption){
        
        console.log('selected...' + item.key + ' ' + item.text + ' '+item.title + ' ' + item.selected);
        this.setState({ selectedItemLookup: item });
        
    }
    private _onControlledCheckboxChange (event, checked: boolean) {
        this.setState({ isPermanent: checked! });
      };
    private _onDepartmentChange(event,deptOpt:IChoiceGroupOption){
        this.setState({department:deptOpt})
    }
    public async getInfo():Promise<any>{
        let data=await sp.web.select("Title","Description").get();
        return data;
      }

    @autobind
    private _getPeoplePickerItems(items: any[]) {
        console.log("test"+items);
        let addUsers1:string[];
        addUsers1=[];
        //this.state.addUsers.length = 0;
        for (let item in items)
        {   
            //console.log(items[item].id);
                addUsers1.push(items[item].id);
            
        }
        
        console.log(addUsers1);
        this.setState({addUsers:addUsers1});
        console.log(this.state.addUsers);
    }
      
    public render():React.ReactElement<IEmployeeRecordProps>{

        return(
            <div className={styles.empRecordContainer}>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg3">
                        <TextField label="Standard" name="fullName" 
                        value={this.state.fullName} onChange={this.handleTextChange}/>
                        </div>
                        <div className="ms-Grid-col ms-lg3">
                            <Dropdown
                                label="Company"
                                selectedKey={this.state.selectedItem ? this.state.selectedItem.key : undefined}
                                onChange={this._onCompanyChange}
                                //onChange={this._onCompanySelectChange}
                                placeholder="Select an option"
                                options={this.state.companyList}
                                styles={{ dropdown: { width: 300 } }}
                            />
                        </div>
                        <div className="ms-Grid-col ms-lg3">
                            <Dropdown
                                label="Lookup Company"
                                selectedKey={this.state.selectedItemLookup ? this.state.selectedItemLookup.key : undefined}
                                onChange={this._onCompanyChangeLookup}
                                //onChange={this._onCompanySelectChange}
                                placeholder="Select an option"
                                options={this.state.companyList}
                                styles={{ dropdown: { width: 300 } }}
                            />
                        </div>
                        <div className="ms-Grid-col ms-lg3">
                            <PeoplePicker
                                context={this.props.context}
                                titleText="People Picker"
                                personSelectionLimit={3}
                                groupName={""} // Leave this blank in case you want to filter from all users
                                showtooltip={true}
                                isRequired={true}
                                disabled={false}
                                ensureUser={true}
                                selectedItems={this._getPeoplePickerItems}
                                showHiddenInUI={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg6">
                        <Checkbox label="Permanent Employee" checked={this.state.isPermanent} onChange={this._onControlledCheckboxChange}   />
                        </div>
                        <div className="ms-Grid-col ms-lg6">
                        <ChoiceGroup  options={this.departmentOptions} onChange={this._onDepartmentChange}  />
                        </div>
                    </div>
                

                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg12">
                            <Button onClick={this.handleSubmitButton}>Submit</Button>
                        </div>
                    </div>
                    {/* <input type="text" value={this.state.firstName} onChange={this.handleChange}></input>
                        <button  onClick={this.handleSubmitClick}>Get Web Title</button>                     */}
                </div>
            </div>
        )
    }

}