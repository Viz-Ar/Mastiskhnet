import { useEffect, useRef, useState } from "react";

import axiosInstance, { API_BASE_URL } from "../../api/axios";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Viewer3D({ scanId }) {

    const mountRef = useRef(null);

    const rendererRef = useRef(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {

        if (!scanId) return;

        let renderer;
        let scene;
        let camera;
        let controls;
        let animationId;
        let resizeObserver;

        setLoading(true);
        setError(null);

        async function initViewer() {

            try {

                //---------------------------------------
                // Get secure view token
                //---------------------------------------

                const tokenResponse = await axiosInstance.get(
                    `/mri/${scanId}/view-token`
                );

                const token =
                    tokenResponse.data.view_token;

                //---------------------------------------
                // Scene
                //---------------------------------------

                scene = new THREE.Scene();

                // Soft radial-feeling background using a solid
                // clinical slate tone instead of flat white/gray
                scene.background = new THREE.Color("#0f172a");

                scene.fog = new THREE.Fog("#0f172a", 180, 420);

                //---------------------------------------
                // Camera
                //---------------------------------------

                camera = new THREE.PerspectiveCamera(
                    45,
                    mountRef.current.clientWidth /
                        mountRef.current.clientHeight,
                    0.1,
                    2000
                );

                camera.position.set(0, 0, 120);

                //---------------------------------------
                // Renderer
                //---------------------------------------

                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: false,
                });

                renderer.setPixelRatio(
                    Math.min(window.devicePixelRatio, 2)
                );

                renderer.setSize(
                    mountRef.current.clientWidth,
                    mountRef.current.clientHeight
                );

                renderer.outputColorSpace = THREE.SRGBColorSpace;

                renderer.toneMapping = THREE.ACESFilmicToneMapping;

                renderer.toneMappingExposure = 1.15;

                renderer.shadowMap.enabled = true;

                renderer.shadowMap.type = THREE.PCFShadowMap;

                mountRef.current.innerHTML = "";

                mountRef.current.appendChild(
                    renderer.domElement
                );

                rendererRef.current = renderer;

                //---------------------------------------
                // Controls
                //---------------------------------------

                controls = new OrbitControls(
                    camera,
                    renderer.domElement
                );

                controls.enableDamping = true;

                controls.dampingFactor = 0.08;

                controls.minDistance = 20;

                controls.maxDistance = 400;

                //---------------------------------------
                // Lights — layered setup for depth & clarity
                //---------------------------------------

                scene.add(
                    new THREE.HemisphereLight(
                        "#dce8ff",   // sky tint
                        "#0b1220",   // ground tint
                        1.1
                    )
                );

                scene.add(
                    new THREE.AmbientLight("#ffffff", 0.35)
                );

                const keyLight = new THREE.DirectionalLight(
                    "#ffffff",
                    2.2
                );

                keyLight.position.set(120, 160, 120);

                keyLight.castShadow = true;

                scene.add(keyLight);

                const rimLight = new THREE.DirectionalLight(
                    "#7dd3fc",
                    1.1
                );

                rimLight.position.set(-140, -60, -100);

                scene.add(rimLight);

                const fillLight = new THREE.PointLight(
                    "#f472b6",
                    0.5,
                    600
                );

                fillLight.position.set(-80, 100, 60);

                scene.add(fillLight);

                //---------------------------------------
                // Region colors — matched to segmentation legend
                //---------------------------------------

                const REGION_COLORS = {

                    necrotic: new THREE.Color("#ef4444"),   // red

                    edema: new THREE.Color("#22c55e"),      // green

                    enhancing: new THREE.Color("#facc15"),  // yellow

                    default: new THREE.Color("#38bdf8"),    // fallback blue

                };

                function pickRegionColor(name = "") {

                    const key = name.toLowerCase();

                    if (key.includes("necro")) return REGION_COLORS.necrotic;

                    if (key.includes("edema")) return REGION_COLORS.edema;

                    if (key.includes("enhanc")) return REGION_COLORS.enhancing;

                    return REGION_COLORS.default;

                }

                //---------------------------------------
                // Load GLB
                //---------------------------------------

                const loader = new GLTFLoader();

                loader.load(

                    `${API_BASE_URL}/mri/view/${token}/tumor_mesh.glb`,

                    (gltf) => {

                        const model = gltf.scene;

                        //-------------------------------
                        // Enhance materials per mesh
                        //-------------------------------

                        model.traverse((child) => {

                            if (!child.isMesh) return;

                            child.castShadow = true;

                            child.receiveShadow = true;

                            const sourceColor =
                                child.material?.color?.clone();

                            const regionColor = sourceColor
                                ? sourceColor
                                : pickRegionColor(child.name);

                            child.material = new THREE.MeshPhysicalMaterial({

                                color: regionColor,

                                metalness: 0.05,

                                roughness: 0.35,

                                clearcoat: 0.4,

                                clearcoatRoughness: 0.25,

                                transmission: 0.05,

                                sheen: 0.25,

                                sheenColor: regionColor,

                                emissive: regionColor,

                                emissiveIntensity: 0.12,

                            });

                        });

                        //-------------------------------
                        // Center & frame the model
                        //-------------------------------

                        const box = new THREE.Box3().setFromObject(model);

                        const size = new THREE.Vector3();

                        const center = new THREE.Vector3();

                        box.getSize(size);

                        box.getCenter(center);

                        model.position.sub(center);

                        const maxDim = Math.max(size.x, size.y, size.z);

                        const fitDistance =
                            maxDim / (2 * Math.tan((Math.PI * camera.fov) / 360));

                        camera.position.set(
                            fitDistance * 0.9,
                            fitDistance * 0.5,
                            fitDistance * 0.9
                        );

                        camera.near = maxDim / 100;

                        camera.far = maxDim * 20;

                        camera.updateProjectionMatrix();

                        controls.target.set(0, 0, 0);

                        controls.minDistance = maxDim * 0.3;

                        controls.maxDistance = maxDim * 4;

                        controls.update();

                        scene.add(model);

                        setLoading(false);

                    },

                    undefined,

                    (err) => {

                        console.error("GLB load error:", err);

                        setError("Failed to load 3D tumor model.");

                        setLoading(false);

                    }

                );

                //---------------------------------------
                // Resize handling
                //---------------------------------------

                resizeObserver = new ResizeObserver(() => {

                    if (!mountRef.current) return;

                    const width = mountRef.current.clientWidth;

                    const height = mountRef.current.clientHeight;

                    camera.aspect = width / height;

                    camera.updateProjectionMatrix();

                    renderer.setSize(width, height);

                });

                resizeObserver.observe(mountRef.current);

                //---------------------------------------
                // Animation loop
                //---------------------------------------

                function animate() {

                    animationId = requestAnimationFrame(animate);

                    controls.update();

                    renderer.render(scene, camera);

                }

                animate();

            }

            catch (err) {

                console.error(err);

                setError("Failed to load 3D tumor model.");

                setLoading(false);

            }

        }

        initViewer();

        //---------------------------------------
        // Cleanup
        //---------------------------------------

        return () => {

            if (animationId) {

                cancelAnimationFrame(animationId);

            }

            if (resizeObserver) {

                resizeObserver.disconnect();

            }

            if (controls) {

                controls.dispose();

            }

            if (rendererRef.current) {

                rendererRef.current.dispose();

            }

            if (mountRef.current) {

                mountRef.current.innerHTML = "";

            }

        };

    }, [scanId]);

    return (

        <div className="rounded-2xl bg-white p-6 shadow">

            <div className="mb-4 flex items-center justify-between">

                <h2 className="text-xl font-semibold">

                    3D Tumor Viewer

                </h2>

                <div className="flex items-center gap-4 text-xs text-slate-500">

                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        Necrotic
                    </span>

                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        Edema
                    </span>

                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        Enhancing
                    </span>

                </div>

            </div>

            {loading && !error && (

                <div className="pb-3 text-sm text-slate-500">

                    Loading 3D Model...

                </div>

            )}

            {error && (

                <div className="pb-3 text-sm text-red-500">

                    {error}

                </div>

            )}

            <div

                ref={mountRef}

                className="h-[600px] w-full overflow-hidden rounded-xl bg-slate-900"

            />

        </div>

    );

}