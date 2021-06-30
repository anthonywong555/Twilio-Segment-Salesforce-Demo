public with sharing class TwilioSegmentProfileTraitsController {
    @AuraEnabled(cacheable=true)
    public static String getProfileTraitSettings() {
        try {
            List<Twilio_Segment_Trait_Property__mdt> traitSettings = [
                SELECT Id, MasterLabel, Key__c, Order__c
                FROM Twilio_Segment_Trait_Property__mdt
                ORDER BY Order__c NULLS LAST
            ];

            return JSON.serialize(traitSettings);
        } catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static string getTraits(String recordId, String objectAPIName, String segmentIdentifierKey, String segmentIdentifierValue) {
        try {
            String dynamicSOQL = 'SELECT Id, ' + segmentIdentifierValue + ' FROM ' + objectAPIName + ' WHERE Id =: recordId';
            String safeQuery = String.escapeSingleQuotes(dynamicSOQL);
            List<sObject> sObjects = Database.query(safeQuery);
            String results = '{}';
            if(!sObjects.isEmpty()) {
                sObject targetSObject = sObjects[0];
                String value = (String)targetSObject.get(segmentIdentifierValue);
                results = TwilioSegmentServices.getProfileTraits(segmentIdentifierKey, value).json;
            }

            return results;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}