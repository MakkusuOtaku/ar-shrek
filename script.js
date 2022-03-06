const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas when window is resized
window.addEventListener('resize', ()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(innerWidth, innerHeight );
});

// Fullscreen when tapped on mobile, or press f
addEventListener('touchstart', () => {
    canvas.requestFullscreen();
});

import * as THREE from "https://cdn.skypack.dev/three@0.134.0";

const loader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-5, 5, 5);
scene.add(light);

const light2 = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light2);

// Plane geometry
const shrekGeometry = new THREE.PlaneGeometry(1, 1.5, 1);
// Shrek material with texture from shrek.png
const shrekMaterial = new THREE.MeshBasicMaterial({
    map: loader.load('shrek.png'),
    color: 0xffffff,
    transparent: true,
});
const shreks = [];

function createShrek() {
    let shrek = new THREE.Mesh(shrekGeometry, shrekMaterial);
    shreks.push(shrek);
    scene.add(shrek);
}

createShrek();

const gyroData = document.getElementById('gyro-data');
const accelData = document.getElementById('accel-data');

let gyroscope = new Gyroscope({frequency: 10});
let acceleration = new Accelerometer({frequency: 10});

gyroscope.addEventListener('reading', e => {
    //gyroData.innerHTML = `X: ${gyroscope.x}<br>Y: ${gyroscope.y}<br>Z: ${gyroscope.z}`;
});

acceleration.addEventListener('reading', e => {
    //accelData.innerHTML = `X: ${acceleration.x}<br>Y: ${acceleration.y}<br>Z: ${acceleration.z}`;
});

gyroscope.start();
acceleration.start();

// Account for mobile orientation
window.addEventListener('deviceorientation', (event) => {
    gyroData.innerHTML = `
        B: ${event.beta}<br>
        G: ${event.gamma}
    `;

    camera.rotation.x = event.beta / 360 * Math.PI;
    camera.rotation.y = event.gamma / 360 * Math.PI;
});

// And accelerometer
window.addEventListener('devicemotion', (event) => {
    accelData.innerHTML = `
        X: ${event.acceleration.x}<br>
        Y: ${event.acceleration.y}<br>
        Z: ${event.acceleration.z}
    `;

    camera.position.x += event.acceleration.x;
    camera.position.y += event.acceleration.y;
});

const video = document.querySelector('video');
//video.style.width = '100%';
//video.style.height = '100%';

navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
        facingMode: 'environment',
    },
}).then(function success(stream) {
    video.srcObject = stream;
});

setInterval(() => {
    renderer.render(scene, camera);
}, 1000 / 60);