public class TwilioSegmentProfileEventResponse {

	public List<Data> data {get;set;} 
	public Cursor cursor {get;set;}
    public String json {get; set;}

	public TwilioSegmentProfileEventResponse(JSONParser parser) {
		while (parser.nextToken() != System.JSONToken.END_OBJECT) {
			if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
				String text = parser.getText();
				if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
					if (text == 'data') {
						data = arrayOfData(parser);
					} else if (text == 'cursor') {
						cursor = new Cursor(parser);
					} else {
						//System.debug(LoggingLevel.WARN, 'TwilioSegmentProfileEventResponse consuming unrecognized property: '+text);
						consumeObject(parser);
					}
				}
			}
		}
	}
	
	public class Data {
		public String type {get;set;} 
		public String source_id {get;set;} 
		public String message_id {get;set;} 
		public String timestamp {get;set;} 
		public Properties properties {get;set;} 
		public String event {get;set;} 

		public Data(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'type') {
							type = parser.getText();
						} else if (text == 'source_id') {
							source_id = parser.getText();
						} else if (text == 'message_id') {
							message_id = parser.getText();
						} else if (text == 'timestamp') {
							timestamp = parser.getText();
						} else if (text == 'properties') {
							properties = new Properties(parser);
						} else if (text == 'event') {
							event = parser.getText();
						} else {
							//System.debug(LoggingLevel.WARN, 'Data consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	public class Properties {
		Map<String, Object> values = new Map<String, Object>();

		public Properties(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        values.put(text, parser.getText());
					}
				}
			}
		}
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
							//System.debug(LoggingLevel.WARN, 'Cursor consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	public static TwilioSegmentProfileEventResponse parse(String json) {
		System.JSONParser parser = System.JSON.createParser(json);
        TwilioSegmentProfileEventResponse result = new TwilioSegmentProfileEventResponse(parser);
		result.json = json;
        return result;
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
	
    private static List<Data> arrayOfData(System.JSONParser p) {
        List<Data> res = new List<Data>();
        if (p.getCurrentToken() == null) p.nextToken();
        while (p.nextToken() != System.JSONToken.END_ARRAY) {
            res.add(new Data(p));
        }
        return res;
    }
}