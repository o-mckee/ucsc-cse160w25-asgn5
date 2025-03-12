import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

function main() {
    // look up canvas
    const canvas = document.querySelector('#c');
    // create WebGLRenderer, renders all data you provide to the canvas
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.shadowMap.enabled = true;

    const fov = 45;
    const aspect = 2; // canvas default
    const near = 0.1;
    const far = 100;
    
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('0xaaaaaa');

    let fogOn = false;
    document.getElementById('fogOn').onclick = function() {fogOn = true; };
    document.getElementById('fogOff').onclick = function() {fogOn = false; };
    if (fogOn == true) {
        scene.fog = new THREE.FogExp2(0xaaaaaa, 0.03);
    } else {
        scene.fog = null;
    }

    // ADD SKYBOX
    {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            'public/nightsky.jpg',
            'public/nightsky.jpg',
            'public/nightsky.jpg',
            'public/nightsky.jpg',
            'public/nightsky.jpg',
            'public/nightsky.jpg'
        ]);
        scene.background = texture;
    }

    // ADD FLOOR PLANE
    {
        const planeSize = 60;
 
        const loader = new THREE.TextureLoader();
        const texture = loader.load('public/snow.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.receiveShadow = true;
        mesh.rotation.x = Math.PI * -0.5;
        scene.add(mesh);
    }

    // ADD CUBE
    const cubeSize = 3;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cLoader = new THREE.TextureLoader();
    const cText = cLoader.load('public/diamondOre.jpg');
    const cubeMat = new THREE.MeshPhongMaterial({map: cText});
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.position.set(15, 2, 0);
    mesh.rotation.y = 10;
    scene.add(mesh);

    function makeCube(cColor, posX, posY, posZ) {
        const cSize = 2;
        const cGeo = new THREE.BoxGeometry(cSize, cSize, cSize);
        const cMat = new THREE.MeshPhongMaterial({color: cColor});
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.x = posX * 2;
        cMesh.position.y = 1 + (posY * 2);
        cMesh.position.z = posZ * 2;
        cMesh.castShadow = true;
        cMesh.receiveShadow = true;
        scene.add(cMesh);
    }

    function makeCubeSize(cColor, posX, posY, posZ, sizeX, sizeY, sizeZ) {
        const cGeo = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
        const cMat = new THREE.MeshPhongMaterial({color: cColor});
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.x = posX * 2;
        cMesh.position.y = 1 + (posY * 2);
        cMesh.position.z = posZ * 2;
        cMesh.castShadow = true;
        cMesh.receiveShadow = true;
        scene.add(cMesh);
    }

    function makeCubeTexture(posX, posY, posZ, path, transparentBool) {
        const cSize = 2;
        const cGeo = new THREE.BoxGeometry(cSize, cSize, cSize);
        const loader = new THREE.TextureLoader();
        const texture = loader.load(path);
        const cMat = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: transparentBool
        });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.x = posX * 2;
        cMesh.position.y = 1 + (posY * 2);
        cMesh.position.z = posZ * 2;
        cMesh.castShadow = true;
        cMesh.receiveShadow = true;
        scene.add(cMesh);
    } 

    function makeSnowGrassBlock(posX, posY, posZ) {
        const cSize = 2;
        const cGeo = new THREE.BoxGeometry(cSize, cSize, cSize);
        const loader = new THREE.TextureLoader();
        const snowMat = new THREE.MeshPhongMaterial({map: loader.load('public/snow.jpg')});
        const snowGrassMat = new THREE.MeshPhongMaterial({map: loader.load('public/snowGrass.jpg')});
        const dirtMat = new THREE.MeshPhongMaterial({map: loader.load('public/dirt.jpg')});
        const mats = [
            snowGrassMat,
            snowGrassMat,
            snowMat,
            dirtMat,
            snowGrassMat,
            snowGrassMat
        ];
        const cMesh = new THREE.Mesh(cGeo, mats);
        cMesh.position.x = posX * 2;
        cMesh.position.y = 1 + (posY * 2);
        cMesh.position.z = posZ * 2;
        cMesh.castShadow = true;
        cMesh.receiveShadow = true;
        scene.add(cMesh);
    } 

    function makeCubeTextureSize(posX, posY, posZ, path, transparentBool, sizeX, sizeY, sizeZ) {
        const cGeo = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
        const loader = new THREE.TextureLoader();
        const texture = loader.load(path);
        const cMat = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: transparentBool
        });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.x = posX * 2;
        cMesh.position.y = 1 + (posY * 2);
        cMesh.position.z = posZ * 2;
        cMesh.castShadow = true;
        cMesh.receiveShadow = true;
        scene.add(cMesh);
    }

    makeCube(0x448844, -3, 0, 1);

      // ADD SPHERE
    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: 0x882200});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-20, 3, -10);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    }

    // ADD CYLINDER (flagpole)
    {
        const radiusTop = 0.5;
        const radiusBot = 0.5;
        const cylHeight = 10;
        const cylRadSegments = 12; // 25 also works
        const cylGeo = new THREE.CylinderGeometry(radiusTop, radiusBot, cylHeight, cylRadSegments);
        const cylMat = new THREE.MeshPhongMaterial({color: 0x662200});
        const cylMesh = new THREE.Mesh(cylGeo, cylMat);
        cylMesh.position.z = -18;
        cylMesh.position.y = 13;
        cylMesh.position.x = -7;
        cylMesh.castShadow = true;
        cylMesh.receiveShadow = true;
        scene.add(cylMesh);
    }

    // ADD FLAG

    const flagSize1 = 5;
    const flagSize2 = 3;
    const flagWidth = 0.5;
    const flagGeo = new THREE.BoxGeometry(flagSize1, flagSize2, flagWidth);
    const flagMat = new THREE.MeshPhongMaterial({color: 0x222288});
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(-4,16,-18);
    flagMesh.castShadow = true;
    flagMesh.receiveShadow = true;
    scene.add(flagMesh);

    // ADD FLAGPOLE SPHERE
    const sphereRadius = 0.75;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: 0xaa9900});
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.set(-7, 18, -18);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    scene.add(sphereMesh);

    // ADD FISH
    // add 3d model (.obj)
    {
        const objLoader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        mtlLoader.load('public/fish.mtl', (mtl) => {
            mtl.preload();
            for (const material of Object.values(mtl.materials)) {
                material.side = THREE.DoubleSide;
            }
            objLoader.setMaterials(mtl);
        });

        objLoader.load('public/fish.obj', (fishObjRoot) => {
            fishObjRoot.scale.setScalar(2);
            scene.add(fishObjRoot);
            fishObjRoot.position.set(-15, 5, 13);
        });
    }

    // MAKE STONE BRICK BUILDING
    {

        // floor
        for (let i = -10; i < -4; i++) {
            for (let j = -5; j < 5; j++) {
                makeCubeTexture(j, 0, i, 'public/stonebrick.jpg');
            }
        }

        // back
        for (let i = 1; i <= 3; i++) {
            for (let j = -5; j < 5; j++) {
                makeCubeTexture(j, i, -10, 'public/stonebrick.jpg');
                if (i == 1 && Math.abs(j) % 2 == 1) {
                    makeCubeTexture(j, 4, -10, 'public/stonebrick.jpg');
                }
            }
        }
    
        // front
        for (let i = 1; i <= 2; i++) {
            for (let j = -5; j < 5; j++) {
                if (j != -1) { // door space
                    makeCubeTexture(j, i, -5, 'public/stonebrick.jpg');
                }
                if (i == 1) {
                    makeCubeTexture(j, 3, -5, 'public/stonebrick.jpg'); // full line
                    if (Math.abs(j) % 2 == 0) { // uneven placement
                        makeCubeTexture(j, 4, -5, 'public/stonebrick.jpg');
                    }
                }

            }
        }

        // left side
        for (let i = 1; i <= 2; i++) {
            for (let j = -9; j < -5; j++) {
                makeCubeTexture(-5, i, j, 'public/stonebrick.jpg');
                if (i == 1) {
                    makeCubeTexture(-5, 3, j, 'public/stonebrick.jpg'); // full line
                    if (Math.abs(j) % 2 == 0) {
                        makeCubeTexture(-5, 4, j, 'public/stonebrick.jpg');
                    }
                }
            }
        }

        // right side
        for (let i = 1; i <= 2; i++) {
            for (let j = -9; j < -5; j++) {
                makeCubeTexture(4, i, j, 'public/stonebrick.jpg');
                if (i == 1) {
                    makeCubeTexture(4, 3, j, 'public/stonebrick.jpg'); // full line
                    if (Math.abs(j) % 2 == 1) {
                        makeCubeTexture(4, 4, j, 'public/stonebrick.jpg');
                    }
                }
            }
        }

        // ceiling
        for (let i = -9; i < -5; i++) {
            for (let j = -4; j < 4; j++) {
                makeCubeTexture(j, 3, i, 'public/stonebrick.jpg');
            }
        }

    
    }

    // MAKE SNOW HILL
    {
        for (let i = 5; i < 15; i++) { // x
            for (let j = 0; j < 1; j++) { // y 
                for (let k = 9; k < 14; k++) { // z
                    makeSnowGrassBlock(i, j, k);
                    if (i > 5 && i < 14 && k > 10 && k < 13) {
                        makeSnowGrassBlock(i, j+1, k);
                    }
                }
            }
        }
    }

    // MAKE ICE CUBE
    makeCubeTextureSize(-10, 2, 7, 'public/ice.png', true, 11, 11, 11);


    class ColorGUIHelper {
        constructor(object, prop) {
            this.object = object;
            this.prop = prop;
        }
        get value() {
            return `#${this.object[this.prop].getHexString()}`;
        }
        set value(hexString) {
            this.object[this.prop].set(hexString);
        }
    }

    class DegRadHelper {
        constructor(obj, prop) {
          this.obj = obj;
          this.prop = prop;
        }
        get value() {
          return THREE.MathUtils.radToDeg(this.obj[this.prop]);
        }
        set value(v) {
          this.obj[this.prop] = THREE.MathUtils.degToRad(v);
        }
      }

    function makeXYZGUI(gui, vector3, name, onChangeFn) {
        const folder = gui.addFolder(name);
        folder.add(vector3, 'x', -30, 10).onChange(onChangeFn);
        folder.add(vector3, 'y', 0, 20).onChange(onChangeFn);
        folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
        folder.open();
    }

    // ADD LIGHTS AND LIGHT GUI
    {

        // spotlight
        const color = 0xFFFFFF;
        const intensity = 550;
        const light = new THREE.SpotLight(color, intensity, 0, Math.PI/8);
        light.position.set(-20, 12, 5);
        light.target.position.set(-20, 7, -5);
        light.castShadow = true;
        light.shadow.camera.top = 60;
        light.shadow.camera.bottom = -60;
        light.shadow.camera.left = -60;
        light.shadow.camera.right = 60;
        scene.add(light);
        scene.add(light.target);

        const helper = new THREE.SpotLightHelper(light);
        scene.add(helper);

        const onChange = () => {
            light.target.updateMatrixWorld();
            helper.update();
        };

        onChange();

        const gui = new GUI();
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('Color');
        gui.add(light, 'intensity', 0, 550, 0.01).name('Intensity');
        gui.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('Angle').onChange(onChange);
        gui.add(light, 'penumbra', 0, 1, 0.01).name('Penumbra');

        makeXYZGUI(gui, light.position, 'Spotlight Position', onChange);
        makeXYZGUI(gui, light.target.position, 'Spotlight Target', onChange);


        // directional light
        const dirColor = 0xFFFFFF;
        const dirIntensity = 4;
        const dirLight = new THREE.DirectionalLight(dirColor, dirIntensity);
        dirLight.position.set(20, 15, 20);
        dirLight.target.position.set(0, 2, 0);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 60;
        dirLight.shadow.camera.bottom = -60;
        dirLight.shadow.camera.left = -60;
        dirLight.shadow.camera.right = 60;
        scene.add(dirLight);
        scene.add(dirLight.target);

        const dirHelper = new THREE.DirectionalLightHelper(dirLight);
        scene.add(dirHelper);

        // ambient light
        const ambColor = 0xFFFFFF;
        const ambIntensity = 0.75;
        const ambLight = new THREE.AmbientLight(ambColor, ambIntensity);
        scene.add(ambLight);
    }

    function resizeRenderer(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }

        return needResize;
    }

    function render(time) {

        if (fogOn == true) {
            scene.fog = new THREE.FogExp2(0xaaaaaa, 0.03);
        } else {
            scene.fog = null;
        }

        time *= 0.001;
        mesh.rotation.z = time;
        mesh.rotation.x = time;
        

        if (resizeRenderer(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

}

main();