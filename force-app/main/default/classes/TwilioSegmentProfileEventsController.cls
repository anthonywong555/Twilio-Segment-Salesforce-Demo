public with sharing class TwilioSegmentProfileEventsController {

    @AuraEnabled(cacheable=true)
    public static String getSettings() {
        try {
            // Only load active Twilio Segment Events Settings.
            Map<Id, Twilio_Segment_Event__mdt> events = new Map<Id, Twilio_Segment_Event__mdt>([
                SELECT Id, MasterLabel, Event_Name__c, Icon__c, isVisible__c
                FROM Twilio_Segment_Event__mdt
                WHERE isActive__c = true
            ]);

            Set<Id> eventIds = events.keySet();

            List<Twilio_Segment_Event_Property__mdt> properties = [
                SELECT MasterLabel, Key__c, Order__c, Twilio_Segment_Event__r.Id
                FROM Twilio_Segment_Event_Property__mdt
                WHERE Twilio_Segment_Event__r.Id IN: eventIds
                ORDER BY Order__c ASC
            ];

            Map<Id, List<Twilio_Segment_Event_Property__mdt>> eventIdToProps = new Map<Id, List<Twilio_Segment_Event_Property__mdt>>();
            
            // Generate eventIdToProps
            for(Twilio_Segment_Event_Property__mdt aProp : properties) {
                List<Twilio_Segment_Event_Property__mdt> props = 
                    eventIdToProps.containsKey(aProp.Twilio_Segment_Event__r.Id) ? 
                    eventIdToProps.get(aProp.Twilio_Segment_Event__r.Id) : 
                    new List<Twilio_Segment_Event_Property__mdt>();
                
                props.add(aProp);

                eventIdToProps.put(aProp.Twilio_Segment_Event__r.Id, props);
            }

            // Generate List<Setting>
            List<Setting> settings = new List<Setting>();
            for(Id eventId : eventIds) {
                Twilio_Segment_Event__mdt aEvent = events.get(eventId);
                List<Twilio_Segment_Event_Property__mdt> props = 
                    eventIdToProps.containsKey(eventId) ? 
                    eventIdToProps.get(eventId) : 
                    new List<Twilio_Segment_Event_Property__mdt>();
                
                Setting aSetting = new Setting(aEvent, props);
                settings.add(aSetting);
            }
            //return settings;
            return JSON.serialize(settings);
        } catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class Setting {
        public Twilio_Segment_Event__mdt event;
        public List<Twilio_Segment_Event_Property__mdt> properties;

        public Setting(Twilio_Segment_Event__mdt event, List<Twilio_Segment_Event_Property__mdt> properties) {
            this.event = event;
            this.properties = properties;
        }
    }

    @AuraEnabled(cacheable=true)
    public static string getEvents(String recordId, String objectAPIName, String segmentIdentifierKey, String segmentIdentifierValue) {
        try {
            String dynamicSOQL = 'SELECT Id, ' + segmentIdentifierValue + ' FROM ' + objectAPIName + ' WHERE Id =: recordId';
            String safeQuery = String.escapeSingleQuotes(dynamicSOQL);
            List<sObject> sObjects = Database.query(safeQuery);
            String results = '{}';
            if(!sObjects.isEmpty()) {
                sObject targetSObject = sObjects[0];
                String value = (String)targetSObject.get(segmentIdentifierValue);
                results = TwilioSegmentServices.getProfileEvents(segmentIdentifierKey, value).json;
            }

            return results;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static string loadMore(String cursorUrl) {
        try {
            String results = TwilioSegmentServices.getProfileEvents(cursorUrl).json;
            return results;
        } catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}