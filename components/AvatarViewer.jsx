'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { centerObjectAtOrigin, cloneGltfScene, fitHairForPreview, hasSkinnedMesh } from '@/lib/cloneGltfScene'

const CAMERA_FOV = 46
const PROFILE_EDIT_CANVAS_HEIGHT = 260

function pixelsToWorldY(pixels, canvasHeight, cameraZ) {
  const visibleHeight = 2 * Math.tan((CAMERA_FOV * Math.PI) / 360) * cameraZ
  return (pixels / canvasHeight) * visibleHeight
}

const FACE_CAMERA_Z = 1.55
const FACE_CAMERA_Y_RAISE = pixelsToWorldY(70, PROFILE_EDIT_CANVAS_HEIGHT, FACE_CAMERA_Z)
const CLOTHES_CAMERA_Z = 4.55
const ACCESSORIES_CAMERA_Z = 4.6

const CAMERA_PRESETS = {
  body: {
    position: [0, -0.05, 6.2],
    target: [0, -0.35, 0],
    minPolarAngle: Math.PI / 4,
    maxPolarAngle: Math.PI / 1.5,
  },
  face: {
    position: [0, 0.68 + FACE_CAMERA_Y_RAISE, FACE_CAMERA_Z],
    target: [0, 0.54 + FACE_CAMERA_Y_RAISE, 0],
    minPolarAngle: Math.PI / 2.8,
    maxPolarAngle: Math.PI / 2.05,
  },
  clothes: {
    position: [0, -0.12, CLOTHES_CAMERA_Z],
    target: [0, -0.38, 0],
    minPolarAngle: Math.PI / 3.2,
    maxPolarAngle: Math.PI / 1.9,
  },
  accessories: {
    position: [0, 0.08, ACCESSORIES_CAMERA_Z],
    target: [0, 0.02, 0],
    minPolarAngle: Math.PI / 2.9,
    maxPolarAngle: Math.PI / 2.15,
  },
}
const SHIRT_BASE_Y = -0.84
const SHIRT_PIXEL_DROP = 150
const SHIRT_PIXEL_RAISE = 120
const SHIRT_PIXEL_NUDGE_DOWN = 2
const CLOTHING_Y_OFFSET = 0
// Keep clothing world position identical in profile and edit (different canvas heights).
const CLOTHING_POSITION_REFERENCE_HEIGHT = 320

const HAIR_ATTACHMENT = {
  scaleY: 5.2,
  scaleXZ: 5.2,
  zForward: -0.14,
  pixelRaise: -5,
}

// Match longHair.glb native size before HAIR_ATTACHMENT scale is applied.
const HAIR_AVATAR_FIT_SIZE = 0.3

const CLOTHING_CONFIG = {
  '/models/shirts/oversizedTshirt.glb': {
    scaleY: 1.8,
    scaleXZ: 2.05,
    zForward: 0.03,
  },
  '/models/hoodies/hoodie.glb': {
    scaleY: 1.8,
    scaleXZ: 2.05,
    zForward: 0.03,
  },
  '/models/bottoms/jeans.glb': {
    scaleY: 0.97,
    scaleXZ: 1.1,
    zForward: 0.01,
    pixelRaise: 40,
  },
  '/models/hair/longHair.glb': HAIR_ATTACHMENT,
  '/models/hair/hairBitten.glb': HAIR_ATTACHMENT,
  '/models/hair/longHairWithBow.glb': HAIR_ATTACHMENT,
  '/models/hair/ponyTail.glb': HAIR_ATTACHMENT,
}

const DEFAULT_CLOTHING_CONFIG = {
  scaleY: 1.8,
  scaleXZ: 2.05,
  zForward: 0.03,
}

function getAttachmentConfig(modelPath) {
  if (CLOTHING_CONFIG[modelPath]) return CLOTHING_CONFIG[modelPath]
  if (modelPath.startsWith('/models/hair/')) return HAIR_ATTACHMENT
  return DEFAULT_CLOTHING_CONFIG
}

function pixelsDownToWorldY(pixels, canvasHeight, cameraZ) {
  return pixelsToWorldY(pixels, canvasHeight, cameraZ)
}

function getClothingPosition(cameraZ, zForward = 0) {
  const refHeight = CLOTHING_POSITION_REFERENCE_HEIGHT
  const drop = pixelsDownToWorldY(SHIRT_PIXEL_DROP, refHeight, cameraZ)
  const raise = pixelsDownToWorldY(SHIRT_PIXEL_RAISE, refHeight, cameraZ)
  const nudgeDown = pixelsDownToWorldY(SHIRT_PIXEL_NUDGE_DOWN, refHeight, cameraZ)
  return [0, SHIRT_BASE_Y - drop + raise - nudgeDown + CLOTHING_Y_OFFSET, zForward]
}

function centerGeometryAtOrigin(object) {
  centerObjectAtOrigin(object)
}

function ClothingMesh({ modelPath, cameraZ, color }) {
  const { scene } = useGLTF(modelPath)
  const config = getAttachmentConfig(modelPath)
  const scale = [config.scaleXZ, config.scaleY, config.scaleXZ]
  const position = useMemo(() => {
    if (config.position) return config.position
    const base = getClothingPosition(cameraZ, config.zForward)
    if (config.pixelRaise) {
      const raise = pixelsToWorldY(
        config.pixelRaise,
        CLOTHING_POSITION_REFERENCE_HEIGHT,
        cameraZ
      )
      return [base[0], base[1] + raise, base[2]]
    }
    return base
  }, [cameraZ, config.zForward, config.position, config.pixelRaise])

  const isHair = modelPath.startsWith('/models/hair/')

  const clonedScene = useMemo(() => {
    const clone = cloneGltfScene(scene)
    if (isHair && hasSkinnedMesh(clone)) {
      fitHairForPreview(clone, HAIR_AVATAR_FIT_SIZE)
    } else if (!hasSkinnedMesh(clone)) {
      centerGeometryAtOrigin(clone)
    }
    return clone
  }, [scene, isHair])

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
    <primitive object={clonedScene} scale={scale} position={position} />
  )
}

function AvatarBody({ scale, skinColor, clothingItems, cameraZ }) {
  const { scene } = useGLTF('/models/female.glb')

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
      }
    })
    return clone
  }, [scene])

  useEffect(() => {
    const color = new THREE.Color(skinColor)
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material?.color) {
        child.material.color.copy(color)
      }
    })
  }, [clonedScene, skinColor])

  return (
    <Center>
      <group>
        <primitive object={clonedScene} scale={scale} position={[0, -0.95, 0]} />
        {clothingItems.map((item) => (
          <ClothingMesh
            key={item.modelPath}
            modelPath={item.modelPath}
            cameraZ={cameraZ}
            color={item.color}
          />
        ))}
      </group>
    </Center>
  )
}

function Avatar({ scale, skinColor, clothingItems, cameraZ }) {
  return (
    <AvatarBody
      scale={scale}
      skinColor={skinColor}
      clothingItems={clothingItems}
      cameraZ={cameraZ}
    />
  )
}

function AnimatedCameraRig({ focusRegion, controlsRef }) {
  const { camera } = useThree()
  const desiredPosition = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())

  useEffect(() => {
    const preset = CAMERA_PRESETS[focusRegion] ?? CAMERA_PRESETS.body
    desiredPosition.current.set(...preset.position)
    desiredTarget.current.set(...preset.target)
  }, [focusRegion])

  useFrame((_, delta) => {
    const preset = CAMERA_PRESETS[focusRegion] ?? CAMERA_PRESETS.body
    const lerpFactor = 1 - Math.pow(0.001, delta)

    desiredPosition.current.set(...preset.position)
    desiredTarget.current.set(...preset.target)

    camera.position.lerp(desiredPosition.current, lerpFactor)

    const controls = controlsRef.current
    if (!controls) return

    controls.target.lerp(desiredTarget.current, lerpFactor)
    controls.minPolarAngle = preset.minPolarAngle
    controls.maxPolarAngle = preset.maxPolarAngle
    controls.update()
  })

  return null
}

useGLTF.preload('/models/female.glb')
useGLTF.preload('/models/shirts/oversizedTshirt.glb')
useGLTF.preload('/models/bottoms/jeans.glb')
useGLTF.preload('/models/hoodies/hoodie.glb')
useGLTF.preload('/models/hair/longHair.glb')
useGLTF.preload('/models/hair/hairBitten.glb')
useGLTF.preload('/models/hair/longHairWithBow.glb')
useGLTF.preload('/models/hair/ponyTail.glb')

export default function AvatarViewer({
  height = 280,
  scale = 0.45,
  cameraZ = 6,
  skinColor = '#EACBB4',
  clothingItems = [{ modelPath: '/models/shirts/oversizedTshirt.glb', color: '#F5F5F5' }],
  focusRegion = 'body',
  autoRotate = false,
}) {
  const controlsRef = useRef(null)
  const [userInteracting, setUserInteracting] = useState(false)
  const initialPreset = CAMERA_PRESETS[focusRegion] ?? CAMERA_PRESETS.body

  return (
    <div style={{ width: '100%', height }}>
      <Canvas
        camera={{
          position: initialPreset.position,
          fov: CAMERA_FOV,
        }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[2, 3, 2]} intensity={1.1} />
        <Suspense fallback={null}>
          <Avatar
            scale={scale}
            skinColor={skinColor}
            clothingItems={clothingItems}
            cameraZ={cameraZ}
          />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          target={initialPreset.target}
          minPolarAngle={initialPreset.minPolarAngle}
          maxPolarAngle={initialPreset.maxPolarAngle}
          autoRotate={autoRotate && !userInteracting}
          autoRotateSpeed={2.2}
          onStart={() => setUserInteracting(true)}
          onEnd={() => setUserInteracting(false)}
        />
        {focusRegion !== 'body' && (
          <AnimatedCameraRig focusRegion={focusRegion} controlsRef={controlsRef} />
        )}
      </Canvas>
    </div>
  )
}
