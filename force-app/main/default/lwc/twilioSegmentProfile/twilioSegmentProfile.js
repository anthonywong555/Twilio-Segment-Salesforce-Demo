import { LightningElement, api, wire } from 'lwc';
import getCustomerDetails from '@salesforce/apex/TwilioSegmentProfileController.getCustomerDetails';

export default class TwilioSegmentProfile extends LightningElement {
  /**
   * API
   */
  @api recordId;
  @api objectApiName;

  /**
  * Customer's Fields
  */
  @api customerName = null;
  @api customerTitle = null;
  @api customerImage = null;
  @api customerBackgroundImage = null;

  /**
   * Properties
   */
  // Errors
  errorMessage = '';
  hasError = false;
  
  // Component Lifecycle
  hasConnectedCallback = false;

  // UI Elements
  isFetching = false;

  async connectedCallback() {
    if(!this.hasConnectedCallback) {
      try {
        this.hasConnectedCallback = true;
        this.isFetching = !this.isFetching;
        if(this.hasAllFields) {
          // Fetch SObject Records
          const customerResponse = JSON.parse(await getCustomerDetails({
            recordId: this.recordId,
            objectApiName: this.objectApiName,
            customerNameField: this.customerName,
            customerTitleField: this.customerTitle,
            customerImageField: this.customerImage,
            customerBackgroundImageField: this.customerBackgroundImage
          }));
          
          this.customerName = customerResponse[this.customerName];
          this.customerTitle = customerResponse[this.customerTitle];
          this.customerImage = customerResponse[this.customerImage];
          this.customerBackgroundImage = customerResponse[this.customerBackgroundImage];
        }
        this.isFetching = !this.isFetching;
      } catch(e) {
        this.handleError(e);
      }
    }
  }

  handleError(e) {
    this.errorMessage = e.message ? e.message : e.body.message;
    this.hasError = true;
    this.isFetching = false;
  }

  get hasAllFields() {
    return this.customerName && this.customerTitle && this.customerImage && this.customerBackgroundImage;
  }

  get backgroundImage() {
    return `
    background-repeat: no-repeat;
    background-color: white;
    background-size: 100% 55%;
    background-image: url('${this.customerBackgroundImage}');
    `;
  }
}