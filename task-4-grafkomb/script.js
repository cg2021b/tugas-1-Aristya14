import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import {GLTFLoader} from './js/GLTFLoader.js';
import {Reflector} from './jsm/objects/Reflector.js';
import * as dat from './jsm/libs/dat.gui.module.js'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

// Dat GUI
const gui = new dat.GUI()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})


// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100);
camera.position.x = -10;
camera.position.y = 10;
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.autoRotate = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.render(scene, camera, controls);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaOutput = true;



//Panorama untuk background canvas
const panorama = new THREE.CubeTextureLoader();
const textureBg = panorama.load([
  'pantai/px.png',
  'pantai/nx.png',
  'pantai/py.png',
  'pantai/ny.png',
  'pantai/pz.png',
  'pantai/nz.png',

]);
scene.background = textureBg;

// Latar lautnya
const loader4 = new THREE.TextureLoader();
const sea = loader4.load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqIFevUSF5S_jr6UVPI-pZGyL18nPyYAgllf1_Wmxda2wxunogTuZqx-TkmlJv8mNKzPo&usqp=CAU');
sea.wrapS = THREE.RepeatWrapping;
sea.wrapT = THREE.RepeatWrapping;
const repeats = 1;
sea.repeat.set(repeats, repeats);

let seaPlane = new THREE.BoxGeometry(50, 50);
let seaMaterial = new THREE.MeshLambertMaterial({
    map:sea

});


let plane = new THREE.Mesh(seaPlane,seaMaterial);
plane.rotation.x = Math.PI / 2;
plane.position.y = -4;
plane.receiveShadow = true;
scene.add(plane);

/**
 * SceneGraph
 */ 
function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }

// Object gltf
const loader = new GLTFLoader()
loader.load('./objek/scene.gltf', function(gltf){
        const root = gltf.scene;
        root.position.x = 2;
        root.position.y = 2;
        root.position.z = 4;
        root.scale.x = 2;
        root.scale.y = 2;
        root.scale.z = 2;
        scene.add(root);
        // console.log(dumpObject(root).join('\n'));

        root.traverse(n => { if ( n.isMesh ) {
          n.castShadow = true; 
          n.receiveShadow = true;
        }});

})

//Lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(-100,100,100);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x000000);
scene.add(ambientLight);

//pershadow an
const solarLight = new THREE.DirectionalLight();
solarLight.position.set(500, 500, -500);
solarLight.castShadow = true;
solarLight.intensity = 2;
solarLight.shadow.mapSize.width = 1024;
solarLight.shadow.mapSize.height = 1024;
solarLight.shadow.camera.near = 250;
solarLight.shadow.camera.far = 900;

let intensity=50;

solarLight.shadow.camera.left = -intensity;
solarLight.shadow.camera.right = intensity;
solarLight.shadow.camera.top = intensity;
solarLight.shadow.camera.bottom  = -intensity;
scene.add(solarLight);

// Tampilan Fog
class FogGUIHelper {
  constructor(fog, backgroundColor) {
    this.fog = fog;
    this.backgroundColor = backgroundColor;
  }
  get near() {
    return this.fog.near;
  }
  set near(v) {
    this.fog.near = v;
    this.fog.far = Math.max(this.fog.far, v);
  }
  get far() {
    return this.fog.far;
  }
  set far(v) {
    this.fog.far = v;
    this.fog.near = Math.min(this.fog.near, v);
  }
  get color() {
    return `#${this.fog.color.getHexString()}`;
  }
  set color(hexString) {
    this.fog.color.set(hexString);
    this.backgroundColor.set(hexString);
  }
}

// fog
const near = 20;
const far = 70;
scene.fog = new THREE.Fog(near, far);

// fog helper
const fogGUIHelper = new FogGUIHelper(scene.fog, scene.background);
gui.add(fogGUIHelper, 'near', near, far).listen();
gui.add(fogGUIHelper, 'far', near, far).listen();
gui.addColor(fogGUIHelper, 'color');

// Object: Realistic reflective
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
let sphereCamera = new THREE.CubeCamera(1,500,cubeRenderTarget);
sphereCamera.position.set(0, 0, 0);
scene.add(sphereCamera);
const sphereMirror = new THREE.MeshBasicMaterial({
  envMap: sphereCamera.renderTarget.texture,
});
const sphereGeo = new THREE.SphereGeometry(2, 32 , 16);
const mirrorBall = new THREE.Mesh( sphereGeo, sphereMirror);
mirrorBall.position.y = 3;
mirrorBall.position.x = -3;
scene.add(mirrorBall);


/**
 * Animate
 */

const tick = () =>
{

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    sphereCamera.update(renderer, scene);
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}
tick();