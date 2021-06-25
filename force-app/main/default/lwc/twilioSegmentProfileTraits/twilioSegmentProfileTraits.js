import { LightningElement, api} from 'lwc';

export default class TwilioSegmentProfileTraits extends LightningElement {
  @api recordId;
  @api objectApiName;
  @api segmentIdentifierKey;
  @api segmentIdentifierValue;
}