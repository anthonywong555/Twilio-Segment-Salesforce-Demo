import { LightningElement, wire } from 'lwc';
import twilioSegmentLogoURL from '@salesforce/resourceUrl/Twilio_Segment_Logo';
import getEvents from '@salesforce/apex/TwilioSegmentProfileEventsController.getEvents';

export default class TwilioSegmentProfileEvents extends LightningElement {
  twilioSegmentLogoURL = twilioSegmentLogoURL;
  events;
  data;
  buttonClicked;
  cssClasses = "slds-timeline__item_expandable slds-timeline__item_email to-expand";

  @wire(getEvents)
  wiredEvents({ error, data }) {
    if(data) {
      const icons = "standard:account,standard:action_list_component,standard:actions_and_buttons,standard:activation_target,standard:activations,standard:address,standard:agent_session,standard:all,standard:announcement,standard:answer_best,standard:answer_private,standard:answer_public,standard:apex_plugin,standard:apex,standard:app,standard:approval,standard:apps_admin,standard:apps,standard:article,standard:asset_action_source,standard:asset_action,standard:asset_downtime_period,standard:asset_object,standard:asset_relationship,standard:asset_state_period,standard:asset_warranty,standard:assigned_resource,standard:assignment,standard:avatar_loading,standard:avatar,standard:bot_training,standard:bot,standard:branch_merge,standard:brand,standard:business_hours,standard:buyer_account,standard:buyer_group,standard:calibration,standard:call_coaching,standard:call_history,standard:call,standard:campaign_members,standard:campaign,standard:cancel_checkout,standard:canvas,standard:carousel,standard:case_change_status,standard:case_comment,standard:case_email,standard:case_log_a_call,standard:case_milestone,standard:case_transcript,standard:case_wrap_up,standard:case,standard:catalog,standard:category,standard:channel_program_history,standard:channel_program_levels,standard:channel_program_members,standard:channel_programs,standard:chart,standard:checkout,standard:choice,standard:client,standard:cms,standard:coaching,standard:code_playground,standard:collection_variable,standard:collection,standard:connected_apps,standard:constant,standard:contact_list,standard:contact_request,standard:contact,standard:contract_line_item,standard:contract,standard:currency_input,standard:currency,standard:custom_component_task,standard:custom_notification,standard:custom,standard:customer_360,standard:customer_lifecycle_analytics,standard:customer_portal_users,standard:customers,standard:dashboard_ea,standard:dashboard,standard:data_integration_hub,standard:data_mapping,standard:data_model,standard:data_streams,standard:datadotcom,standard:dataset,standard:date_input,standard:date_time,standard:decision,standard:default,standard:delegated_account,standard:device,standard:display_rich_text,standard:display_text,standard:document,standard:drafts,standard:dynamic_record_choice,standard:education,standard:einstein_replies,standard:email_chatter,standard:email,standard:employee_asset,standard:employee_contact,standard:employee_job_position,standard:employee_job,standard:employee_organization,standard:employee,standard:empty,standard:endorsement,standard:entitlement_policy,standard:entitlement_process,standard:entitlement_template,standard:entitlement,standard:entity_milestone,standard:entity,standard:environment_hub,standard:event,standard:events,standard:expense_report_entry,standard:expense_report,standard:expense,standard:feed,standard:feedback,standard:file,standard:filiter_criteria_rule,standard:filter_criteria,standard:filter,standard:first_non_empty,standard:flow,standard:folder,standard:forecasts,standard:form,standard:formula,standard:fulfillment_order,standard:generic_loading,standard:global_constant,standard:goals,standard:group_loading,standard:groups,standard:guidance_center,standard:hierarchy,standard:high_velocity_sales,standard:holiday_operating_hours,standard:home,standard:household,standard:immunization,standard:individual,standard:insights,standard:instore_locations,standard:investment_account,standard:invocable_action,standard:iot_context,standard:iot_orchestrations,standard:javascript_button,standard:job_family,standard:job_position,standard:job_profile,standard:kanban,standard:key_dates,standard:knowledge,standard:lead_insights,standard:lead_list,standard:lead,standard:letterhead,standard:lightning_component,standard:lightning_usage,standard:link,standard:list_email,standard:live_chat_visitor,standard:live_chat,standard:location_permit,standard:location,standard:log_a_call,standard:logging,standard:loop,standard:macros,standard:maintenance_asset,standard:maintenance_plan,standard:maintenance_work_rule,standard:marketing_actions,standard:merge,standard:messaging_conversation";
      const iconsArray = icons.split(',');
      console.log(
        `%cData!`,
        "color:red;font-family:system-ui;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold"
      );
      this.events = JSON.parse(data);
      const temp = this.events.data;
      const newTemp = temp.map(aEvent => {
        const objectArray = Object.entries(aEvent.properties);
        const properties = objectArray.map(([key, value]) => {
          return {
            key,
            value,
            id: `${key}${value}${Math.random()}`
          }
        })
        const timestamp = new Date(aEvent.timestamp);
        const date = `${timestamp.getMonth()}/${timestamp.getDay()}/${timestamp.getFullYear()}`;
        const time = timestamp.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        return {
          ...aEvent,
          icon: iconsArray[Math.floor(Math.random()*iconsArray.length)],
          properties,
          timestamp: `${time} | ${date}`
        };
      });
      //this.data = this.events.data;
      this.data = newTemp;
      console.log(this.events);
      console.log(this.data);
    } else if(error) {
      console.error(
        `%cError!`,
        "color:red;font-family:system-ui;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold"
      );
      console.error(error);
    }
  }

  handleClick(event) {
    this.buttonClicked = !this.buttonClicked;
    this.cssClasses = this.buttonClicked
      ? "slds-timeline__item_expandable slds-timeline__item_email to-expand slds-is-open"
      : "slds-timeline__item_expandable slds-timeline__item_email to-expand";
  }
}