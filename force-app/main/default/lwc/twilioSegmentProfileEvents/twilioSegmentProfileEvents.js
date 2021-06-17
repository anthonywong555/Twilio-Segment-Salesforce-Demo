import { LightningElement, track, api } from 'lwc';
import twilioSegmentLogoURL from '@salesforce/resourceUrl/Twilio_Segment_Logo';
import getEvents from '@salesforce/apex/TwilioSegmentProfileEventsController.getEvents';
import loadMore from '@salesforce/apex/TwilioSegmentProfileEventsController.loadMore';
import getSettings from '@salesforce/apex/TwilioSegmentProfileEventsController.getSettings';

import {transformEvents} from 'c/twilioSegmentProfileEventsProcessor';

export default class TwilioSegmentProfileEvents extends LightningElement {
  /**
   * API
   */
  @api recordId;
  @api objectApiName;
  @api segmentIdentifierKey;
  @api segmentIdentifierValue;
  @api autofetch = 0;

  /**
   * Track
   */
  //@track data = [];
  @track events = [];

  /**
   * Properties
   */
  // Errors
  errorMessage = '';
  hasError = false;

  // UI Elements
  isFetching = false;
  twilioSegmentLogoURL = twilioSegmentLogoURL;
  cssClasses = "slds-timeline__item_expandable slds-timeline__item_email to-expand";
  
  // Events
  hasMore = false;
  cursor;
  eventResponse;

  // Settings
  settings;

  // Compoment Lifecycle
  hasConnectedCallback = false;

  async connectedCallback() {
    if(!this.hasConnectedCallback) {
      // Set Loading Wheel
      this.hasConnectedCallback = true;
      this.isFetching = !this.isFetching;

      try {
        // Get Settings
        this.settings = JSON.parse(await getSettings());

        // Get Segment Events
        const eventResponse = JSON.parse(await getEvents({
          recordId: this.recordId, 
          objectAPIName: this.objectApiName, 
          segmentIdentifierKey: this.segmentIdentifierKey, 
          segmentIdentifierValue: this.segmentIdentifierValue
        }));

        // Transform and Set Component Props
        this.handleEventResponse(eventResponse);
      } catch(e) {
        this.handleError(e);
      }

      // Remove Loading Wheel
      this.isFetching = !this.isFetching;
    }
  }

  handleEventResponse(eventResponse) {
    // Set Properties
    this.eventResponse = eventResponse;
    this.cursor = eventResponse.cursor;
    this.hasMore = eventResponse.cursor.has_more;

    // Transform Segment Events based on Settings
    this.events = this.events.concat(transformEvents(eventResponse.data, this.settings));
    console.log(`this.events`, this.events);
  }

  handleError(e) {
    this.errorMessage = e.message ? e.message : e.body.message;
    this.hasError = true;
    this.isFetching = false;
  }

  async handleScroll(event) {
    const area = this.template.querySelector('.scrollArea');
    const threshold = 2 * event.target.clientHeight;
    const areaHeight = area.clientHeight;
    const scrollTop = event.target.scrollTop;

    if(areaHeight - threshold < scrollTop && this.hasMore && !this.isFetching) {
      // Set Loading Wheel
      this.isFetching = !this.isFetching;

      // Get More Data
      await this.handleMoreFetch();
    }
  }

  async handleMoreFetch() {
    try {
      const {url} = this.cursor;
      const eventResponse = JSON.parse(await loadMore({ cursorUrl: url }));
      this.handleEventResponse(eventResponse);
    } catch(e) {
      this.handleError(e);
    }

    // Remove Loading Wheel
    this.isFetching = !this.isFetching;
  }
}