function animate() {
    requestAnimationFrame(animate);
    if (rotation==1) { rotateEarth(); }
    if (cameraMoving==true) { moveCamDo(); }
    renderer.render(scene, camera);
}


/////////////////////////////////////////////////////////////////////

function moveCamDo() {
    finished = false;
    //move camera
    if (camera.position[transferEnergyFrom]!=0) {
        cleanPos = Math.round((camera.position[transferEnergyFrom]-energyPerFrame*energyDirectionFrom)*multiplier)/multiplier; // account for binary being retarded (example? go to console using F12 and type 0.1+0.2 and hit return, youll get something like 0.30000000000000004. I know why, but its still dumb, especially when its easily fixed.)
        camera.position[transferEnergyFrom] = cleanPos;
        cleanPosTo = Math.round((camera.position[transferEnergyTo]+(energyPerFrame*energyDirectionTo))*multiplier)/multiplier;
        camera.position[transferEnergyTo]=cleanPosTo;
    } else {
        finished=true;
    }
    // point camera at earth
    camera.lookAt(0,0,0);

    if (finished==true) { cameraMoving=false; energyDirection=0; }

    // debug info
    camX = camera.position.x; camY = camera.position.y; camZ = camera.position.z;
    console.log('Finished: ' + finished.toString() + ', Transforming from ' + transferEnergyFrom + ' to ' + transferEnergyTo + ', x: ' + camX + ', y: ' + camY + ', z: ' + camZ);
}

function moveCamRequest(toWhere='above') {
    switch (toWhere) {
        case 'above': transferEnergyTo = 'y'; energyDirectionTo =  1; break;
        case 'front': transferEnergyTo = 'z'; energyDirectionTo =  1; break;
        case 'below': transferEnergyTo = 'y'; energyDirectionTo = -1; break;
    }

    // simple transform for moving camera. will eventually need something more robust depending on future interaction functions.. but itll do just now
    if (camera.position.x!=0) {
        transferEnergyFrom = 'x';
    } else if (camera.position.y!=0) {
        transferEnergyFrom = 'y';
    } else if (camera.position.z!=0) {
        transferEnergyFrom = 'z';
    }
    energyDirectionFrom = Math.sign(camera.position[transferEnergyFrom]);
    cameraMoving=true;
}

function rotateEarth() {
    earthMesh.rotation.y+=selectedRotationSpeed * (Math.PI/180);
    cloudsMesh.rotation.y+=selectedRotationSpeed * (Math.PI/180);
    currentRotation = ((earthMesh.rotation.y*(180/Math.PI)+90)%360).toPrecision(4);
    fullRotations = ~~((earthMesh.rotation.y+rotationOffset)/(Math.PI/180)/360);  // JS DOES USE PEMDAS/BOMDAS BUT ITS EASIER TO MARK OUT THE CALCULATIONS SEPERATELY IN CASE OF FUTURE DEBUGGING
    setHTMLByID('rotAngle', currentRotation);
    setHTMLByID('rotCount', fullRotations++);
}