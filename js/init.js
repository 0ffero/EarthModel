function init() {
    // leave message regarding scale in console
    msg = '%cDue to the scale of the solar system (its probably bigger than you can imagine) having an earth with a radius thats over 6,000KM makes it hard to see clouds which are only 2 - 8KM above the eraths surface. The kármán line which we define as the border between earths atmosphere is 100KM above sea level. Youll notice that even though the kármán boundary is 100 KM up, it looks like its only a few cm\'s above the earth. Like I mentioned, everythings huge at these scales, even the earth. So, when we normalise the size of earth to a diameter of 1, clouds are only 2 - 8 / 12,742 km the radius of the clouds. Compared to earth this means the clouds are at earth+~0.001 (and half that difference for lower clouds at 2KM). You can see the problem... To keep the simulation runnning as fast as possible the units are multiplied by ' + multiplier + ' ie the earths diameter is now 10 units, leaving the clouds radius at an almost imperceptable earth+~0.01 units. Later versions will allow you to modify the scaling, all the way up to real size';
    console.log(msg, 'font-weight: bold; background-color: black; color: yellow; font-size: 24px;');

    // RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( rendererW, rendererH );
    document.body.appendChild( renderer.domElement );

    // TEXTURES
    textureLoader = new THREE.TextureLoader();
    earthTexture = textureLoader.load("textures/earthmap8K.jpg");
    skyboxTexture = textureLoader.load("textures/stars8K.jpg");
    cloudsTexture = textureLoader.load("textures/cloudMap8K.jpg");
    earthTexture.anisotropy = skyboxTexture.anisotropy = cloudsTexture.anisotropy = 4;

    //SCENE
    scene = new THREE.Scene();

    // CAMERA
    camera = new THREE.PerspectiveCamera( 45, rendererW / rendererH, 0.1, 101*multiplier );
    camera.position.set(0,0,2*multiplier);
    lookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAt);

    // LIGHTS
    intensity = 1;
    lightD = new THREE.DirectionalLight( 0xffffff, intensity );
    lightD.position.set(-2*multiplier, 0, 0);
    lightD.castShadow = true;
    lightA = new THREE.AmbientLight( 0xFFFFFF, 0.1);
    camera.add(lightA);
    camera.add(lightD);
    scene.add(camera);

    skybox();
    addBody('Earth');

    loadSTLs();
    startTimer();
    userKeyPress({code: 'Equal'});
}

function skybox() {
    skyboxGeometry = new THREE.SphereGeometry(50*multiplier, 128, 128);
    skyboxMaterial = new THREE.MeshBasicMaterial( { map: skyboxTexture, side: THREE.BackSide, })
    skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skyboxMesh);
}

function addBody(bodyName) {
    if (bodyName=='Earth') {
        // THE EARTH
        earthGeometry = new THREE.SphereGeometry( 1/2*multiplier, 64, 64 ); // actual radius of earth 6,371Km
        earthMaterial = new THREE.MeshLambertMaterial( { map: earthTexture } ); earthMaterial.name='map';
        earthMaterialWhite = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } ); earthMaterialWhite.name='white';
        earthMaterialWhiteNS = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ); earthMaterialWhiteNS.name='whiteNS';
        earthMesh = new THREE.Mesh( earthGeometry, earthMaterial );
        scene.add(earthMesh);

        // THE CLOUDS - Cloud Height Above Earth > 2 < 8
        cloudRadiusMin = 0.5 + (2/(6371)); // THIS RADIUS NEEDS MULTIPLIED BY 2 (MAKING THE RADIUS SMALLER) TO DEFINE REAL CLOUD HEIGHT
        cloudRadiusMax = 0.5 + (8/(6371)); // THE REASON I HAVENT *2 IS THAT THE RADIUS OF THE CLOUDS IS SO CLOSE TO THE EARTH, THE TEXTURE CLIPS!
        cloudsGeometry = new THREE.SphereGeometry( cloudRadiusMax*multiplier, 64, 64 );
        cloudsMaterial = new THREE.MeshBasicMaterial( { alphaMap: cloudsTexture, transparent: true, side: THREE.DoubleSide } );
        cloudsMesh = new THREE.Mesh( cloudsGeometry, cloudsMaterial );
        scene.add(cloudsMesh);

        
        kármánLineGeometry = new THREE.SphereGeometry(kármánLine*multiplier, 64, 64 );
        kármánLineMaterial = new THREE.MeshBasicMaterial( { color: 0x26C9FF, transparent: true, opacity: 0.1 })
        kármánLineMesh = new THREE.Mesh( kármánLineGeometry, kármánLineMaterial );
        scene.add(kármánLineMesh);
    }
}

function loadSTLs() {
    // Current STLLoader has no way to track models between load and callback function so we have to function-ise the loop :S
    STLLoader = new THREE.STLLoader();
    for (var model in models){ 
        (function(mName){
            selectedModel = models[mName];
            selectedModel.id = model;
            STLLoader.load( selectedModel.src, function ( modelGeometry ) { 
                loadedModel = models[mName];
                modelGeometry.name = mName;
                switch (mName) {
                    case 'Jeebus': _x = -0.7; _y = 5.2, _z = 0.8; colour= 0xFFFFFF; break;
                    case 'Cthulhu': _x = -0.1; _y = 0.49*multiplier; _z = 0; colour= 0xff5533; break;
                    case 'Anubis': _x = -0.5; _y = 5.2; _z = 0.9; colour= 0xFFFF00; break;
                }
                loadedModel.material = new THREE.MeshLambertMaterial( { color: colour } );
                loadedModel.mesh = new THREE.Mesh(modelGeometry, loadedModel.material);
                loadedModel.mesh.position.set( _x, _y, _z );
                loadedModel.mesh.rotation.x = -90*(Math.PI/180);
                loadedModel.mesh.scale.set( 0.05, 0.05, 0.05 );
                loadedModel.mesh.castShadow = true;
                loadedModel.mesh.receiveShadow = false;
                loadedModel.mesh.visible = false;
                scene.add(loadedModel.mesh);
            }); 
        })(model);
    }
}

function showAngleChangePerSecond() {
    cAngle = earthMesh.rotation.y;
    angleChangePerS = cAngle - originalAngle;
    degrees = ~~(radToDeg(angleChangePerS) + 0.5);
    setHTMLByID('angleCount', degrees);
    originalAngle = cAngle;
}

function showGod() {
    if (models.Jeebus.mesh.visible==true) {
        models.Jeebus.mesh.visible=false;
        models.Cthulhu.mesh.visible=true;
        setHTMLByID('g0d', 'CTHULHU');
    } else if (models.Cthulhu.mesh.visible==true) {
        models.Cthulhu.mesh.visible=false;
        models.Anubis.mesh.visible=true;
        setHTMLByID('g0d', 'ANUBIS');
    } else if (models.Anubis.mesh.visible==true) {
        models.Anubis.mesh.visible=false;
        models.Jeebus.mesh.visible=true;
        setHTMLByID('g0d', 'JEEBUS');
    }  else {
        models.Cthulhu.mesh.visible=true;
        setHTMLByID('g0d', 'CTHULHU');
    }
}

function startTimer() {
    setInterval( function() {
        if (axialTiltEnabled==false) {
            showAngleChangePerSecond();
        }
        time = getByID('time').innerHTML; time++; setHTMLByID('time', time);
    }, 1000);
}