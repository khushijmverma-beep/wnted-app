import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'

export function cloneGltfScene(scene) {
  const clone = SkeletonUtils.clone(scene)
  clone.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material = child.material.clone()
    }
  })
  return clone
}

export function hasSkinnedMesh(object) {
  let found = false
  object.traverse((child) => {
    if (child.isSkinnedMesh) found = true
  })
  return found
}

export function centerObjectAtOrigin(object) {
  object.updateMatrixWorld(true)
  const box = new THREE.Box3()

  object.traverse((child) => {
    if (child.isMesh && child.geometry) {
      child.geometry.computeBoundingBox()
      if (!child.geometry.boundingBox) return

      const meshBox = child.geometry.boundingBox.clone()
      meshBox.applyMatrix4(child.matrixWorld)
      box.union(meshBox)
    }
  })

  if (box.isEmpty()) {
    box.setFromObject(object)
  }

  const center = new THREE.Vector3()
  box.getCenter(center)
  object.position.sub(center)

  return object
}

/** Fit + center hair using mesh geometry only (ignores distant bones). */
export function fitHairForPreview(object, targetMaxDimension = 2.2) {
  object.updateMatrixWorld(true)

  const getMeshBox = () => {
    const box = new THREE.Box3()

    object.traverse((child) => {
      if (!child.isMesh || !child.geometry) return

      const meshBox = new THREE.Box3()

      if (child.isSkinnedMesh && child.geometry.attributes.position) {
        meshBox.setFromBufferAttribute(child.geometry.attributes.position)
      } else {
        child.geometry.computeBoundingBox()
        if (!child.geometry.boundingBox) return
        meshBox.copy(child.geometry.boundingBox)
      }

      meshBox.applyMatrix4(child.matrixWorld)
      box.union(meshBox)
    })

    if (box.isEmpty()) {
      box.setFromObject(object)
    }

    return box
  }

  let box = getMeshBox()
  const size = new THREE.Vector3()
  box.getSize(size)
  const maxDim = Math.max(size.x, size.y, size.z, 0.0001)

  object.scale.multiplyScalar(targetMaxDimension / maxDim)
  object.updateMatrixWorld(true)

  box = getMeshBox()
  const center = new THREE.Vector3()
  box.getCenter(center)
  object.position.sub(center)

  return object
}

/** @deprecated Use fitHairForPreview */
export function centerHairForPreview(object) {
  return fitHairForPreview(object, 2.2)
}
