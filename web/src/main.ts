import * as THREE from "three";
import "./style.css";

let acc: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
const SCALAR = 2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 0.1, 1.75);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const phone = new THREE.Mesh(geometry, material);
scene.add(phone);

const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -10;
scene.add(plane);

const lightTop = new THREE.DirectionalLight(0xffffff, 0.5);
lightTop.position.set(0, 10, 0);
scene.add(lightTop);

const lightBottom = new THREE.DirectionalLight(0xffffff, 0.5);
lightBottom.position.set(0, -10, 0);
scene.add(lightBottom);

const lightLeft = new THREE.DirectionalLight(0xffffff, 0.5);
lightLeft.position.set(-10, 0, 0);
scene.add(lightLeft);

const lightRight = new THREE.DirectionalLight(0xffffff, 0.5);
lightRight.position.set(10, 0, 0);
scene.add(lightRight);

const lightFront = new THREE.DirectionalLight(0xffffff, 0.5);
lightFront.position.set(0, 0, 10);
scene.add(lightFront);

const socket = new WebSocket("ws://localhost:8082");
socket.addEventListener("open", (e) => {
    console.log("Socket opened", e);
});
socket.addEventListener("close", (e) => {
    console.log("Socket closed", e);
});
socket.addEventListener("message", (e) => {
    acc = JSON.parse(e.data) as { x: number; y: number; z: number };
    console.log(acc);
});

function animate() {
    phone.position.x += acc.x * SCALAR;
    phone.position.y += acc.z * SCALAR;
    phone.position.z += acc.y * SCALAR;

    camera.position.x = phone.position.x;
    camera.position.y = phone.position.y + 2;
    camera.position.z = phone.position.z + 5;
    camera.lookAt(phone.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
