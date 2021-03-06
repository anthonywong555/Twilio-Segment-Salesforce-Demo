import { LightningElement, track, api } from 'lwc';
import getTraits from '@salesforce/apex/TwilioSegmentProfileTraitsController.getTraits';
import getProfileTraitSettings from '@salesforce/apex/TwilioSegmentProfileTraitsController.getProfileTraitSettings';
export default class TwilioSegmentProfileTraits extends LightningElement {
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
  @track traits = [];

  columns = [
    { label: 'Trait', fieldName: 'label' },
    { label: 'Value', fieldName: 'value'}
  ];

  /**
   * Properties
   */
  // Errors
  errorMessage = '';
  hasError = false;

  // UI Elements
  isFetching = false;

  // Traits
  hasMore = false;
  cursor;
  traitsResponse;

  // Settings
  settings;

  // Component Lifecycle
  hasConnectedCallback = false;

  timer;

  async connectedCallback() {
    if(!this.hasConnectedCallback) {
      // Set Loading Wheel
      this.hasConnectedCallback = true;
      this.isFetching = true;

      try {
        // Get Settings
        this.settings = JSON.parse(await getProfileTraitSettings());

        // Get Segment Traits
        const traitsResponse = JSON.parse(await getTraits({
          recordId: this.recordId, 
          objectAPIName: this.objectApiName, 
          segmentIdentifierKey: this.segmentIdentifierKey, 
          segmentIdentifierValue: this.segmentIdentifierValue
        }));


        this.handleTraitsResponse(traitsResponse);

        if(this.isAutoFetch && this.autoFetchInMins > 0) {
          // Set Timeout
          const mins = this.autoFetchInMins * 60 * 1000;
          this.timer = setInterval(async() => {
            if(!this.errorMessage) {
              await this.handleAutoRefresh();
            }
          }, mins);
        }
      } catch(e) {
        this.handleError(e);
      }

      // Remove Loading Wheel
      this.isFetching = false;
    }
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }

  async handleAutoRefresh() {
    try {
      this.isFetching = true;

      // Get Segment Traits
      const traitsResponse = JSON.parse(await getTraits({
        recordId: this.recordId, 
        objectAPIName: this.objectApiName, 
        segmentIdentifierKey: this.segmentIdentifierKey, 
        segmentIdentifierValue: this.segmentIdentifierValue
      }));

      // Transform and Set Component Props
      this.handleTraitsResponse(traitsResponse);

      this.isFetching = false;

    } catch(e) {
      this.handleError(e);
    }
  }

  /**
   * 
   * @param {Object} traits 
   * @param {Array of Object} settings 
   * @returns 
   */
  transformTraits(traits, settings) {
    let transformTraits;

    if(settings.length > 0) {
      const filterSettings = settings.filter((aSetting) => traits[aSetting.Key__c]);
      transformTraits = filterSettings.map((aSetting) => {
        return {
          key: `${aSetting.Id}`,
          label: `${aSetting.MasterLabel}`,
          value: `${traits[aSetting.Key__c]}`
        };
      });
    } else {
      const traitsKeys = Object.keys(traits);
      transformTraits = traitsKeys.map((aKey) => {
        return {
          key: `${aKey}-${traits[aKey]}`,
          label: `${aKey}`,
          value: `${traits[aKey]}`
        };
      })
    }

    return transformTraits;
  }


  handleError(e) {
    const segmentErrorMsg = e.message ? e.message : e.body.message;
    this.errorMessage = segmentErrorMsg == 'the resource was not found' ? `No Twilio Segment Persona's Traits was found for this record.` : segmentErrorMsg;
    this.hasError = true;
    this.isFetching = false;
  }

  handleTraitsResponse(traitsResponse) {
    // Check to see if Event Response has all the correct data

    if(traitsResponse.error) {
      // Otherwise throw an error
      throw traitsResponse.error;
    }

    // Set Properties
    this.traitsResponse = traitsResponse;
    this.cursor = traitsResponse.cursor;
    this.hasMore = traitsResponse.cursor.has_more;

    this.traits = this.transformTraits(traitsResponse.traits, this.settings);
  }
}