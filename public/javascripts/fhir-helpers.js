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
        var baseId = parentId + "-" + resourceType + "-" + index;
        var displayId = baseId + "-display";
        var headerId = baseId + "-header";
        var buttonId = baseId + "-button";

        wrapper.append(
            "<div class=\"card\">"
            + "<div class=\"card-header\" id=\"" + headerId + "\">"
            + "<button class=\"btn btn-link\" id=\"" + buttonId + "\" data-toggle=\"collapse\" data-target=\"#" + baseId + "\" aria-controls=\"" + baseId + "\" onclick=\"RefreshCodemirror(event)\">"
            + ResourceSummary(resource)
            + "</button>"
            + "</div>"
            + "<div id=\"" + baseId + "\" class=\"collapse\" aria-labelledby=\"" + headerId + "\" data-parent=\"#" + wrapperId + "\">"
            + "<div class=\"card-body\">"
            + "<div class=\"code-wrapper\">"
            + "<input type=\"text\" class=\"form-control\" id=\"" + displayId + "\">"
            + "</div>"
            + "</div>"
            + "</div>"
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

        $("#" + buttonId).data("CodeMirrorInstance", display);
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

// Because the codemirror instance is hidden at the start it needs to be refreshed when the card is opened or it will apear blank until clicked.
function RefreshCodemirror(event)
{
    setTimeout(() => $("#" + event.target.id).data("CodeMirrorInstance").refresh(), 0);
}

function ResourceSummary(resource) {
    return resource.id;
}