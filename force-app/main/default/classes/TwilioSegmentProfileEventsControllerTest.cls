@isTest
private class TwilioSegmentProfileEventsControllerTest {
    
    static void setup() {
        // Setup Mock
        Test.setMock(HttpCalloutMock.class, new TwilioSegmentProfileHttpResponseGenerato());
    }

    @isTest
    static void testGetSettings() {
        String result = null;

        Test.startTest();
            result = TwilioSegmentProfileEventsController.getSettings();
        Test.stopTest();

        System.assert(String.isNotBlank(result), 'We assume that the result is not an empty string.');
    }

    @isTest
    static void testGetEvents() {
        setup();

        // Insert a Record
        Contact aContact = new Contact();
        aContact.LastName = 'Twilio';
        aContact.MobilePhone = TwilioSegmentProfileHttpResponseGenerato.TEST_ID_VALUE;

        insert aContact;
        
        // Get the Events
        String results;

        Test.startTest();
            results = TwilioSegmentProfileEventsController.getEvents(
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

    @isTest
    static void testLoadMore() {
        setup();

        // Generate a cursorUrl
        String cursorUrl = TwilioSegmentServices.generateURI(
            TwilioSegmentProfileHttpResponseGenerato.TEST_SPACE_ID, 
            TwilioSegmentProfileHttpResponseGenerato.TEST_ID_KEY + ':' + TwilioSegmentProfileHttpResponseGenerato.TEST_ID_VALUE,
            TwilioSegmentServices.EVENTS_ROUTE,
            TwilioSegmentServices.EVENTS_LIMITS
        );

        String results;

        Test.startTest();
            results = TwilioSegmentProfileEventsController.loadMore(cursorUrl);
        Test.stopTest();

        System.assert(String.isNotBlank(results), 'We assume that the result is not an empty string.');
        System.assertEquals(
            TwilioSegmentProfileHttpResponseGenerato.TEST_JSON, 
            results, 
            'We expect the result.json to match.'
        );
    }
}
