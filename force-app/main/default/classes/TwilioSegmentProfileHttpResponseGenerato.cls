@isTest
public with sharing class TwilioSegmentProfileHttpResponseGenerato implements HttpCalloutMock{
    public static final String TEST_ID_KEY = 'phone';
    public static final String TEST_ID_VALUE = '+1555555555';
    public static final String TEST_SPACE_ID = TwilioSegmentServices.credential.Space_Id__c;
    public static final String TEST_JSON = '{'+
            '   \"data\":['+
            '      {'+
            '         \"type\":\"track\",'+
            '         \"source_id\":\"XXX\",'+
            '         \"message_id\":\"XXXX\",'+
            '         \"timestamp\":\"2021-06-12T21:02:25.283Z\",'+
            '         \"properties\":{'+
            '            \"active_web_users\":false,'+
            '            \"audience_key\":\"active_web_users\"'+
            '         },'+
            '         \"event\":\"Test Event\"'+
            '      }'+
            '   ],'+
            '   \"cursor\":{'+
            '      \"url\":\"https://profiles.segment.com/v1/spaces/XXX/collections/users/\",'+
            '      \"has_more\":true,'+
            '      \"next\":\"XXX\",'+
            '      \"limit\":10'+
            '   }'+
            '}';

    public HTTPResponse respond(HTTPRequest req) {
        String uri = req.getEndpoint();
        String expectedURI = TwilioSegmentServices.generateURI(TEST_SPACE_ID, TEST_ID_KEY + ':' + TEST_ID_VALUE);
        System.assertEquals(expectedURI, uri, 'We expect the URI to match.');
        System.assertEquals(TwilioSegmentServices.HTTP_METHOD_GET, req.getMethod(), 'We expect HTTP METHOD is GET');
        
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody(TEST_JSON);
        res.setStatusCode(200);
        return res;
    }
}
