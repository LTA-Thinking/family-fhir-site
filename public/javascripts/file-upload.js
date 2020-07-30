
var rawFhirBundle = null;

function CcdFileSelect(ev) {
    var oData = new FormData(document.forms.namedItem("ccd-file-info"));
    var oReq = new XMLHttpRequest();
    oReq.open("POST", GetFhirConverter() + "/api/FhirConverter/cda/ccd.hbs", true);
    oReq.onload = function (oEvent) {
        if (oReq.status == 200) {
            rawFhirBundle = JSON.parse(oReq.response).fhirResource;
            DisplayFhir(rawFhirBundle);
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

function FhirFileSelect(ev) {
    var oData = new FormData(document.forms.namedItem("fhir-file-info"));
    var fileData = oData.get("fhir-file");
    fileData.text().then(text => {
        rawFhirBundle = JSON.parse(text);
        DisplayFhir(rawFhirBundle);
    });
    ev.preventDefault();
}

function PostToServer() {
    if (rawFhirBundle !== null) {
        var resources = SeparateResources(rawFhirBundle);
        var resourcesArray = [];
        for (const resourceType in resources) {
            for (const resource of resources[resourceType]) {
                resourcesArray.push(resource);
            }
        }
        PostResources(resourcesArray, 0);
    }
}

function PostResources(resources, index) {
    $.ajax(GetFhirServer() + '/' + resources[index].resourceType, {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(resources[index]),
        success:
            () => {
                console.log("Successfully posted resource!");
                if (resources.length > index) {
                    PostResources(resources, index + 1);
                }
            },
        error:
            (err) => {
                console.log(err);
            }
    });
}