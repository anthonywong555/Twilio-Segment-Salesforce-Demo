import { LightningElement, api } from 'lwc';

export default class TwilioSegmentProfile extends LightningElement {
  /**
   * API
   */
   @api recordId;
   @api objectApiName;
   @api segmentIdentifierKey;
   @api segmentIdentifierValue;
   
   @api isAutoFetch = false;
   @api autoFetchInMins = 1;
}