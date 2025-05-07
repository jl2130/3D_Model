let scene, camera, renderer, controls;
let currentModel = null;
let isWireframe = false;
let isLightingEnabled = true;
let isSquashAnimationEnabled = false;
let originalScale = new THREE.Vector3(1, 1, 1);
let animationStartTime = 0;
const ANIMATION_DURATION = 8000;
let directionalLight;
let ambientLight;



function animation() {
    requestAnimationFrame(animation);
    
    if (isSquashAnimationEnabled && currentModel) {
        const elapsed = Date.now() - animationStartTime;
        
        if (elapsed >= ANIMATION_DURATION) {
            isSquashAnimationEnabled = false;
            currentModel.scale.copy(originalScale);
            currentModel.rotation.z = 0;
            return;
        }
        
        const progress = elapsed / ANIMATION_DURATION;
        
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        
        const scaleY = originalScale.y * (1 - easeProgress * 0.8);
        
        const scaleXZ = originalScale.x * (1 + easeProgress * easeProgress * 0.2);
        
        currentModel.scale.set(scaleXZ, scaleY, scaleXZ);
        
        const rotationAmount = Math.sin(progress * Math.PI) * 0.03;
        currentModel.rotation.z = rotationAmount;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

function load3DModel(modelName) {
    if (currentModel !== null) {
        scene.remove(currentModel);
        currentModel = null;
    }

    const loader = new THREE.GLTFLoader();
    const modelPath = `./models/${modelName}.glb`;


    loader.load(
        modelPath,
        gltf => {
            console.log(`Model loaded: ${modelName}`);
            currentModel = gltf.scene;
            
            currentModel.traverse(node => {
                if (node.isMesh) {
                    if (node.material) {
                        node.material.needsUpdate = true;
                        node.material.metalness = 0.5;
                        node.material.roughness = 0.5;
                        node.material.envMapIntensity = 1.0;
                        
                        if (node.material.map) {
                            node.material.map.encoding = THREE.sRGBEncoding;
                        }
                    }
                }
            });

            scene.add(currentModel);

            const box = new THREE.Box3().setFromObject(currentModel);
            const center = box.getCenter(new THREE.Vector3());
            const dimensions = box.getSize(new THREE.Vector3());
            const scaleRatio = 2 / Math.max(dimensions.x, dimensions.y, dimensions.z);

            currentModel.scale.set(scaleRatio, scaleRatio, scaleRatio);
            originalScale.set(scaleRatio, scaleRatio, scaleRatio);
            currentModel.position.sub(center.multiplyScalar(scaleRatio));

            updateInfo(modelName);
        },
        progress => {
            const percent = ((progress.loaded / progress.total) * 100).toFixed(1);
        },
        error => {
            console.error('Model load failed:', error);
            console.error('Attempted path:', modelPath);

            fetch(modelPath)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.blob();
                })
                .then(() => {
                    console.log('Model file exists.');
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                });
        }
    );
}


function updateInfo(modelName) {
    const descriptions = {
    'coke_can': 'Coca-Cola Classic - The original taste that started it all in 1886. This iconic red can delivers the same bold, refreshing flavor that has become a symbol of joy and togetherness for generations. Perfect for any moment, chilled and effervescent.',
    'fanta_can': 'Fanta - Bursting with fruity flavor and vibrant energy. Introduced during the 1940s, Fanta is now a global sensation with its playful personality and refreshing orange sparkle. A fun companion to every meal and gathering.',
    'sprite_can': 'Sprite - Crisp, clean, and undeniably refreshing. With its lemon-lime citrus zing and no-caffeine formula, Sprite has been cooling down taste buds since 1961. It\'s the drink that redefines what freshness means, every single sip.',
    'coke_bottle': 'Coca-Cola Classic Bottle - A timeless symbol of refreshment and design. Since its debut in 1915, the contoured glass bottle has become a cultural icon. Beyond its curves lies the same original Coca-Cola recipe that continues to connect people across the world.'
};


    const infoDiv = document.getElementById('info-content');
    infoDiv.textContent = descriptions[modelName] || 'Product information not available.';
}

function onWindowResize() {
    const container = document.getElementById('viewer');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function toggleSquashAnimation() {
    if (!currentModel) return;
    
    isSquashAnimationEnabled = !isSquashAnimationEnabled;
    if (isSquashAnimationEnabled) {
        animationStartTime = Date.now();
    } else {
        currentModel.scale.copy(originalScale);
        currentModel.rotation.z = 0;
    }
}


function toggleWire() {
    if (!currentModel) return;

    isWireframe = !isWireframe;
    currentModel.traverse(node => {
        if (node.isMesh && node.material) {
            node.material.wireframe = isWireframe;
        }
    });
}

function reset3DMode() {
    if (!currentModel) return;

    const bounds = new THREE.Box3().setFromObject(currentModel);
    const center = bounds.getCenter(new THREE.Vector3());
    const extent = bounds.getSize(new THREE.Vector3());

    const fovRadians = camera.fov * (Math.PI / 180);
    const distance = (Math.max(extent.x, extent.y, extent.z) / Math.tan(fovRadians / 2)) * 1.5;

    camera.position.set(0, 0, distance);
    camera.lookAt(center);
    controls.target.copy(center);
}


function setLightColor(color) {
    if (!directionalLight || !ambientLight) return;

    const threeColor = new THREE.Color(color);

    directionalLight.color = threeColor;
    directionalLight.intensity = 0.8;
  
    const ambientColor = threeColor.clone().multiplyScalar(0.5);
    ambientLight.color = ambientColor;
    ambientLight.intensity = 0.5;

    document.getElementById('customColor').value = color;

    if (currentModel) {
        currentModel.traverse(node => {
            if (node.isMesh && node.material) {
                node.material.needsUpdate = true;
            }
        });
    }
}


function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const viewer = document.getElementById('viewer');
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    viewer.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    Object.assign(controls, { enableDamping: true, dampingFactor: 0.05 });

    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    window.addEventListener('resize', onWindowResize);

    animation();
}


init();
