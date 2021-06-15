import { LightningElement, api } from 'lwc';

export default class TwilioSegementProfileEventItem extends LightningElement {
  buttonClicked;
  cssClasses = "slds-timeline__item_expandable slds-timeline__item_email to-expand";

  @api icon;
  @api title;
  @api timestamp;
  @api properties;

  handleClick(event) {
    this.buttonClicked = !this.buttonClicked;
    this.cssClasses = this.buttonClicked
      ? "slds-timeline__item_expandable slds-timeline__item_email to-expand slds-is-open"
      : "slds-timeline__item_expandable slds-timeline__item_email to-expand";
  }
}