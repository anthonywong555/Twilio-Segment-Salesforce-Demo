public with sharing class TwilioSegmentProfileEventsController {
    
    @AuraEnabled(cacheable=true)
    public static string getEvents(String recordId, String objectAPIName, String segmentIdentifierKey, String segmentIdentifierValue) {
        try {
            String dynamicSOQL = 'SELECT Id, ' + segmentIdentifierValue + ' FROM ' + objectAPIName + ' WHERE Id =: recordId';
            String safeQuery = String.escapeSingleQuotes(dynamicSOQL);
            System.debug(safeQuery);
            List<sObject> sObjects = Database.query(safeQuery);
            String results = '{}';
            if(!sObjects.isEmpty()) {
                sObject targetSObject = sObjects[0];
                String value = (String)targetSObject.get(segmentIdentifierValue);
                TwilioSegmentProfileEventResponse aResponse = TwilioSegmentServices.getProfileEvents(segmentIdentifierKey, value);
                results = aResponse.json;
            }

            return results;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static string loadMore(String cursorUrl) {
        try {
            TwilioSegmentProfileEventResponse aResponse = TwilioSegmentServices.getProfileEvents(cursorUrl);
            String results = aResponse.json;
            return results;
        } catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}