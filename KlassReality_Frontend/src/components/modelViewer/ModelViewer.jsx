import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { Badge, Col, Row, Statistic, Typography } from "antd";

const ModelViewer = ({ modelUrl, scaleFactor = 0.7 }) => {
  const controls = useRef();
  const [polygonCount, setPolygonCount] = useState(0);

  const calculatePolygonCount = (model) => {
    let count = 0;
    model.traverse((object) => {
      if (object.isMesh) {
        const geometry = object.geometry;
        count += geometry.index
          ? geometry.index.count / 3
          : geometry.attributes.position.count / 3;
      }
    });
    return count;
  };

  const enableScroll = () => {
    document.body.style.overflow = "auto";
  };

  const disableScroll = () => {
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    return () => {
      // Ensure scrolling is enabled when component unmounts
      enableScroll();
    };
  }, []);

  return (
    <>
      <Row className="w-full">
        <Col span={24}>
          <Statistic title="Polygon Count" value={polygonCount} />
        </Col>
      </Row>
      <Canvas
        shadows
        className="h-[300px]"
        onCreated={({ gl, camera, scene }) => {
          gl.setClearColor("#f0f0f0");

          // Add lights
          const ambientLight = new THREE.AmbientLight(0xffffff, 2);
          scene.add(ambientLight);

          // Load the 3D model
          const loader = new GLTFLoader();
          loader.load(
            modelUrl,
            (gltf) => {
              // Adjust model scale
              gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

              // Get bounding box to calculate distance
              const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
              const center = boundingBox.getCenter(new THREE.Vector3());
              const size = boundingBox.getSize(new THREE.Vector3());

              // Calculate distance from the center of the bounding box
              const maxDim = Math.max(size.x, size.y, size.z);
              const fov = camera.fov * (Math.PI / 180);
              const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

              // Set camera position and clipping planes based on the bounding box size
              camera.position.copy(center);
              camera.position.z += cameraZ;
              camera.near = cameraZ / 100;
              camera.far = cameraZ * 500;
              camera.updateProjectionMatrix();

              // Add the model to the scene
              scene.add(gltf.scene);
              const count = calculatePolygonCount(gltf.scene);
              setPolygonCount(count);
            },
            undefined,
            (error) => {
              console.error(error);
            }
          );
        }}
        onMouseEnter={disableScroll}
        onMouseLeave={enableScroll}
      >
        <Suspense fallback={null}>
          <group />
        </Suspense>

        <OrbitControls ref={controls} />
      </Canvas>
    </>
  );
};

export default ModelViewer;
