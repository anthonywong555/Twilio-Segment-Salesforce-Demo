public with sharing class TwilioSegmentServices {
    
    public static TwilioSegmentProfileEventResponse getProfileEvents(String identifierKey, String identifierValue) {
        String spaceId = System.Label.Twilio_Segment_Space_Id;
        String identity = identifierKey + ':' + identifierValue;
        String uri = 
            'https://profiles.segment.com/v1/spaces/' + 
            spaceId + 
            '/collections/users/profiles/' + 
            identity + 
            '/events?limit=20';
       	String username = System.Label.Twilio_Segment_Access_Token;
        Http http = new Http();
        HTTPRequest request = new HTTPRequest();
        request.setEndpoint(uri);
        Blob headerValue = Blob.valueOf(username + ':');
        String authorizationHeader = 'Basic ' + EncodingUtil.base64Encode(headerValue);
        request.setHeader('Authorization', authorizationHeader);
        request.setMethod('GET');
        HTTPResponse response = http.send(request);
        return TwilioSegmentProfileEventResponse.parse(response.getBody());
    }

    public static TwilioSegmentProfileEventResponse getProfileEvents(String cursorUrl) {
       	String username = System.Label.Twilio_Segment_Access_Token;
        Http http = new Http();
        HTTPRequest request = new HTTPRequest();
        request.setEndpoint(cursorUrl);
        Blob headerValue = Blob.valueOf(username + ':');
        String authorizationHeader = 'Basic ' + EncodingUtil.base64Encode(headerValue);
        request.setHeader('Authorization', authorizationHeader);
        request.setMethod('GET');
        HTTPResponse response = http.send(request);
        return TwilioSegmentProfileEventResponse.parse(response.getBody());
    }
}