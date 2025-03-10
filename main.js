function main() {
    // look up canvas
    const canvas = document.querySelector('#c');
    // create WebGLRenderer, renders all data you provide to the canvas
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const fov = 75; // field of view
    const aspect = 2; // aspect ratio (2 is default, aka 350/150)
    const near = 0.1; // near plane
    const far = 5; // far plane

    // create a new perspective camera: camera
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


    // move camera back to see cube on origin
    camera.position.z = 2;

    // create three.js Scene
    const scene = new THREE.Scene();


    // MAKE A CUBE:

    // create a BoxGeometry with the width, height, and depth
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshBasicMaterial({color: 0x44aa88});

    // create the cube mesh using the geometry and the material
    const cube = new THREE.Mesh(geometry, material);

    // add the first cube mesh to the scene itself
    scene.add(cube);

    // RENDER THE SCENE:
    renderer.render(scene, camera);

}