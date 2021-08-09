import { getIcon } from 'c/icon';

const transformEvents = (events, settings) => {
  let modifyEvents = events.map((aEvent) => {
    const relatedSetting = settings.find((aSetting) => {
      const {event} = aSetting;
      const {Event_Name__c} = event;
      return Event_Name__c === aEvent.event;
    });

    return transformEvent(aEvent, relatedSetting);
  });

  // Remove Empty Object from the Array.
  modifyEvents = modifyEvents.filter(aEvent => Object.keys(aEvent).length > 0);
  return modifyEvents;
}

const transformEvent = (targetEvent, targetSetting) => {
  const targetSettingProps = targetSetting ? targetSetting.properties : null;
  const targetEventProps = targetEvent.properties;
  if(targetSetting && !targetSetting.event.isVisible__c) {
    return {};
  }

  const title = 
    (targetSetting && targetSetting.event.isVisible__c) ?
    targetSetting.event.MasterLabel : targetEvent.event;

  const icon = 
    (targetSetting && targetSetting.event.isVisible__c) ?
    targetSetting.event.Icon__c : getIcon(targetEvent.event);

  // Format Timestamp
  const timestamp = new Date(targetEvent.timestamp);
  const date = `${timestamp.getMonth() + 1}/${timestamp.getDate()}/${timestamp.getFullYear()}`;
  const time = timestamp.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  const {message_id} = targetEvent;
  const properties = transformEventProps(targetEventProps, targetSettingProps);

  return {
    title,
    icon,
    properties,
    message_id,
    timestamp: `${time} | ${date}`,
    createdDate: timestamp,
    key: message_id
  };
}

const transformEventProps = (targetEventProps, targetSettingProps) => {
  if(targetSettingProps && targetSettingProps.length > 0) {
    const results = [];

    for(const aPropSetting of targetSettingProps) {
      const {Key__c, MasterLabel} = aPropSetting;
      results.push({
        key: MasterLabel,
        value: targetEventProps[Key__c],
        id: `${Key__c}${MasterLabel}${Math.random()}`
      })
    }

    return results;
  } else {
    return Object.entries(targetEventProps).map(([key, value]) => {
      return {
        key,
        value,
        id: `${key}${value}${Math.random()}`
      }
    });
  }
}

export {transformEvents};