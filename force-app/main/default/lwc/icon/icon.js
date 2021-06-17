const nameToIcon = {};

// LWC Supported Icons
const icons = ["standard:account","standard:action_list_component","standard:actions_and_buttons","standard:activation_target","standard:activations","standard:address","standard:agent_session","standard:all","standard:announcement","standard:answer_best","standard:answer_private","standard::apps_admin","standard:apps","standard:article","standard:asset_action_source","standard:asset_action","standard:asset_downtime_period","standard:asset_object","standard:asset_relationship","standard:asset_state_period","standard:asset_warranty","standard:assigned_resource","standard:assignment","standard:avatar_loading","standard:avatar","standard:bot_training","standard:bot","standard:branch_merge","standard:brand","standard:business_hours","standard:buyer_account","standard:buyer_group","standard:calibration","standard:call_coaching","standard:call_history","standard:call","standard:campaign_members","standard:campaign","standard:cancel_checkout","standard:canvas","standard:carousel","standard:case_change_status","standard:case_comment","standard:case_email","standard:case_log_a_call","standard:case_milestone","standard:case_transcript","standard:case_wrap_up","standard:case","standard:catalog","standard:category","standard:channel_program_history","standard:channel_program_levels","standard:channel_program_members","standard:channel_programs","standard:chart","standard:checkout","standard:choice","standard:client","standard:cms","standard:coaching","standard:code_playground","standard:collection_variable","standard:collection","standard:connected_apps","standard:constant","standard:contact_list","standard:contact_request","standard:contact","standard:contract_line_item","standard:contract","standard:currency_input","standard:currency","standard:custom_component_task","standard:custom_notification","standard:custom","standard:customer_360","standard:customer_lifecycle_analytics","standard:customer_portal_users","standard:customers","standard:dashboard_ea","standard:dashboard","standard:data_integration_hub","standard:data_mapping","standard:data_model","standard:data_streams","standard:datadotcom","standard:dataset","standard:date_input","standard:date_time","standard:decision","standard:default","standard:delegated_account","standard:device","standard:display_rich_text","standard:display_text","standard:document","standard:drafts","standard:dynamic_record_choice","standard:education","standard:einstein_replies","standard:email_chatter","standard:email","standard:employee_asset","standard:employee_contact","standard:employee_job_position","standard:employee_job","standard:employee_organization","standard:employee","standard:empty","standard:endorsement","standard:entitlement_policy","standard:entitlement_process","standard:entitlement_template","standard:entitlement","standard:entity_milestone","standard:entity","standard:environment_hub","standard:event","standard:events","standard:expense_report_entry","standard:expense_report","standard:expense","standard:feed","standard:feedback","standard:file","standard:filiter_criteria_rule","standard:filter_criteria","standard:filter","standard:first_non_empty","standard:flow","standard:folder","standard:forecasts","standard:form","standard:formula","standard:fulfillment_order","standard:generic_loading","standard:global_constant","standard:goals","standard:group_loading","standard:groups","standard:guidance_center","standard:hierarchy","standard:high_velocity_sales","standard:holiday_operating_hours","standard:home","standard:household","standard:immunization","standard:individual","standard:insights","standard:instore_locations","standard:investment_account","standard:invocable_action","standard:iot_context","standard:iot_orchestrations","standard:javascript_button","standard:job_family","standard:job_position","standard:job_profile","standard:kanban","standard:key_dates","standard:knowledge","standard:lead_insights","standard:lead_list","standard:lead","standard:letterhead","standard:lightning_component","standard:lightning_usage","standard:link","standard:list_email","standard:live_chat_visitor","standard:live_chat","standard:location_permit","standard:location","standard:log_a_call","standard:logging","standard:loop","standard:macros","standard:maintenance_asset","standard:maintenance_plan","standard:maintenance_work_rule","standard:marketing_actions","standard:merge","standard:messaging_conversation","standard:messaging_session","standard:messaging_user","standard:metrics","standard:multi_picklist","standard:multi_select_checkbox","standard:news","standard:note","standard:number_input","standard:observation_component","standard:omni_supervisor","standard:operating_hours","standard:opportunity_contact_role","standard:opportunity_splits","standard:opportunity","standard:order_item","standard:orders","standard:outcome","standard:output","standard:partner_fund_allocation","standard:partner_fund_claim","standard:partner_fund_request","standard:partner_marketing_budget","standard:partners","standard:password","standard:past_chat","standard:payment_gateway","standard:people","standard:performance","standard:person_account","standard:photo","standard:picklist_choice","standard:picklist_type","standard:planogram","standard:poll","standard:portal_roles_and_subordinates","standard:portal_roles","standard:portal","standard:post","standard:practitioner_role","standard:price_book_entries","standard:price_books","standard:pricebook","standard:pricing_workspace","standard:procedure_detail","standard:procedure","standard:process_exception","standard:process","standard:product_consumed","standard:product_item_transaction","standard:product_item","standard:product_request_line_item","standard:product_request","standard:product_required","standard:product_service_campaign_item","standard:product_service_campaign","standard:product_transfer","standard:product_warranty_term","standard:product_workspace","standard:product","standard:products","standard:proposition","standard:question_best","standard:question_feed","standard:queue","standard:quick_text","standard:quip_sheet","standard:quip","standard:quotes","standard:radio_button","standard:read_receipts","standard:recent","standard:recipe","standard:record_create","standard:record_delete","standard:record_lookup","standard:record_signature_task","standard:record_update","standard:record","standard:recycle_bin","standard:related_list","standard:relationship","standard:reply_text","standard:report","standard:resource_absence","standard:resource_capacity","standard:resource_preference","standard:resource_skill","standard:return_order_line_item","standard:return_order","standard:reward","standard:rtc_presence","standard:sales_cadence_target","standard:sales_cadence","standard:sales_channel","standard:sales_path","standard:sales_value","standard:salesforce_cms","standard:scan_card","standard:schedule_objective","standard:scheduling_constraint","standard:scheduling_policy","standard:screen","standard:search","standard:section","standard:segments","standard:serialized_product_transaction","standard:serialized_product","standard:service_appointment_capacity_usage","standard:service_appointment","standard:service_contract","standard:service_crew_member","standard:service_crew","standard:service_report","standard:service_request_detail","standard:service_request","standard:service_resource","standard:service_territory_location","standard:service_territory_member","standard:service_territory","standard:settings","standard:shift_pattern_entry","standard:shift_pattern","standard:shift_preference","standard:shift_template","standard:shift_type","standard:shift","standard:shipment","standard:skill_entity","standard:skill_requirement","standard:skill","standard:slider","standard:sms","standard:snippet","standard:snippets","standard:sobject_collection","standard:sobject","standard:social","standard:solution","standard:sort","standard:sossession","standard:stage_collection","standard:stage","standard:steps","standard:store_group","standard:store","standard:story","standard:strategy","standard:survey","standard:swarm_request","standard:system_and_global_variable","standard:task","standard:task2","standard:team_member","standard:template","standard:text_template","standard:text","standard:textarea","standard:textbox","standard:thanks_loading","standard:thanks","standard:timesheet_entry","standard:timesheet","standard:timeslot","standard:today","standard:toggle","standard:topic","standard:topic2","standard:trailhead_alt","standard:trailhead","standard:travel_mode","standard:unmatched","standard:user_role","standard:user","standard:variable","standard:variation_attribute_setup","standard:variation_products","standard:video","standard:visit_templates","standard:visits","standard:visualforce_page","standard:voice_call","standard:waits","standard:warranty_term","standard:webcart","standard:work_capacity_limit","standard:work_capacity_usage","standard:work_contract","standard:work_order_item","standard:work_order","standard:work_plan_rule","standard:work_plan_template_entry","standard:work_plan_template","standard:work_plan","standard:work_queue","standard:work_step_template","standard:work_step","standard:work_type_group","standard:work_type","custom:custom1","custom:custom2","custom:custom3","custom:custom4","custom:custom5","custom:custom6","custom:custom7","custom:custom8","custom:custom9","custom:custom10","custom:custom11","custom:custom12","custom:custom13","custom:custom14","custom:custom15","custom:custom16","custom:custom17","custom:custom18","custom:custom19","custom:custom20","custom:custom21","custom:custom22","custom:custom23","custom:custom24","custom:custom25","custom:custom26","custom:custom27","custom:custom28","custom:custom29","custom:custom30","custom:custom31","custom:custom32","custom:custom33","custom:custom34","custom:custom35","custom:custom36","custom:custom37","custom:custom38","custom:custom39","custom:custom40","custom:custom41","custom:custom42","custom:custom43","custom:custom44","custom:custom45","custom:custom46","custom:custom47","custom:custom48","custom:custom49","custom:custom50","custom:custom51","custom:custom52","custom:custom53","custom:custom54","custom:custom55","custom:custom56","custom:custom57","custom:custom58","custom:custom59","custom:custom60","custom:custom61","custom:custom62","custom:custom63","custom:custom64","custom:custom65","custom:custom66","custom:custom67","custom:custom68","custom:custom69","custom:custom70","custom:custom71","custom:custom72","custom:custom73","custom:custom74","custom:custom75","custom:custom76","custom:custom77","custom:custom78","custom:custom79","custom:custom80","custom:custom81","custom:custom82","custom:custom83","custom:custom84","custom:custom85","custom:custom86","custom:custom87","custom:custom88","custom:custom89","custom:custom90","custom:custom91","custom:custom92","custom:custom93","custom:custom94","custom:custom95","custom:custom96","custom:custom97","custom:custom98","custom:custom99","custom:custom100","custom:custom101","custom:custom102","custom:custom103","custom:custom104","custom:custom105","custom:custom106","custom:custom107","custom:custom108","custom:custom109","custom:custom110","custom:custom111","custom:custom112","custom:custom113"];

/**
 * Get Icon Based on String. If String is seem for the first time it will return a unqiue Icon.
 * @param {String} uniqueName 
 */
const getIcon = (uniqueName) => {
  let icon = null;
  if(uniqueName in nameToIcon) {
    icon = nameToIcon[uniqueName];
  } else {
    icon = generateIcon();
    nameToIcon[uniqueName] = icon;
  }
  return icon;
}

/**
 * Return a icon
 */
const generateIcon = () => {
  return icons[Math.floor(Math.random() * icons.length)];
}

export {getIcon, generateIcon};