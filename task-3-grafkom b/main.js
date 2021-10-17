//list warna
const colorList = [
  //hijau botol, kuning, ungu muda
  "rgb(1, 93, 25)", "rgb(255, 255, 51)", "rgb(172, 143, 236)",
  //pink tua, hijau tua, magenta
  "rgb(255, 51, 255)", "rgb(0, 140, 0)", "rgb(255, 3, 110)",
  //merah, coklat, navy
  "rgb(255, 0, 0)", "rgb(126, 70, 34)", "rgb(23, 39, 137)",
  //hitam, maroon
  "rgb(1, 1, 1)", "rgb(88, 1, 1)",
]

const randomInRange = (from, to, convertInt = false) => {
  let x = Math.random() * (to - from);

  if (convertInt) return Math.floor(x + from);
  return x + from;
};

//geometry
const createCone=() => {
  const color = colorList[Math.floor(Math.random() * (colorList.length))]
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(4, 3.5, 4),
    new THREE.MeshPhysicalMaterial({ color: color, metalness: 0.1, roughness: 0.4})
  );
  cone.click = false;
  cone.name = "cone";
  cone.visible = false;
  cone.coupleColor = color;
  //posisi
  cone.position.x = randomInRange(-25, 25);
  cone.position.y = randomInRange(-20, 20);
  cone.position.z = randomInRange(-25, 25);
  return cone;
};

const numberInRange = (from, to, increment = 1) => {
  let arr = [];
  for (let i = from; i <= to; i += increment) {
    arr.push(i);
  }
  return arr;
};

// batasan banyak objek
const OBJECT_TOTAL = 70;
let colorSet = numberInRange(0, 1, 1 / (OBJECT_TOTAL / 2));
let currentColor = 0;

const createCouple = () => {
  const randomColor = colorList[Math.floor(Math.random() * (colorList.length - 1))]
  const couple = [];
  couple.push(createCone(randomColor), createCone(randomColor));
  return couple;
};
const SELECT = document.querySelector("#seleksi");
const PLAY_BUTTON = document.querySelector("#play-button");
const SCORE = document.querySelector("#score");
const GAMEOVER = document.querySelector("#gameover");

//Canvas
const canvas = document.querySelector("canvas.webgl");

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(222, 173, 255)");

// // //lighting
scene.add(new THREE.AmbientLight(0xffffbb, 0.7));
scene.add(new THREE.DirectionalLight(0xffffff, 0.3));


//size
const sizes = {
  width: 0.9 * window.innerWidth,
  height: 0.9 * window.innerHeight,
};

//Kamera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(5, 10, 50);

const orbitControls = new THREE.OrbitControls(camera, canvas);
orbitControls.target.set(0, 5, 0);
orbitControls.enableZoom = false;
orbitControls.update();

//RayCaster
const rayCast = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.x = mouse.y = -1;


// Render
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Interactive Action
let gameOver = true;
let selected = [];
let spawnSpeed = 0.005;
let bufferSpeed = 0;
let visibles = [];
let notVisibles = numberInRange(2, OBJECT_TOTAL + 1);

PLAY_BUTTON.addEventListener("click", () => {
  gameOver = false;
  selected = [];
  spawnSpeed = 0.005;
  bufferSpeed = 0;
  visibles = [];
  currentColor = 0;
  notVisibles = numberInRange(2, OBJECT_TOTAL + 1);

  for (; scene.children.length > 2;) {
    scene.remove(scene.children[2]);
  }

  // Create Geometry
  let copBuffer;
  for (let i = 0; i < OBJECT_TOTAL / 2; i++) {
    copBuffer = createCouple();
    scene.add(copBuffer[0]);
    scene.add(copBuffer[1]);
  }

  PLAY_BUTTON.disabled = true;
  SCORE.innerHTML = 0;
  SELECT.innerHTML = 0;
  GAMEOVER.style.display = "none";
});

window.addEventListener("resize", () => {
  // Update ukuran
  sizes.width = 0.9 * window.innerWidth;
  sizes.height = 0.9 * window.innerHeight;
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Update kamera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();  
});

canvas.addEventListener("click", (e) => {
  if (!gameOver) {
    mouse.x = (e.offsetX / sizes.width) * 2 - 1;
    mouse.y = -(e.offsetY / sizes.height) * 2 + 1;
    rayCast.setFromCamera(mouse, camera);
    let items = rayCast.intersectObjects(scene.children, false);
    let selectFirstItem = true;
    items.forEach((item) => {
      if (item.object.visible && !item.object.click && selectFirstItem) {
        selected.push(item.object);
        item.object.material.color.set(0xffffff);
        item.object.click = true;
        selectFirstItem = false;
      }
    });

    if (selected.length == 2) {
      if (selected[0].coupleColor == selected[1].coupleColor) {
        console.log("benar");
        selected.forEach((select) => {
          select.visible = false;
          select.material.color.set(select.coupleColor);
          select.click = false;
          for (let i = 2; i <= OBJECT_TOTAL + 1; i++) {
            if (scene.children[i] === select) {
              console.log("ketemu");
              for (let j = 0; j < visibles.length; j++) {
                if (visibles[j] == i) {
                  notVisibles.push(visibles.splice(j, 1));
                  break;
                }
              }
              break;
            }
          }
        });
        //score
        SCORE.innerHTML++;
      } else {
        console.log("salah");
        selected.forEach((select) => {
          select.material.color.set(select.coupleColor);
          select.click = false;
        });
      }
      selected = [];
    }
    SELECT.innerHTML = selected.length;
  }
});

const mainLoop = () => {
  if (!gameOver) bufferSpeed += spawnSpeed;
  if (bufferSpeed >= 1 && notVisibles.length) {
    let spawnIndex = notVisibles.splice(
      randomInRange(0, notVisibles.length - 1),
      1
    );
    visibles.push(...spawnIndex);
    scene.children[spawnIndex].visible = true;

    bufferSpeed = 0;
    spawnSpeed += 0.0002;
  }

  if (visibles.length == OBJECT_TOTAL) {
    gameOver = true;
    PLAY_BUTTON.disabled = false;
    GAMEOVER.style.display = "block";
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(mainLoop);
};

mainLoop();