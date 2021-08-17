import * as THREE from 'three';
export class Stage {
    constructor() {
        this.renderParam = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometry = null;
        this.material = null;
        this.mesh = null;
        this.isInitialized = false;
    }
    init() {
        this._setScene();
        this._setRender();
        this._setCamera();
        this._setFog();
        this.isInitialized = true;
    }
    _setScene() {
        this.scene = new THREE.Scene();
    }
    _setRender() {
        const elem = document.getElementById('webgl-planet');
        this.renderer = new THREE.WebGLRenderer({
            canvas: elem,
            alpha: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.renderParam.width, this.renderParam.height / 2);
    }
    _setCamera() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight / 2;
        if (!this.isInitialized) {
            this.camera = new THREE.PerspectiveCamera(2, this.renderParam.width / this.renderParam.height / 2);
        }
        this.camera.aspect = windowWidth / windowHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(windowWidth, windowHeight);
    }
    _setFog() {
        this.scene.fog = new THREE.Fog(0x000000, 50, 2000);
    }
    _render() {
        let rot = 0;
        rot += 0.1;
        const radian = (rot * Math.PI) / 180;
        this.camera.position.x = 1000 * Math.sin(radian);
        this.camera.position.z = 1000 * Math.cos(radian);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.renderer.render(this.scene, this.camera);
    }
    onResize() {
        this._setCamera();
    }
    onRaf() {
        this._render();
    }
}
export class Mesh {
    constructor(stage) {
        this.stage = stage;
        this.meshLine = null;
        this.meshPlanet = null;
        this.lineFlag = true;
    }
    init() {
        this._setMesh();
    }
    _setMesh() {
        const geometryLine = new THREE.RingGeometry(18, 15, 32);
        const textureLine = new THREE.TextureLoader().load('../images/test-texture.png');
        const materialLine = new THREE.MeshBasicMaterial({
            map: textureLine,
            flatShading: true,
            side: THREE.FrontSide,
        });
        this.meshLine = new THREE.Mesh(geometryLine, materialLine);
        this.stage.scene.add(this.meshLine);
        this.meshLine.rotation.x = 2;
        const geometryPlanet = new THREE.SphereGeometry(11, 32, 32);
        const texturePlanet = new THREE.TextureLoader().load('../images/test-texture.png');
        texturePlanet.wrapS = THREE.RepeatWrapping;
        texturePlanet.wrapT = THREE.RepeatWrapping;
        texturePlanet.repeat.set(2, 1);
        const materialPlanet = new THREE.MeshBasicMaterial({
            map: texturePlanet,
            flatShading: true,
            side: THREE.FrontSide,
        });
        this.meshPlanet = new THREE.Mesh(geometryPlanet, materialPlanet);
        this.stage.scene.add(this.meshPlanet);
    }
    _render() {
        this.meshPlanet.rotation.y += 0.005;
        if (Math.floor(this.meshLine.rotation.y * 10) / 10 === 0.4) {
            this.lineFlag = false;
        }
        else if (Math.floor(this.meshLine.rotation.y * 10) / 10 === -0.4) {
            this.lineFlag = true;
        }
        if (this.lineFlag) {
            this.meshLine.rotation.y += 0.002;
        }
        else if (!this.lineFlag) {
            this.meshLine.rotation.y -= 0.002;
        }
    }
    onRaf() {
        this._render();
    }
}
