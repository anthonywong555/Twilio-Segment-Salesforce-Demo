import { LightningElement, wire } from 'lwc';
import getEvents from '@salesforce/apex/TwilioSegmentProfileEventsController.getEvents';

export default class TwilioSegmentProfileEvents extends LightningElement {
  events;
  data;
  buttonClicked;
  cssClasses = "slds-timeline__item_expandable slds-timeline__item_email to-expand";

  @wire(getEvents)
  wiredEvents({ error, data }) {
    if(data) {
      console.log(
        `%cData!`,
        "color:red;font-family:system-ui;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold"
      );
      this.events = JSON.parse(data);
      this.data = this.events.data;
      console.log(this.events);
    } else if(error) {
      console.error(
        `%cError!`,
        "color:red;font-family:system-ui;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold"
      );
      console.error(error);
    }
  }

  handleClick(event) {
    this.buttonClicked = !this.buttonClicked;
    this.cssClasses = this.buttonClicked
      ? "slds-timeline__item_expandable slds-timeline__item_email to-expand slds-is-open"
      : "slds-timeline__item_expandable slds-timeline__item_email to-expand";
  }
}