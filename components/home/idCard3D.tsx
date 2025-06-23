/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import * as THREE from "three";
import { useEffect, useRef, useState, Suspense } from "react";
import {
  Canvas,
  extend,
  useThree,
  useFrame,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
  Html,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RigidBodyApi,
} from "@react-three/rapier";
import {
  MeshLineGeometry,
  MeshLineMaterial,
  type MeshLineMaterialProps,
} from "meshline";

// Extend Three.js with MeshLine components for the lanyard band
extend({ MeshLineGeometry, MeshLineMaterial });

// Configuration for the scene, physics, and asset paths
const config = {
  camera: { position: [0, 0, 13] as [number, number, number], fov: 25 },
  physics: {
    debug: false, // Set to false to hide physics colliders and joints
    interpolate: true,
    gravity: [0, -40, 0] as [number, number, number],
    timeStep: 1 / 60,
  },
  paths: {
    tag: "/tag.glb", // Ensure this file is in your /public directory
    band: "/band.jpg", // Ensure this file is in your /public directory
  },
};

// Preload assets
useGLTF.preload(config.paths.tag);
useTexture.preload(config.paths.band);

interface GLTFResult {
  nodes: {
    card: THREE.Mesh;
    clip: THREE.Mesh;
    clamp: THREE.Mesh;
  };
  materials: {
    base: THREE.MeshStandardMaterial;
    metal: THREE.MeshStandardMaterial;
  };
}

interface IDCardModelProps {
  nodes: GLTFResult["nodes"];
  materials: GLTFResult["materials"];
  texture: THREE.Texture;
  assemblyXOffset: number; // The target X offset for the entire assembly in world space
  maxSpeed?: number;
  minSpeed?: number;
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: JSX.IntrinsicElements["bufferGeometry"];
    meshLineMaterial: JSX.IntrinsicElements["material"] & MeshLineMaterialProps;
  }
}

interface RigidBodyApiWithLerp extends RigidBodyApi {
  lerped?: THREE.Vector3;
}

// The main component for the ID card and its lanyard physics
function IDCardModel({
  nodes,
  materials,
  texture,
  assemblyXOffset, // Use this to position the physics bodies
  maxSpeed = 50,
  minSpeed = 10,
}: IDCardModelProps) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<RigidBodyApiWithLerp>(null);
  const j1 = useRef<RigidBodyApiWithLerp>(null);
  const j2 = useRef<RigidBodyApiWithLerp>(null);
  const j3 = useRef<RigidBodyApiWithLerp>(null);
  const card = useRef<RigidBodyApiWithLerp>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const rotAsEuler = new THREE.Euler();

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2,
  };

  const { size, camera } = useThree();
  const gl = useThree((state) => state.gl);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
        ],
        false,
        "chordal",
        0.5
      )
  );

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  // Define base Y and Z for the assembly
  const assemblyY = 4;
  const assemblyZ = 0;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current && card.current.setNextKinematicTranslation) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

      let dragOffset = { x: 0, y: 0, z: 0 };
      if (dragged instanceof THREE.Vector3) {
        dragOffset = dragged;
      }
      card.current.setNextKinematicTranslation({
        x: vec.x - dragOffset.x,
        y: vec.y - dragOffset.y,
        z: vec.z - dragOffset.z,
      });
    }

    if (
      fixed.current &&
      j1.current &&
      j2.current &&
      j3.current &&
      card.current &&
      band.current &&
      band.current.geometry
    ) {
      const fixedPos = fixed.current.translation?.();
      const j3Pos = j3.current.translation?.();
      const cardAngvel = card.current.angvel?.();
      const cardRot = card.current.rotation?.();

      if (!fixedPos || !j3Pos) return;

      [j1, j2].forEach((ref) => {
        const body = ref.current;
        if (body) {
          const bodyTranslation = body.translation?.();
          if (!bodyTranslation) return;
          if (!body.lerped)
            body.lerped = new THREE.Vector3().copy(bodyTranslation);
          const clampedDistance = Math.max(
            0.1,
            Math.min(1, body.lerped.distanceTo(bodyTranslation))
          );
          body.lerped.lerp(
            bodyTranslation,
            delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
          );
        }
      });

      const j1Lerped = j1.current.lerped;
      const j2Lerped = j2.current.lerped;

      if (!j1Lerped || !j2Lerped) return;

      curve.points[0].copy(j3Pos);
      curve.points[1].copy(j2Lerped);
      curve.points[2].copy(j1Lerped);
      curve.points[3].copy(fixedPos);
      band.current.geometry.setPoints(curve.getPoints(32));

      if (cardAngvel && cardRot) {
        ang.copy(cardAngvel);
        rotAsEuler.setFromQuaternion(
          new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w),
          "XYZ"
        );
        card.current.setAngvel?.(
          { x: ang.x, y: ang.y - rotAsEuler.y * 0.25, z: ang.z },
          true
        );
      }
    }
  });

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

  return (
    <>
      <RigidBody
        ref={fixed}
        position={[assemblyXOffset, assemblyY, assemblyZ]}
        {...segmentProps}
        type="fixed"
      >
        {config.physics.debug && (
          <mesh>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="red" wireframe />
          </mesh>
        )}
      </RigidBody>
      <RigidBody
        position={[assemblyXOffset + 0.5, assemblyY, assemblyZ]}
        ref={j1}
        {...segmentProps}
      >
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody
        position={[assemblyXOffset + 1.0, assemblyY, assemblyZ]}
        ref={j2}
        {...segmentProps}
      >
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody
        position={[assemblyXOffset + 1.5, assemblyY, assemblyZ]}
        ref={j3}
        {...segmentProps}
      >
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody
        position={[assemblyXOffset + 2.0, assemblyY, assemblyZ]}
        ref={card}
        {...segmentProps}
        type={dragged ? "kinematicPosition" : "dynamic"}
      >
        <CuboidCollider args={[0.8, 1.125, 0.01]} />
        <group
          scale={2.25}
          position={[0, -1.2, -0.05]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onPointerUp={(e: ThreeEvent<PointerEvent>) => {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            drag(false);
          }}
          onPointerDown={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            const currentCard = card.current;
            if (currentCard && currentCard.translation) {
              const cardPos = currentCard.translation();
              if (cardPos) {
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(cardPos)));
              }
            }
          }}
        >
          {nodes?.card && materials?.base && (
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={maxAnisotropy}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
          )}
          {nodes?.clip && materials?.metal && (
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
          )}
          {nodes?.clamp && materials?.metal && (
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          )}
        </group>
      </RigidBody>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[size.width, size.height]}
          useMap
          map={texture}
          repeat={[-3, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

// Intermediary component to ensure assets and responsive offset are ready
function SceneContent() {
  const { nodes, materials } = useGLTF(
    config.paths.tag
  ) as unknown as GLTFResult;
  const texture = useTexture(config.paths.band);

  const { size, camera, viewport } = useThree();
  const [assemblyXOffset, setAssemblyXOffset] = useState<number | null>(null);

  useEffect(() => {
    if (size.width > 0 && size.height > 0) {
      const targetX = viewport.width * 0.3;
      setAssemblyXOffset(targetX);
    }
  }, [size.width, size.height, viewport.width, camera]);

  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.needsUpdate = true;
    }
  }, [texture]);

  if (!nodes || !materials || !texture || assemblyXOffset === null) {
    const loadingMessage =
      assemblyXOffset === null
        ? "Calculating Layout..."
        : "Initializing Scene...";
    return (
      <Html center>
        <div style={{ color: "white", fontSize: "1.5em" }}>
          {loadingMessage}
        </div>
      </Html>
    );
  }

  return (
    <IDCardModel
      nodes={nodes}
      materials={materials}
      texture={texture}
      assemblyXOffset={assemblyXOffset}
    />
  );
}

// Main export component for the 3D scene
export default function IDCard3DScene() {
  return (
    <Canvas
      gl={{ antialias: true }}
      dpr={[1, 2]}
      camera={config.camera}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <ambientLight intensity={Math.PI} />
      <Suspense fallback={<Html center></Html>}>
        <Physics {...config.physics}>
          <SceneContent />
        </Physics>
      </Suspense>
      <Environment background blur={0.75}>
        <color attach="background" args={["black"]} />
        <Lightformer
          intensity={2}
          color="white"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </Canvas>
  );
}
