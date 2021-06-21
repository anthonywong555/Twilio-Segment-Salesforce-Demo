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
  
  @api isAutoFetch = false;
  @api autoFetchInMins = 1;

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

  timer;

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

        if(this.isAutoFetch && this.autoFetchInMins > 0) {
          // Set Timeout
          const mins = this.autoFetchInMins * 60 * 1000;
          this.timer = setInterval(async() => {
            await this.handleAutoRefresh();
          }, mins);
        }
      } catch(e) {
        this.handleError(e);
      }

      // Remove Loading Wheel
      this.isFetching = !this.isFetching;
    }
  }

  async handleAutoRefresh() {
    try {
      console.log(
        "%cHandle Auto Refresh!",
        "color:red;font-family:system-ui;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold"
      );
      this.isFetching = !this.isFetching;

      // Get Segment Events
      const eventResponse = JSON.parse(await getEvents({
        recordId: this.recordId, 
        objectAPIName: this.objectApiName, 
        segmentIdentifierKey: this.segmentIdentifierKey, 
        segmentIdentifierValue: this.segmentIdentifierValue
      }));

      // Transform and Set Component Props
      this.handleEventResponse(eventResponse);

      this.isFetching = !this.isFetching;

    } catch(e) {
      this.handleError(e);
    }
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }

  handleEventResponse(eventResponse) {
    // Set Properties
    this.eventResponse = eventResponse;
    this.cursor = eventResponse.cursor;
    this.hasMore = eventResponse.cursor.has_more;

    // Transform Segment Events based on Settings
    const tEvents = transformEvents(eventResponse.data, this.settings);

    console.log(`tEvents`, tEvents);

    // Check to see if tEvents is duplicate in this.events based on key
    const filterTEvents = tEvents.filter(anEvent => {
      const result = this.events.find((currentEvent) => {
        return anEvent.key === currentEvent.key;
      });

      return result == undefined;
    });

    console.log(`filterTEvents`, filterTEvents);

    if(filterTEvents.length > 0) {
      // Add to this.event 
      this.events = this.events.concat(filterTEvents);

      // Sort it by createdDate
      this.events.sort((a, b) => {
        return a.createdDate >= b.createdDate;
      });

      console.log(`this.events`, this.events);
    }
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