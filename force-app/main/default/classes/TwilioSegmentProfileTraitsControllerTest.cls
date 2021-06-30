@isTest
private class TwilioSegmentProfileTraitsControllerTest {
    static void setup() {
        // Setup Mock
        Test.setMock(HttpCalloutMock.class, new TwilioSegmentProfileHttpResponseGenerato());
    }

    @isTest
    static void testGetProfileTraitSettings() {
        String result = null;

        Test.startTest();
            result = TwilioSegmentProfileTraitsController.getProfileTraitSettings();
        Test.stopTest();

        System.assert(String.isNotBlank(result), 'We assume that the result is not an empty string.');
    }

    @isTest
    static void testGetTraits() {
        setup();

        // Insert a Record
        Contact aContact = new Contact();
        aContact.LastName = 'Twilio';
        aContact.MobilePhone = TwilioSegmentProfileHttpResponseGenerato.TEST_ID_VALUE;

        insert aContact;
        
        // Get the Events
        String results;

        Test.startTest();
            results = TwilioSegmentProfileTraitsController.getTraits(
                aContact.Id,
                'Contact',
                'phone',
                'MobilePhone'
            );
        Test.stopTest();

        System.assert(String.isNotBlank(results), 'We assume that the result is not an empty string.');
        System.assertEquals(
            TwilioSegmentProfileHttpResponseGenerato.TEST_JSON, 
            results, 
            'We expect the result.json to match.'
        );
    }
}
