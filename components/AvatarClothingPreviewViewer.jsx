'use client'

import { Canvas } from '@react-three/fiber'
import { Center, OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import {
  HAIR_DETAIL_SCALES,
  HAIR_PREVIEW_CAMERA,
  HAIR_PREVIEW_CAMERAS,
  HAIR_PREVIEW_FIT_SIZE,
  HAIR_PREVIEW_FIT_SIZES,
  HAIR_PREVIEW_ORBIT,
  isHairModelPath,
} from '@/lib/avatarItems'
import { centerObjectAtOrigin, cloneGltfScene, fitHairForPreview } from '@/lib/cloneGltfScene'

const PREVIEW_SCALES = {
  '/models/shirts/oversizedTshirt.glb': [2.05, 1.8, 2.05],
  '/models/bottoms/jeans.glb': [1.1, 0.97, 1.1],
  '/models/hoodies/hoodie.glb': [2.05, 1.8, 2.05],
}

const DEFAULT_PREVIEW_SCALE = [2.05, 1.8, 2.05]

function getModelScale(modelPath) {
  if (isHairModelPath(modelPath)) {
    const uniform = HAIR_DETAIL_SCALES[modelPath] ?? 1
    return [uniform, uniform, uniform]
  }
  return PREVIEW_SCALES[modelPath] ?? DEFAULT_PREVIEW_SCALE
}

function PreviewModel({ modelPath, color }) {
  const { scene } = useGLTF(modelPath)
  const scale = getModelScale(modelPath)
  const isHair = isHairModelPath(modelPath)

  const clonedScene = useMemo(() => {
    const clone = cloneGltfScene(scene)
    if (isHair) {
      const fitSize = HAIR_PREVIEW_FIT_SIZES[modelPath] ?? HAIR_PREVIEW_FIT_SIZE
      fitHairForPreview(clone, fitSize)
    } else {
      centerObjectAtOrigin(clone)
    }
    return clone
  }, [scene, isHair, modelPath])

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
      scale={scale}
      rotation={isHair ? [0.1, 0.45, 0] : [0, 0, 0]}
    />
  )
}

useGLTF.preload('/models/shirts/oversizedTshirt.glb')
useGLTF.preload('/models/bottoms/jeans.glb')
useGLTF.preload('/models/hoodies/hoodie.glb')
useGLTF.preload('/models/hair/longHair.glb')
useGLTF.preload('/models/hair/hairBitten.glb')
useGLTF.preload('/models/hair/longHairWithBow.glb')
useGLTF.preload('/models/hair/ponyTail.glb')

export default function AvatarClothingPreviewViewer({
  modelPath,
  color,
  height = 300,
}) {
  const isHair = isHairModelPath(modelPath)
  const hairCamera = isHair
    ? (HAIR_PREVIEW_CAMERAS[modelPath] ?? HAIR_PREVIEW_CAMERA)
    : null
  const hairOrbit = isHair ? (HAIR_PREVIEW_ORBIT[modelPath] ?? { minDistance: 0.45, maxDistance: 1.8 }) : null

  return (
    <div
      style={{
        width: '100%',
        height,
        background: 'transparent',
      }}
    >
      <Canvas
        camera={{
          position: hairCamera ? hairCamera.position : [0, 0.05, 2.4],
          fov: hairCamera ? hairCamera.fov : 42,
        }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 3, 2]} intensity={1} />
        <directionalLight position={[-2, 1, -1]} intensity={0.4} />
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
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={hairOrbit?.minDistance ?? 1.4}
          maxDistance={hairOrbit?.maxDistance ?? 4.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={(5 * Math.PI) / 6}
        />
      </Canvas>
    </div>
  )
}
