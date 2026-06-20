"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function ProductGrid({
  products,
  onAddToCart
}) {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const gridRef = useRef(null);

  const handleMouseEnter = (productId) => {
    setHoveredProduct(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0"
      onMouseMove={(e) => {
        if (!hoveredProduct || !gridRef.current) return;

        const rect = gridRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        parallaxEffect(x, y);
      }}
    >
      {products.map((product) => (
        <Motion
          key={product.id}
          initial={{ scale: 1, y: 0 }}
          whileHover={{
            scale: hoveredProduct === product.id ? 1.03 : 1,
            rotateX: hoveredProduct === product.id ? x * 15 : 0,
            rotateY: hoveredProduct === product.id ? -y * 15 : 0,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-orange-500/40 transition-all duration-300"
          onMouseEnter={() => handleMouseEnter(product.id)}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: 1000px,
            transformStyle: "preserve-3d"
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            {product.images.map((img, idx) => (
              <div key={idx} className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {idx === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium mb-1">New Arrival</p>
                      <p className="text-lg font-bold">{product.price}</p>
                      <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full px-3 py-1">Add to Cart</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="p-4 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-white">{product.name}</h3>
              <p className="text-gray-300 text-sm max-h-12 overflow-hidden text-ellipsis">{product.description}</p>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-4 h-4 ${idx < Math.floor(product.rating)} ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} spring`
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">{product.reviews} reviews</span>
              </div>
            </div>
          </div>
        </Motion>
      ))}
    </div>
  );
}

function parallaxEffect(x, y) {
  // Creates subtle parallax movement
  const products = document.querySelectorAll('.product-card');
  products.forEach(product => {
    const rect = product.getBoundingClientRect();
    const xp = (x * 100);
    const yp = (y * 100);

    product.style.transform = `
      translateX(${xp}px)
      translateY(${yp}px)
      scale(${1 + Math.abs(x) * 0.02})
    `;
  });
}

const Star = ({ className }) => {
  return <span className={className}>★</span>;
};