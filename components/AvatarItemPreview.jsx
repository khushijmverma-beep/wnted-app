'use client'

import { Canvas } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import {
  HAIR_DETAIL_SCALES,
  HAIR_PREVIEW_CAMERA,
  HAIR_PREVIEW_CAMERAS,
  HAIR_THUMB_FIT_SIZE,
  HAIR_THUMB_SCALE,
  HAIR_PREVIEW_FIT_SIZES,
  isHairModelPath,
} from '@/lib/avatarItems'
import { centerObjectAtOrigin, cloneGltfScene, fitHairForPreview } from '@/lib/cloneGltfScene'

const DEFAULT_PREVIEW = {
  scale: 1.15,
  rotation: [0.15, 0.55, 0],
  camera: [0, 0.05, 1.75],
  fov: 40,
}

function getPreviewConfig(modelPath) {
  if (isHairModelPath(modelPath)) {
    const scale = HAIR_DETAIL_SCALES[modelPath] ?? HAIR_THUMB_SCALE
    const camera = HAIR_PREVIEW_CAMERAS[modelPath] ?? HAIR_PREVIEW_CAMERA
    return {
      scale,
      rotation: [0.1, 0.45, 0],
      camera: camera.position,
      fov: camera.fov,
      fitSize: HAIR_PREVIEW_FIT_SIZES[modelPath] ?? HAIR_THUMB_FIT_SIZE,
    }
  }
  return DEFAULT_PREVIEW
}

function PreviewModel({ modelPath, color }) {
  const { scene } = useGLTF(modelPath)
  const preview = getPreviewConfig(modelPath)
  const isHair = isHairModelPath(modelPath)

  const clonedScene = useMemo(() => {
    const clone = cloneGltfScene(scene)
    if (isHair) {
      fitHairForPreview(clone, preview.fitSize ?? HAIR_THUMB_FIT_SIZE)
    } else {
      centerObjectAtOrigin(clone)
    }
    return clone
  }, [scene, isHair, preview.fitSize])

  useEffect(() => {
    if (!color) return

    const clothingColor = new THREE.Color(color)
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material?.color) {
        child.material.color.copy(clothingColor)
      }
    })
  }, [clonedScene, color])

  return (
    <primitive
      object={clonedScene}
      scale={preview.scale}
      rotation={preview.rotation}
    />
  )
}

const HAIR_MODELS = [
  '/models/hair/longHair.glb',
  '/models/hair/hairBitten.glb',
  '/models/hair/longHairWithBow.glb',
  '/models/hair/ponyTail.glb',
]

useGLTF.preload('/models/shirts/oversizedTshirt.glb')
useGLTF.preload('/models/bottoms/jeans.glb')
useGLTF.preload('/models/hoodies/hoodie.glb')
HAIR_MODELS.forEach((path) => useGLTF.preload(path))

export default function AvatarItemPreview({ modelPath, color }) {
  const preview = getPreviewConfig(modelPath)
  const isHair = isHairModelPath(modelPath)

  return (
    <div
      className="h-full w-full rounded-[6px]"
      style={{ background: 'transparent' }}
    >
      <Canvas
        camera={{ position: preview.camera, fov: preview.fov }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 2.5, 2]} intensity={0.9} />
        <Suspense fallback={null}>
          {isHair ? (
            <Center>
              <PreviewModel modelPath={modelPath} color={color} />
            </Center>
          ) : (
            <Center>
              <PreviewModel modelPath={modelPath} color={color} />
            </Center>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
