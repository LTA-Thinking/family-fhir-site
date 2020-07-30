function SearchFhirServer() {

    var searchString = $("#search-url").val();
    CallFhirServer(
        (bundle) => {
            DisplayFhir(bundle);
        },
        (err) => {
            console.log(err);
        }, searchString);
}

function GenerateQrCode() {
    var qr = qrcode(0, 'M');
    qr.addData(location);
    qr.make();
    document.getElementById('qr-code').innerHTML = qr.createImgTag();
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
        GenerateQrCode();
        SearchFhirServer();
    }
});