@isTest
private class TwilioSegmentProfileControllerTest {
    
    @isTest
    static void testGetCustomerDetails() {
        // Insert a record
        Contact testContact = new Contact();
        testContact.LastName = 'Twilio';
        testContact.MobilePhone = TwilioSegmentProfileHttpResponseGenerato.TEST_ID_VALUE;
        insert testContact;

        String result;

        // Get the record
        Test.startTest();
            result = TwilioSegmentProfileController.getCustomerDetails(
                testContact.Id,
                'Contact',
                'Name',
                'Title',
                'MobilePhone',
                'LastName'
            );
        Test.stopTest();
        // Test the record.
        System.assert(String.isNotBlank(result), 'We assume that the result is not an empty string.');
    }
}