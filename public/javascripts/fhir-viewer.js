function SearchFhirServer() {
    $("#tabs").empty();
    $("resource").empty();

    var searchString = $("#search-url").val();
    CallFhirServer(
        (bundle) => {
            var fhirResources = SeparateResources(bundle);
            AddTabs("tabs", fhirResources);
            for (const resourceType in fhirResources) {
                AddSummary("resource", resourceType, fhirResources[resourceType], true);
            }
        },
        (err) => {
            console.log(err);
        }, searchString);
}

$(document).ready(function () {
    var form = document.forms.namedItem("fhir-search");
    form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        location.assign("/search?_query=" + btoa($("#search-url").val()));
    });

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('_query')) {
        const searchString = atob(urlParams.get('_query'));
        $("#search-url").val(searchString);
        SearchFhirServer();
    }
});