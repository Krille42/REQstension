(function() {

      const AutofillREQ = () => {

            //get request information from data passed from tool through get parameters

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);

            // save parameters to browser

            let user = urlParams.get('id')
            let service = urlParams.get('service')
            let type = urlParams.get('type')

            // Generic user selected if no user ID is passed

            user = (user) ? user : "GENERIC user";

            // Check if service is provided

            service = (service == "vcn") ? "VCN AD - VCN Active Directory - ds.volvo.net" : service;
            service = (service == "generic") ? "MyPlace - Production" : service;
            service = (service == "access") ? "Faros - Instance" : service;

            // default to type "other" if none are provided

            type = (type) ? type : 7;

            // check correct type in regard to parameter provided

            type = (type == "password") ? 2 : type;
            type = (type == "access") ? 3 : type;
            type = (type == "redirect") ? 5 : type;
            type = (type == "unlock") ? 6 : type;

            // set assignment group as TCS Remote SWE

            document.getElementsByClassName("input-group").item(2).getElementsByTagName("input").item(0).value = "TCS Remote SWE"
            document.getElementsByClassName("input-group").item(2).getElementsByTagName("input").item(0).focus()

            document.getElementsByClassName("input-group").item(0).getElementsByTagName("input").item(0).focus()

            // set contact type to default to "phone"

            document.getElementsByTagName("select").item(0).value = "phone"

            let e = new Event("change");
            let element = document.getElementsByTagName("select").item(0)
            element.dispatchEvent(e);

            // select the radio button for type provided earlier

            document.querySelectorAll('input[type=radio]').item(type).checked = true

            // set descripton to default text based on type

            document.getElementsByTagName("textarea").item(0).value = (type == 3) ? "Helped user by applying for access: " : document.getElementsByTagName("textarea").item(0).value;
            document.getElementsByTagName("textarea").item(0).value = (type == 5) ? "Redirected to StRS" : document.getElementsByTagName("textarea").item(0).value;

            setTimeout(() => {

                  // await 400ms for assigment group to be set before entering owner group as the same

                  document.getElementsByClassName("input-group").item(3).getElementsByTagName("input").item(0).value = "TCS Remote SWE"
                  document.getElementsByClassName("input-group").item(3).getElementsByTagName("input").item(0).focus()

                  setTimeout(() => {

                        // wait additional 500ms before setting the User ID and service offering as provided in parameters above
                        
                        document.getElementsByClassName("input-group").item(0).getElementsByTagName("input").item(0).value = user
                        document.getElementsByClassName("input-group").item(0).getElementsByTagName("input").item(0).focus()

                        document.getElementsByClassName("input-group").item(1).getElementsByTagName("input").item(0).value = service
                        document.getElementsByClassName("input-group").item(1).getElementsByTagName("input").item(0).focus()

                        statusEl.innerHTML = "Done auto-filling fields"
      
                  },500)

            },400)

      }

      // Show status in injected element
      let statusEl = document.createElement("p")
      statusEl.style = "display: absolute; top: 1em; width: min-content; margin: auto; padding: 1em; background-color: #666666;"
      document.body.appendChild(statusEl)

      if(window.location.href.includes("https://volvoitsm.service-now.com/com.glideapp.servicecatalog_cat_item_view.do?v=1&sysparm_id=e7351f31dbb0a8109507a155059619a3")) {

            // if on request creation screen

            window.addEventListener ("load", AutofillREQ, false);

            statusEl.innerHTML = "Auto-filling fields"

      }else if(window.location.href.includes("https://volvoitsm.service-now.com/com.glideapp.servicecatalog_checkout_view_v2.do?")) {

            // if on request submitted screen
            statusEl.innerHTML = "Finding link"

            window.open(document.getElementById("requesturl").href,"_self")

            // do id=requesturl.href

      }else if (window.location.href.includes("https://volvoitsm.service-now.com/sc_request.do?sys_id=")) {

            // if on request screen
            statusEl.innerHTML = "Finding link"

            if(document.getElementsByClassName("linked formlink").item(0).innerHTML.includes("RITM")) {

                  window.open(document.getElementsByClassName("linked formlink").item(0).href,"_self")

            }else {

                  statusEl.innerHTML = "RITM not found"

            }
            

            // do class="linked formlink" .innerHTML == RITM* .href

      }else if (window.location.href.includes("https://volvoitsm.service-now.com/sc_req_item.do?sys_id=")) {

            // if on RITM screen

            chrome.storage.local.set({ "openedBy": document.getElementById("sc_req_item.opened_by_label").value }, function(){

                  console.log(`openedBy set to ${document.getElementById("sc_req_item.opened_by_label").value}`)

            });

            try {

                  statusEl.innerHTML = "Finding link"

                  let link = document.getElementsByClassName("linked formlink").item(0).href
                  if(link.includes("sc_task.do")) {

                        window.open(link,"_self")

                  }else {

                        statusEl.innerHTML = "No task has been created yet, please reload page to check again"

                  }
                  
            } catch (err) {

                  statusEl.innerHTML = "No task has been created yet, please reload page to check again"
                  console.log(err)
                  
            }

            // do opened by = sc_req_item.opened_by_label & task = class="linked formlink" .innerHTML == SCTASK .href

      }else if (window.location.href.includes("https://volvoitsm.service-now.com/sc_task.do?sys_id=")) {

            // if on task screen
            statusEl.innerHTML = "Auto-filling fields"

            // fill task like req above

            chrome.storage.local.get(["openedBy"], function(obj){

                  if (document.getElementById("sc_task.state").value != "3") {

                        document.getElementById("sys_display.sc_task.assigned_to").value = obj.openedBy
                        document.getElementById("sys_display.sc_task.assigned_to").focus()
                        document.getElementById("sys_display.sc_task.cmdb_ci").value = document.getElementById("sys_display.sc_task.service_offering").value
                        

                        setTimeout(() => {

                              document.getElementById("sys_display.sc_task.cmdb_ci").focus()
                              document.getElementById("sc_task.priority").value = "4"
                              setTimeout(() => {

                                    document.getElementById("sc_task.priority").focus()
                                    document.getElementById("sc_task.state").value = "3"

                                    let e = new Event("change");
                                    let element = document.getElementById("sc_task.state")
                                    element.dispatchEvent(e);

                                    document.getElementById("activity-stream-comments-textarea").value = (document.getElementById("sc_task.description").value != "") ? `${document.getElementById("sc_task.short_description").value}: ${document.getElementById("sc_task.description").value}` : document.getElementById("sc_task.short_description").value;

                                    setTimeout(() => {

                                          let e = new Event("change");
                                          let element = document.getElementById("activity-stream-comments-textarea")
                                          element.dispatchEvent(e);

                                          statusEl.innerHTML = "Done auto-filling fields"

                                    }, 200)
                                    
                              }, 200);
                              
                        }, 200);

                  }

            });

      }
      
      // Remove tooltip from display after 10 seconds
      setTimeout(() => {

            document.body.removeChild(statusEl)

      }, 10000)
})();

// test links

// Request submitted link: https://volvoitsm.service-now.com/com.glideapp.servicecatalog_checkout_view_v2.do?v=1&sysparm_sys_id=e11aca513b5d8e50a7b3034a85e45abc&sysparm_new_request=true&sysparm_view=ess&sysparm_catalog=59d3f69b875cbd94157065f30cbb3519&sysparm_catalog_view=catalog_IT_Service_Management
// Request Link: https://volvoitsm.service-now.com/sc_request.do?sys_id=e11aca513b5d8e50a7b3034a85e45abc&sysparm_record_target=sc_request&sysparm_catalog=59d3f69b875cbd94157065f30cbb3519&sysparm_catalog_view=catalog_IT_Service_Management
// RITM link: https://volvoitsm.service-now.com/sc_req_item.do?sys_id=691aca513b5d8e50a7b3034a85e45abc&sysparm_record_target=sc_req_item&sysparm_record_row=1&sysparm_record_rows=1&sysparm_record_list=request%3De11aca513b5d8e50a7b3034a85e45abc%5EORDERBYDESCsys_created_on
// Request task link: https://volvoitsm.service-now.com/sc_task.do?sys_id=fd1a0e513b5d8e50a7b3034a85e45a92&sysparm_view=&sysparm_domain=null&sysparm_domain_scope=null&sysparm_record_row=1&sysparm_record_rows=1&sysparm_record_list=request_item%3d691aca513b5d8e50a7b3034a85e45abc%5eORDERBYDESCnumber

