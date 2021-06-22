public with sharing class TwilioSegmentServices {

    @TestVisible
    private static Twilio_Segment_Profile_Credential__mdt credential {
        get {
            if(credential == null) {
                List<Twilio_Segment_Profile_Credential__mdt> credentials = [
                    SELECT Access_Token__c, Space_Id__c
                    FROM Twilio_Segment_Profile_Credential__mdt
                ];

                if(credentials.isEmpty()) {
                    if(Test.isRunningTest()) {
                        credential = new Twilio_Segment_Profile_Credential__mdt();
                        return credential;
                    } else {
                        throw new TwilioSegmentException('Missing a Twilio Segment Profile Credential.');
                    }
                } else {
                    credential = credentials[0];
                }
            }
            return credential;
        }

        private set;
    }

    @TestVisible
    private static final String HTTP_METHOD_GET = 'GET';

    public static TwilioSegmentProfileEventResponse getProfileEvents(String identifierKey, String identifierValue) {
        String spaceId = credential.Space_Id__c;
        String identity = identifierKey + ':' + identifierValue;
        String uri = generateURI(spaceId, identity);
        return performRequest(uri);
    }

    @TestVisible
    private static String generateURI(String spaceId, String identity) {
        String uri = 
            'https://profiles.segment.com/v1/spaces/' + 
            spaceId + 
            '/collections/users/profiles/' + 
            identity + 
            '/events?limit=20';

        return uri;
    }

    public static TwilioSegmentProfileEventResponse getProfileEvents(String cursorUrl) {
        return performRequest(cursorUrl);
    }

    private static TwilioSegmentProfileEventResponse performRequest(String uri) {
        // Generate Authorization Header
        String username = credential.Access_Token__c;
        Blob headerValue = Blob.valueOf(username + ':');
        String authorizationHeader = 'Basic ' + EncodingUtil.base64Encode(headerValue);

        // Generate Request
        Http http = new Http();
        HTTPRequest request = new HTTPRequest();
        request.setEndpoint(uri);
        request.setHeader('Authorization', authorizationHeader);
        request.setMethod(HTTP_METHOD_GET);

        // Perform Request
        HTTPResponse response = http.send(request);
        return TwilioSegmentProfileEventResponse.parse(response.getBody());
    }

    public class TwilioSegmentException extends Exception {}
}