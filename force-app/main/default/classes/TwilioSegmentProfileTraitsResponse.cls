public with sharing class TwilioSegmentProfileTraitsResponse {

    public Map<String, String> traits = new Map<String, String>();
    public Cursor cursor {get; set;}
    public String json {get; set;}

    public TwilioSegmentProfileTraitsResponse(JSONParser parser) {
        while (parser.nextToken() != System.JSONToken.END_OBJECT) {
            if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                String text = parser.getText();
                if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                    if (text == 'traits') {
                        parseTraits(parser);
                    } else if (text == 'cursor') {
                        cursor = new Cursor(parser);
                    } else {
                        consumeObject(parser);
                    }
                }
            }
        }
    }

    private void parseTraits(JSONParser parser) {
        while (parser.nextToken() != System.JSONToken.END_OBJECT) {
            if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                String text = parser.getText();
                if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                    String value = parser.getText();
                    traits.put(text, value);
                }
            }
        }
    }

    public static TwilioSegmentProfileTraitsResponse parse(String json) {
		System.JSONParser parser = System.JSON.createParser(json);
        TwilioSegmentProfileTraitsResponse result = new TwilioSegmentProfileTraitsResponse(parser);
		result.json = json;
        return result;
	}

    public class Cursor {
        public String url {get;set;} 
        public Boolean has_more {get;set;} 
        public String next {get;set;} 
        public Integer limit_Z {get;set;} // in json: limit

        public Cursor(JSONParser parser) {
            while (parser.nextToken() != System.JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        if (text == 'url') {
                            url = parser.getText();
                        } else if (text == 'has_more') {
                            has_more = parser.getBooleanValue();
                        } else if (text == 'next') {
                            next = parser.getText();
                        } else if (text == 'limit') {
                            limit_Z = parser.getIntegerValue();
                        } else {
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }

    public static void consumeObject(System.JSONParser parser) {
        Integer depth = 0;
        do {
            System.JSONToken curr = parser.getCurrentToken();
            if (curr == System.JSONToken.START_OBJECT || 
            curr == System.JSONToken.START_ARRAY) {
                depth++;
            } else if (curr == System.JSONToken.END_OBJECT ||
                curr == System.JSONToken.END_ARRAY) {
                depth--;
            }
        } while (depth > 0 && parser.nextToken() != null);
    }
}