public with sharing class TwilioSegmentServices {

    @TestVisible
    private static final String HTTP_METHOD_GET = 'GET';

    public static String getProfileEvents(String identifierKey, String identifierValue) {
        String spaceId = System.Label.Twilio_Segment_Space_Id;
        String identity = identifierKey + ':' + identifierValue;
        String uri = 
            'https://profiles.segment.com/v1/spaces/' + 
            spaceId + 
            '/collections/users/profiles/' + 
            identity + 
            '/events?limit=20';
        return performRequest(uri);
    }

    public static String getProfileEvents(String cursorUrl) {
        return performRequest(cursorUrl);
    }

    private static String performRequest(String uri) {
        // Generate Authorization Header
        String username = System.Label.Twilio_Segment_Access_Token;
        Blob headerValue = Blob.valueOf(username + ':');
        String authorizationHeader = 'Basic ' + EncodingUtil.base64Encode(headerValue);

        // Generate Request
        Http http = new Http();
        HTTPRequest request = new HTTPRequest();
        request.setEndpoint(uri);
        request.setHeader('Authorization', authorizationHeader);
        request.setMethod('GET');

        // Perform Request
        HTTPResponse response = http.send(request);
        return response.getBody();
    }
}