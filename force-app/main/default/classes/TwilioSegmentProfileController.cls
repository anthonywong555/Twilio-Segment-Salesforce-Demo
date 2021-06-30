public with sharing class TwilioSegmentProfileController {
    @AuraEnabled(cacheable=true)
    public static String getCustomerDetails(
        String recordId,
        String objectApiName,
        String customerNameField,
        String customerTitleField,
        String customerImageField,
        String customerBackgroundImageField
    ) {
        try {
            Set<String> soqlFields = new Set<String>{customerNameField, customerTitleField, customerImageField, customerBackgroundImageField};
            soqlFields.remove(null);
            
            String dynamicSOQL = 'SELECT Id, ' + String.join(new List<String>(soqlFields), ',') + ' FROM ' + objectAPIName + ' WHERE Id =: recordId';
            String safeQuery = String.escapeSingleQuotes(dynamicSOQL);
            List<sObject> sObjects = Database.query(safeQuery);
            String results = '{}';
            if(!sObjects.isEmpty()) {
                sObject targetSObject = sObjects[0];
                results = JSON.serialize(targetSObject);
            }

            return results;
        } catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}