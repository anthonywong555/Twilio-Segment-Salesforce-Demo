import { LightningElement, wire, track, api } from 'lwc';
import twilioSegmentLogoURL from '@salesforce/resourceUrl/Twilio_Segment_Logo';
import getEvents from '@salesforce/apex/TwilioSegmentProfileEventsController.getEvents';
import loadMore from '@salesforce/apex/TwilioSegmentProfileEventsController.loadMore';
import getSettings from '@salesforce/apex/TwilioSegmentProfileEventsController.getSettings';

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

  /**
   * Transform the Event Data Based on Settings to be consume in the front end.
   * @param {Array of Events} events 
   * @param {Objects} settings 
   * @returns {Array of Events}
   */
  transformEvents(events, settings) {
    let modifyEvents = events.map((aEvent) => {
      const relatedSetting = settings.find((aSetting) => {
        const {event} = aSetting;
        const {Event_Name__c} = event;
        return Event_Name__c === aEvent.event;
      });

      return this.transformEvent(aEvent, relatedSetting);
    });

    // Remove Empty Object from the Array.
    modifyEvents = modifyEvents.filter(aEvent => Object.keys(aEvent).length > 0);
    return modifyEvents;
  }

  transformEvent(targetEvent, targetSetting) {
    const targetSettingProps = targetSetting ? targetSetting.properties : null;
    const targetEventProps = targetEvent.properties;
    if(targetSetting && !targetSetting.event.isVisible__c) {
      return {};
    }

    const title = 
      (targetSetting && targetSetting.event.isVisible__c) ?
      targetSetting.event.MasterLabel : targetEvent.event;

    const icon = 
      (targetSetting && targetSetting.event.isVisible__c) ?
      targetSetting.event.Icon__c : "standard:account";

    // Format Timestamp
    const timestamp = new Date(targetEvent.timestamp);
    const date = `${timestamp.getMonth()}/${timestamp.getDay()}/${timestamp.getFullYear()}`;
    const time = timestamp.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    const {message_id} = targetEvent;
    const properties = this.transformEventProps(targetEventProps, targetSettingProps);

    return {
      title,
      icon,
      properties,
      message_id,
      timestamp: `${time} | ${date}`,
    };
  }

  transformEventProps(targetEventProps, targetSettingProps) {
    if(targetSettingProps && targetSettingProps.length > 0) {
      const results = [];

      for(const aPropSetting of targetSettingProps) {
        const {Key__c, MasterLabel} = aPropSetting;
        results.push({
          key: MasterLabel,
          value: targetEventProps[Key__c],
          id: `${Key__c}${MasterLabel}${Math.random()}`
        })
      }

      return results;
    } else {
      return Object.entries(targetEventProps).map(([key, value]) => {
        return {
          key,
          value,
          id: `${key}${value}${Math.random()}`
        }
      });
    }
  }

  handleEventResponse(eventResponse) {
    // Set Properties
    this.eventResponse = eventResponse;
    this.cursor = eventResponse.cursor;
    this.hasMore = eventResponse.cursor.has_more;

    // Transform Segment Events based on Settings
    this.events = this.events.concat(this.transformEvents(eventResponse.data, this.settings));
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

  getIcon(eventName) {

  }
}