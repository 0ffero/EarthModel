function userKeyPress(event) {
    console.log(event);
    
    if (event.code=='Equal') { // INCREASE DILATION
        if (timeDilation<(60*24)) {
            timeDilation+=1;
            updateRotationSpeed();
        } else {
            timeDilation = 60*24;
        }
    }
    
    if (event.code=='Minus') { // DECREASE DILATION
        if (timeDilation>1) { timeDilation--; } else { timeDilation=1; }
        updateRotationSpeed();
    }
    
    if (event.code=='KeyA') { // AXIAL TILT
        if (axialTiltEnabled == true) {
            camera.rotation.z=0; axialTiltEnabled = false;
        } else {
            camera.rotation.z=-earthAxialTilt; axialTiltEnabled = true;
        }
        setHTMLByID('axialTilt', axialTiltEnabled.toString().toUpperCase())
    }

    if (event.code=='KeyC') { // CLOUDS
        cloudsMesh.visible==false ? cloudsMesh.visible=true : cloudsMesh.visible=false;
        setHTMLByID('clouds', cloudsMesh.visible.toString().toUpperCase());
    }

    if (event.code=='KeyG') { // GOD
        showGod();
    }

    if (event.code=='KeyK') { // KÁRMÁN BORDER (CONTROLS CAMERA)
        if (camera.position.x==0) {
            // zoom in on k border
            camera.position.set(-0.485*multiplier, 0, -0.16*multiplier);
            setHTMLByID('camPosition', 'KÁRMÁN BORDER')
        } else {
            camera.position.set(0, 0, 2*multiplier);
            setHTMLByID('camPosition', 'DEFAULT')
        }
    }

    if (event.code=='KeyR') { // EARTH ROTATION
        rotation = rotation==true ? false : true;
        updateHtmlID = getByID('spinning');
        updateHtmlID.innerHTML = rotation.toString().toUpperCase();
    }

    if (event.code=='KeyT') { // EARTH TEXTURE
        emName = earthMesh.material.name;
        switch (emName) {
            case 'map':     earthMesh.material = earthMaterialWhite;   setHTMLByID('earthMap', 'white w shadows');   break;
            case 'white':   earthMesh.material = earthMaterialWhiteNS; setHTMLByID('earthMap', 'white w/o shadows'); break;
            case 'whiteNS': earthMesh.material = earthMaterial;        setHTMLByID('earthMap', 'earth');             break;
        }
    }

    if (event.code=='ArrowUp') { // MOVE CAMERA UP
        if (cameraMoving==false) {
            switch (currentView) {
                case 'front': newView='above'; break;
                case 'below': newView='front'; break;
            }
            moveCamRequest(newView);
            currentView = newView;
        }
    }

    if (event.code=='ArrowDown') { // MOVE CAMERA DOWN
        if (cameraMoving==false) {
            switch (currentView) {
                case 'above': newView='front'; break;
                case 'front': newView='below'; break;
            }
            moveCamRequest(newView);
            currentView = newView;
        }
    }
}

function updateRotationSpeed() { // CHANGE ROTATION/DILATION SPEED
    selectedRotationSpeed = timeDilation * rotationSpeed;
    console.log('New Time Dilation = ' + selectedRotationSpeed);
    updateHtmlID = getByID('speed');
    setHTMLByID('speed', timeDilation);
    
    tempDilation = timeDilation;
    if (tempDilation/60>=1) { // hours
        hrs = ~~(tempDilation/60);
        tempDilation-=hrs * 60;
        omins = tempDilation%60;
    } else {
        hrs = 0;
        omins = tempDilation;
    }
    mins = omins;
    omins -= mins;
    secs = omins%60;
    dilationToTime = hrs + 'h' + mins + 'm' + secs + 's/s';
    updateHtmlID.append(' (ie: ' + dilationToTime + ')');
}