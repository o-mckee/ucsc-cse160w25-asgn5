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
    scene.background = new THREE.Color('black');

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
        const planeSize = 40;
 
        const loader = new THREE.TextureLoader();
        const texture = loader.load('public/stonebrick.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -0.5;
        scene.add(mesh);
    }

    // ADD CUBE
    {
        const cubeSize = 4;
        const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
        const mesh = new THREE.Mesh(cubeGeo, cubeMat);
        mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
        scene.add(mesh);
    }

    function makeCube(cColor) {
        const cSize = 2;
        const cGeo = new THREE.BoxGeometry(cSize, cSize, cSize);
        const cMat = new THREE.MeshPhongMaterial({color: cColor});
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.y = 1
        scene.add(cMesh);
    }

    makeCube(0x448844); 

      // ADD SPHERE
    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
        scene.add(mesh);
    }

    // ADD CYLINDER
    {
        const radiusTop = 2;
        const radiusBot = 2;
        const cylHeight = 4;
        const cylRadSegments = 12;
        const cylGeo = new THREE.CylinderGeometry(radiusTop, radiusBot, cylHeight, cylRadSegments);
        const cylMat = new THREE.MeshPhongMaterial({color: 0x884488});
        const cylMesh = new THREE.Mesh(cylGeo, cylMat);
        cylMesh.position.y = 1;
        cylMesh.position.x = 15;
        scene.add(cylMesh);
    }

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
            fishObjRoot.position.set(3, 0, -2);
        });

        objLoader.load('public/hat.obj', (hatObjRoot) => {
            hatObjRoot.scale.setScalar(2);
            scene.add(hatObjRoot);
        });
    }

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

    function makeXYZGUI(gui, vector3, name, onChangeFn) {
        const folder = gui.addFolder(name);
        folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
        folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
        folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
        folder.open();
    }

    // ADD LIGHTS AND LIGHT GUI
    {

        // ambient light
        const ambColor = 0xFFFFFF;
        const ambIntensity = 0.75;
        const ambLight = new THREE.AmbientLight(ambColor, ambIntensity);
        scene.add(ambLight);

        // directional light
        const color = 0xFFFFFF;
        const intensity = 7;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-10, 10, 5);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);

        // point light
        const pointColor = 0xFFFFFF;
        const pointIntensity = 250;
        const pointLight = new THREE.PointLight(color, pointIntensity);
        pointLight.position.set(0, 10, -10);
        scene.add(pointLight)

        // point light mesh
        {
            const pointSize = 1;
            const pointGeo = new THREE.BoxGeometry(pointSize, pointSize, pointSize);
            const pointMat = new THREE.MeshBasicMaterial({color: 0xFFF933});
            const pointMesh = new THREE.Mesh(pointGeo, pointMat);
            pointMesh.position.set(10, 10, -10);
            scene.add(pointMesh);
        }


        const helper = new THREE.DirectionalLightHelper(light);
        scene.add(helper);

        function updateLight() {
            light.target.updateMatrixWorld();
            helper.update();
        }
        updateLight();

        const gui = new GUI();
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
        gui.add(light, 'intensity', 0, 5, 0.01);

        makeXYZGUI(gui, light.position, 'Directional Light Position', updateLight);
        makeXYZGUI(gui, light.target.position, 'Directional Light Target', updateLight);
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

    function render() {
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