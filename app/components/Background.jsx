"use client";

import { useEffect } from "react";
import * as THREE from "three";

export default function Page() {
  useEffect(() => {
    let renderer, scene, camera;
    const clock = new THREE.Clock();

    let mouseX = 0;
    let mouseY = 0;

    const particleRotation = new THREE.Object3D();
    const stars = [];

    const init = () => {
      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("bg-canvas"),
        alpha: true,
        antialias: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      scene = new THREE.Scene();
      // Set scene to nearly pure black for that 90% look
      scene.background = new THREE.Color(0x020205); 

      camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );
      camera.position.set(0, 0, 700);

      scene.add(particleRotation);

      // ⭐ ULTRA GLOW DESIGN
      const geometry = new THREE.TetrahedronGeometry(2.2, 0);

      for (let i = 0; i < 450; i++) {
        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff, // White core for brightness
          emissive: 0xa855f7, // Intense Purple glow
          emissiveIntensity: 6, // High base glow for clarity
          flatShading: false,
        });

        const star = new THREE.Mesh(geometry, material);

        const r = 200 + Math.random() * 1000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        star.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );

        const scale = Math.random() * 1.8 + 0.8;
        star.scale.set(scale, scale, scale);

        star.userData = {
          baseZ: star.position.z,
          twinkleSpeed: Math.random() * 2 + 1,
        };

        stars.push(star);
        particleRotation.add(star);
      }

      // 💡 LIGHTING
      scene.add(new THREE.AmbientLight(0xffffff, 0.4)); // Dimmer ambient to keep 90% black feel

      const centerLight = new THREE.PointLight(0x7c3aed, 8, 1000); // Strong purple center glow
      centerLight.position.set(0, 0, 200);
      scene.add(centerLight);

      window.addEventListener("resize", onResize);
      document.addEventListener("mousemove", onMouseMove);
    };

    const onMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.45;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.45;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera parallax movement
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      stars.forEach((star) => {
        // High-contrast glow pulsing
        star.material.emissiveIntensity =
          5.0 + Math.sin(time * star.userData.twinkleSpeed) * 4.0;

        // Clear 3D depth motion
        star.position.z =
          star.userData.baseZ + Math.sin(time * 0.8) * 30;
      });

      // Clear rotation movement
      particleRotation.rotation.y += 0.0025;
      particleRotation.rotation.x += 0.001;

      renderer.render(scene, camera);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="-z-50 fixed inset-0 bg-[#000000]">
      {/* 90% Black / 10% Purple Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(124, 58, 237, 0.12) 0%, rgba(0, 0, 0, 0.9) 75%, rgba(0, 0, 0, 1) 100%)",
        }}
      />
      <canvas id="bg-canvas" className="block w-full h-full" />
    </div>
  );
}