
/* Построение прямоугольной призмы, в основании которой лежит пятиугольник */ 
/* Варинат 7 Динамика (a) угол a = 60, угол b = 30*/ 

// расположение камеры 
const cameraPos = {
    x: 200,
    y: 200,
    z: 800
};

// высота осей
const axisHeight = 800;

// координаты верхнего пятиугольника
let topCoord = [];

// координаты ребер призмы
let faceCoord = [];

// коордианты нижнего пятиугольника
let bottomCoord = [];

// высота призмы
const height = 500;

// значение динамики
let rotation = 0;

// размер штрих-пунктира
const size = 10;

// угол поворота фигуры (60deg)
const angle = Math.PI / 3;

// вектор поворота
const axis = new THREE.Vector3(-0.5, 1, 0);

// цвета 
const bgColor = 0xece7e7;
const lineColor = 0xFF0000;

// материал линий
const defaultLineMaterial = {
    color: lineColor,
    dashSize: 5,
    gapSize: 0.0001,
    linewidth: 10
};

// материал для осевых линий
const material = new THREE.LineBasicMaterial({
    color: 0x000000
});

let camera, scene, renderer;

// кооридинаты основания призмы
const pentagonalPrismCoordinates = [
    [0, -100, 0],
    [100, -100, -173],
    [273, -100, -173],
    [373, -100, 0],
    [273, -100, 173],
    [100, -100, 173],
    [0, -100, 0]];

// координаты осей
const axisHelpersCoordinates = [
    [-50, 0, 0],
    [-50, 25, axisHeight],
    [-50, 0, 0],
    [-50, axisHeight / 2, 0],
    [-50, 0, 0],
    [axisHeight / 2, 0, 0]];

/* -----Инициализация----- */
init();
animate();

function init() {
    // создание и настройка камера 
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 10000);
    camera.position.z = cameraPos.z;
    camera.position.y = cameraPos.y;
    camera.position.x = cameraPos.x;

    scene = new THREE.Scene();
    camera.lookAt(scene.position);

    // создание и добавление осей на экран
    let geometry;
    for (let i = 0; i < axisHelpersCoordinates.length; i += 2) {
        geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(...axisHelpersCoordinates[i]),
            new THREE.Vector3(...axisHelpersCoordinates[i + 1]));
        scene.add(new THREE.Line(geometry, material).computeLineDistances());
    }

    for (var i = 0; i < pentagonalPrismCoordinates.length - 1; i++) {
        topCoord[i] = {
            geometry: new THREE.Geometry(),
            material: new THREE.LineDashedMaterial(defaultLineMaterial)
        };

        topCoord[i].geometry.vertices.push(getPrismVector3(i, 0), getPrismVector3(i + 1, 0));
        topCoord[i].line = new THREE.LineSegments(topCoord[i].geometry, topCoord[i].material).computeLineDistances();
        scene.add(topCoord[i].line);

        bottomCoord[i] = {
            geometry: new THREE.Geometry(),
            material: new THREE.LineDashedMaterial(defaultLineMaterial)
        };

        bottomCoord[i].geometry.vertices.push(getPrismVector3(i, height), getPrismVector3(i + 1, height));
        bottomCoord[i].line = new THREE.LineSegments(bottomCoord[i].geometry, bottomCoord[i].material).computeLineDistances();
        scene.add(bottomCoord[i].line);

        faceCoord[i] = {
            geometry: new THREE.Geometry(),
            material: new THREE.LineDashedMaterial(defaultLineMaterial)
        };
        faceCoord[i].geometry.vertices.push(getPrismVector3(i, 0), getPrismVector3(i, height));
        faceCoord[i].line = new THREE.LineSegments(faceCoord[i].geometry, faceCoord[i].material).computeLineDistances();
        scene.add(faceCoord[i].line);
    }

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setClearColor(bgColor, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    for (var i = 0; i < 6; i++) {
        topCoord[i].line.rotation.y = rotation
        faceCoord[i].line.rotation.y = rotation;
        bottomCoord[i].line.rotation.y = rotation;
    }

    rotation = (rotation >= 6.26 ? 0 : rotation + 0.017)

    if (rotation < 0.84 || rotation >= 6.7) {

        // установка невидимых граней нижней части
        topCoord[0].material.gapSize = size;
        topCoord[5].material.gapSize = size;
        topCoord[4].material.gapSize = size;

        // установка невидимых граней вертикальных частей
        faceCoord[0].material.gapSize = size;
        faceCoord[5].material.gapSize = size;
    }
    if (rotation >= 0.84 && rotation < 1.97) {

        // установка невидимых граней нижней части
        topCoord[0].material.gapSize = 0;
        topCoord[5].material.gapSize = 0;
        topCoord[4].material.gapSize = 0;

        bottomCoord[5].material.gapSize = size;
        bottomCoord[0].material.gapSize = size;
        bottomCoord[1].material.gapSize = size;

        faceCoord[1].material.gapSize = size;
        faceCoord[0].material.gapSize = size;

        // установка невидимых граней вертикальных частей
        faceCoord[5].material.gapSize = 0;
    }
    if (rotation >= 1.97 && rotation <= 2.91) {

        faceCoord[1].material.gapSize = size;
        faceCoord[2].material.gapSize = size;
        faceCoord[0].material.gapSize = 0;


        bottomCoord[2].material.gapSize = size;
        bottomCoord[5].material.gapSize = 0;
    }

    if (rotation >= 2.87 && rotation <= 3.76) {
        bottomCoord[0].material.gapSize = 0;
        bottomCoord[3].material.gapSize = size;

        faceCoord[1].material.gapSize = 0;
        faceCoord[3].material.gapSize = size;
    }

    if (rotation > 3.76 && rotation <= 4.90) {
        bottomCoord[4].material.gapSize = size;
        bottomCoord[1].material.gapSize = 0;

        faceCoord[3].material.gapSize = size;
        faceCoord[4].material.gapSize = size;
        faceCoord[2].material.gapSize = 0;
    }

    if (rotation > 4.90 && rotation <= 6.01) {
        bottomCoord[2].material.gapSize = 0;
        bottomCoord[3].material.gapSize = 0;
        bottomCoord[4].material.gapSize = 0;

        faceCoord[3].material.gapSize = 0;
        faceCoord[4].material.gapSize = size;
        faceCoord[2].material.gapSize = 0;
        faceCoord[5].material.gapSize = size;

        topCoord[5].material.gapSize = size;
        topCoord[4].material.gapSize = size;
        topCoord[3].material.gapSize = size;
    }

    if (rotation >= 6.02 && rotation <= 6.12) {
        faceCoord[4].material.gapSize = 0;
        faceCoord[0].material.gapSize = size;

        topCoord[3].material.gapSize = 0;
    }

    if (rotation >= 6.13 && rotation <= 6.25) {
        topCoord[0].material.gapSize = size;
    }
    renderer.render(scene, camera);
}

function getPrismVector3(index, height) {
    let vector = new THREE.Vector3(pentagonalPrismCoordinates[index][0], pentagonalPrismCoordinates[index][1] + height, pentagonalPrismCoordinates[index][2]);
    vector.applyAxisAngle(axis, angle);
    return vector;
}