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
        Http h = new Http();
        HTTPRequest r = new HTTPRequest();
        r.setEndpoint(uri);
        Blob headerValue = Blob.valueOf(username + ':');
        String authorizationHeader = 'BASIC ' + EncodingUtil.base64Encode(headerValue);
        r.setHeader('Authorization', authorizationHeader);
        r.setMethod('GET');
        HTTPResponse resp = h.send(r);
        return TwilioSegmentProfileEventResponse.parse(resp.getBody());
    }
    
    public static TwilioSegmentProfileEventResponse getProfileEvents(String phoneNumber) {
        return getProfileEvents('phone', phoneNumber);
    }
}