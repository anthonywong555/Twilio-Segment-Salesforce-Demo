@isTest
private class TwilioSegmentServicesTest {

    static void setup() {
        // Setup Mock
        Test.setMock(HttpCalloutMock.class, new TwilioSegmentProfileHttpResponseGenerato());
    }

    @isTest
    static void testGetProfileEvents() {
        setup();
        
        TwilioSegmentProfileEventResponse result;

        Test.startTest();
            result = TwilioSegmentServices.getProfileEvents(
                TwilioSegmentProfileHttpResponseGenerato.TEST_ID_KEY, 
                TwilioSegmentProfileHttpResponseGenerato.TEST_ID_VALUE);
        Test.stopTest();

        System.assertNotEquals(null, result, 'We expect the result to not be null.');
        System.assertEquals(
            TwilioSegmentProfileHttpResponseGenerato.TEST_JSON, 
            result.json, 
            'We expect the result.json to match.'
        );
    }

    @isTest
    static void testGetProfileEventsWithCursorUrl() {
        setup();
        
        // Generate a cursorUrl
        String cursorUrl = TwilioSegmentServices.generateURI(
            TwilioSegmentProfileHttpResponseGenerato.TEST_SPACE_ID, 
            TwilioSegmentProfileHttpResponseGenerato.TEST_ID_KEY + ':' + TwilioSegmentProfileHttpResponseGenerato.TEST_ID_VALUE,
            TwilioSegmentServices.EVENTS_ROUTE,
            TwilioSegmentServices.EVENTS_LIMITS
        );

        TwilioSegmentProfileEventResponse result;

        Test.startTest();
            result = TwilioSegmentServices.getProfileEvents(cursorUrl);
        Test.stopTest();

        System.assertNotEquals(null, result, 'We expect the result to not be null.');
        System.assertEquals(
            TwilioSegmentProfileHttpResponseGenerato.TEST_JSON, 
            result.json, 
            'We expect the result.json to match.'
        );
    }
}