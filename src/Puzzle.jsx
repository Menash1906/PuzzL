import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Puzzle = ({ image }) => {
  const canvasRef = useRef(null);
  const piecesRef = useRef([]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const texture = new THREE.TextureLoader().load(image);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const pieceCount = 500;
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    const pieces = [];
    for (let i = 0; i < pieceCount; i++) {
      const piece = new THREE.Mesh(geometry, material);
      piece.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      piece.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      piece.originalPosition = piece.position.clone();
      piece.targetPosition = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      )
        .normalize()
        .multiplyScalar(5);
      scene.add(piece);
      pieces.push(piece);
    }

    const render = () => {
      renderer.render(scene, camera);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };
    animate();

    const handleScroll = () => {
      const targetPosition = Math.min(window.pageYOffset / 1000, 1);
      piecesRef.current.forEach((piece) => {
        const newPosition = piece.originalPosition
          .clone()
          .lerp(piece.targetPosition, targetPosition);
        piece.position.copy(newPosition);
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [image]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default Puzzle;
