var rendererW = window.innerWidth; var rendererH = window.innerHeight;
var wCX = rendererW/2; var wCY = rendererH/2;

var camera, scene, renderer;
var cameraMoving = false;
    var energyPerFrame = 0.1;
    var transferEnergyFrom = null;
    var transferEnergyTo = null;
    var energyDirectionTo = 0;
    var energyDirectionFrom = 0;
    var currentView = 'front';

var earthGeometry; var earthMaterial; var earthMesh;
var sunGeometry; var sunMaterial; var sunMesh; var sunRotationPeriod = 1/2267136; // in deg per second

var controls;
var fps = 60;
var timeDilation = 59;
var rotationSpeed = 360/(24*60*60);
var selectedRotationSpeed = rotationSpeed * timeDilation;

var multiplier = 10;
var earthAxialTilt = 23.5*(Math.PI/180); var earthRadius = 6371; var axialTiltEnabled = false;
var rotation = true; var rotationOffset = 90*(Math.PI/180); var rotations = angleChangePerS = originalAngle = 0; var rotCounted=true;

var kármánLine = 0.5 + (100 / (earthRadius*2));

var models = {
    Cthulhu: { id: null, src: 'models/cthulhu.stl',     mesh: null, material: null, },
    Anubis:  { id: null, src: 'models/anubis.stl',      mesh: null, material: null, },
    Jeebus:  { id: null, src: 'models/buddyJeebus.stl', mesh: null, material: null, },
};

function centreInfoBox() {
    infoBox = getByID('information');
    woI = infoBox.clientWidth; gleft = wCX - (woI/2);
    hoI = infoBox.clientHeight; gtop = wCY - (hoI/2);
    infoBox.style="position: absolute; left: " + gleft  + "; top: " + gtop;
}

function radToDeg(_angleChangePerS) {
    if (isNumeric(_angleChangePerS)) {
        return _angleChangePerS*(180/Math.PI);
    } else {
        console.log('%cERROR\n' + angleChangePerS + ' is not a number.', 'color: black background-color: red' );
    }
}

function getByID(DOMID) {
    return document.getElementById(DOMID);
}

function isNumeric(_n) {
    return !isNaN(parseFloat(_n)) && isFinite(_n);
}

function moveInfo() {
    getByID('ok').style="display: none;";
    getByID('information').style="";
}

function setHTMLByID(DOMID, value) {
    document.getElementById(DOMID).innerHTML = value;
}