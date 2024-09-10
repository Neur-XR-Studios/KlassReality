// utils.js
import * as THREE from 'three';

export const calculatePolygonCount = (model) => {
  let count = 0;
  if (model instanceof THREE.Object3D) {
    model.traverse((object) => {
      if (object.isMesh) {
        const geometry = object.geometry;
        count += geometry.index
          ? geometry.index.count / 3
          : geometry.attributes.position.count / 3;
      }
    });
  } else {
    console.error("The provided model is not a THREE.Object3D instance.");
  }

  return count;
};
