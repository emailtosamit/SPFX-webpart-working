import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';

import * as strings from 'EmployeeWebPartStrings';
import Employee from './components/Employee';
import { IEmployeeProps } from './components/IEmployeeProps';
import { sp } from "@pnp/sp";


export interface IEmployeeWebPartProps {
  listName: string;
  pageTitle:string;
}

export default class EmployeeWebPart extends BaseClientSideWebPart<IEmployeeWebPartProps> {

  private lists: IPropertyPaneDropdownOption[];
  private listsDropdownDisabled: boolean = true;

  private loadList(){

  }

  public onInit(): Promise<void> {
    this.lists = [];
    
    return super.onInit().then(_ => {
  
      // other init code may be present
  
      sp.setup({
        spfxContext: this.context
      });
    });
  }
  
  protected onPropertyPaneConfigurationStart():void{
    if(this.lists.length>0)return;

    // this.context.statusRenderer.displayLoadingIndicator(this.domElement, "lists");

    this.GetLists().then((response)=>{
      for(let i=0;i<response.length;i++){
        this.lists.push({key:response[i].Title,text:response[i].Title})
      }
      
      this.listsDropdownDisabled=false;
      this.context.propertyPane.refresh();

      // this.context.statusRenderer.clearLoadingIndicator(this.domElement);
      // this.render();
    });
  }

  private GetLists():Promise<any>{
    return sp.web.lists.filter('Hidden eq false').get().then((data)=>
      {
        console.log("Total number of list"+data.length)
        return data;
      }    
    )

  }

  public render(): void {
    const element: React.ReactElement<IEmployeeProps > = React.createElement(
      Employee,
      {
        listName: this.properties.listName,
        pageTitle: this.properties.pageTitle,
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  // protected get disableReactivePropertyChanges(): boolean {
  //   return true;
  // }
  
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('pageTitle', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneDropdown('listName', {
                  label: strings.ListNameFieldLabel,
                  options: this.lists,
                  disabled: this.listsDropdownDisabled
                })
                
              ]
            }
          ]
        }
      ]
    };
  }
}
