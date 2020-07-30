function CallFhirServer(successFunc, errorFunc, searchString) {
    var url = GetFhirServer() + "/" + searchString;
    /*
    if (resourceType) {
        url += "/" + resourceType;
        if (resourceId) {
            url += "/" + resourceId;
            if (compartmentType)
            {
                url += "/" + compartmentType;
            }
        }
    }

    var first = true;
    for (const parameter in queryParams) {
        if (first) {
            first = false;
            url += "?";
        }
        else {
            url += "&";
        }
        url += parameter + "=" + queryParams[parameter];
    }
    */

    $.ajax(url, {
        success: successFunc,
        error: errorFunc
    });
}

function GetFhirServer() {
    return $("#env-settings").attr("data-fhirserver");
}

function GetFhirConverter() {
    return $("#env-settings").attr("data-fhirconverter");
}

function DisplayFhir(fhirBundle) {
    $("#tabs").empty();
    $("#resource").empty();

    var fhirResources = SeparateResources(fhirBundle);
    AddTabs("tabs", fhirResources);
    for (const resourceType in fhirResources) {
        AddSummary("resource", resourceType, fhirResources[resourceType], true);
    }
}

function SeparateResources(fhirResource) {
    if (fhirResource.resourceType !== "Bundle") {
        return { [fhirResource.resourceType]: [fhirResource] };
    }

    const resources = {};
    for (const entry of fhirResource.entry) {
        const type = entry.resource.resourceType;
        if (resources.hasOwnProperty(type)) {
            resources[type].push(entry.resource);
        }
        else {
            resources[type] = [entry.resource];
        }
    }

    return resources;
}

function AddSummary(parentId, resourceType, fhirResources, hidden) {
    var parent = $("#" + parentId);
    var wrapperId = resourceType;

    parent.append("<div id=\"" + wrapperId + "\"></div>");

    var wrapper = $("#" + wrapperId);
    for (let index = 0; index < fhirResources.length; index++) {
        var resource = fhirResources[index];
        var displayId = parentId + "-" + resourceType + "-" + index + "-display";

        wrapper.append(
            "<div class=\"code-wrapper\">"
            + "<input type=\"text\" class=\"form-control\" id=\"" + displayId + "\">"
            + "</div>");

        var display = CodeMirror.fromTextArea(document.getElementById(displayId), {
            readOnly: true,
            lineNumbers: true,
            mode: { name: "javascript" },
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });

        var outputLines = JSON.stringify(resource, null, 2).replace(/(?:\r\n|\r|\n)/g, '\n').split('\n');
        display.setValue(outputLines.join('\n'));
    }

    if (hidden) {
        wrapper.addClass("d-none");
    }
    else {
        wrapper.addClass("active-resource");
    }
}

function AddTabs(parentId, allFhirResources) {
    var parent = $("#" + parentId);
    parent.append("<ul id=\"resource-tabs\" class=\"nav nav-pills\"></ul>");

    var tabs = $("#resource-tabs");
    for (const resourceType in allFhirResources) {
        tabs.append("<li class=\"nav-item\">"
            + "<a class=\"nav-link\" id=\"" + resourceType + "-tab\" href=\"#\" onClick=\"SwitchToResource('" + resourceType + "')\">" + resourceType + "(" + allFhirResources[resourceType].length + ")</a>"
            + "</li>");
    }
}

function SwitchToResource(resourceType) {
    var previousResource = $(".active-resource");
    previousResource.removeClass("active-resource");
    previousResource.addClass("d-none");

    var activeResource = $("#" + resourceType);
    activeResource.removeClass("d-none");
    activeResource.addClass("active-resource");

    var previousTab = $(".active-resource-tab");
    previousTab.removeClass("active-resource-tab active");

    var activeTab = $("#" + resourceType + "-tab");
    activeTab.addClass("active-resource-tab active");
}