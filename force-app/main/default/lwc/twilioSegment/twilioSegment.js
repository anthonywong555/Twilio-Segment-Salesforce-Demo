import { LightningElement, api } from 'lwc';

export default class TwilioSegment extends LightningElement {
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
  * Customer's Fields
  */
  @api customerName;
  @api customerTitle;
  @api customerImage;
  @api customerBackgroundImage;
}