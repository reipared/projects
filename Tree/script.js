// Settings

let container, camera, scene, artwork, renderer;
let windowHalfX= window.innerWidth / 2;
let windowHalfY= window.innerWidth / 2;

// Map

const map= (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

// Resize

const onWindowResize = () => {
    camera.aspect= container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
};

// Init

init= () => {
    container= document.querySelector("#canvas");
    scene= new THREE.Scene();
    createCamera();
    createControls();
    createLights();
    createMeshes();
    createRenderer();

document.addEventListener("mousemove", mouseMove, false);

window.addEventListener("resize", onWindowResize);
    renderer.setAnimationLoop(() => {
        renderer();
    });
};

createCamera= () => {
    camera= new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);

    camera.position.set(-25, 5, 20);
};

function createControls() {
    controls= new THREE.OrbitControls(camera, container);
}

// Lights

const createLights= () => {
    const ambientLight= new THREE.HemisphereLight(0xddeeff, 0x202020, 5);
    scene.add(ambientLight);
};

// Geometry

const extraGeometry= () => {
    let geometry= new THREE.Geometry();
    const particlesLength= 10000;

    for (var i= 0; i < particlesLength; i++) {
        var vertex= new THREE.Vector3();
        var color= new THREE.Vector3();
        const d= map(i, 0, particlesLength, 0, Math.PI * 50);
        vertex.x= i * 0.003 * Math.sin(d);
        vertex.y= -i * 0.008 + Math.sin(i * 3 + i * 0.5) * 0.5;
        vertex.z= i * 0.003 * Math.cos(d);

        geometry.vertices.push(vertex);
        geometry.colors.push(new THREE.Color('#00FFC6'), new THREE.Color('#F900BF'), new THREE.Color('#FFC600'), new THREE.Color('#06FF00'));

    }

    let particles= new THREE.Points(geometry, new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors, size: 0.1
    }));
    let extraGroup= new THREE.Group();
    extraGroup.add(particles);
    return extraGroup;
};

// Mesh

const createMeshes= () => {
    const sparklyBall= extraGeometry();
    artwork= new THREE.Group();
    artwork.position.y= 9;
    artwork.add(sparklyBall);

    scene.add(artwork);
};

// Animate

const animate= () => {
    requestAnimationFrame(animate);
};
animate();

//Renderer

const createRenderer= () => {
    renderer= new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaFactor= 2.5;
    renderer.gammaOutput= true;
    renderer.physicallyCorrectLights= true;
    container.appendChild(renderer.domElement);
};

// Mousemove

let mouseX= mouseY= 1;
const mouseMove= event => {
    isMouseMoved= true;
    mouseX= event.clientX - windowHalfX;
    mouseY= event.clientY - windowHalfY;
};

// Render

const render= () => {
    if (artwork) {
        artwork.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
};
init();