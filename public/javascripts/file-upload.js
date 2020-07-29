
function CcdFileSelect(ev) {
    var oData = new FormData(document.forms.namedItem("ccd-file-info"));
    var oReq = new XMLHttpRequest();
    oReq.open("POST", GetFhirConverter() + "/api/FhirConverter/cda/ccd.hbs", true);
    oReq.onload = function (oEvent) {
        if (oReq.status == 200) {
            //AddLevel($("#resource"), "resource", JSON.parse(oReq.response).fhirResource);
            var fhirResources = SeparateResources(JSON.parse(oReq.response).fhirResource);
            AddTabs("tabs", fhirResources);
            for (const resourceType in fhirResources) {
                AddSummary("resource", resourceType, fhirResources[resourceType], true);
            }

        } else {
            console.log("Error " + oReq.status + " occurred when trying to upload your file.<br/>");
        }
    };
    var fileData = oData.get("ccd-file");
    fileData.text().then(text => {
        oReq.send(JSON.stringify({ "srcDataBase64": btoa(text) }));
    });
    ev.preventDefault();
}