import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const simulatedFirestore = {
	products: [
		{ id: '1', name: 'Pro Fishing Rod', price: 129.99, stock: 15, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', category: 'Rods', description: 'Professional grade carbon fiber fishing rod with premium cork handle.' },
		{ id: '2', name: 'Elite Spinning Reel', price: 189.99, stock: 8, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', category: 'Reels', description: 'Smooth ball bearing reel with drag system and anti-reverse.' },
		{ id: '3', name: 'Tackle Box Supreme', price: 79.99, stock: 22, image: 'https://images.unsplash.com/photo-1586516136645-a40f0024b0b3?w=400', category: 'Storage', description: 'Multi-compartment tackle box with rust-resistant latches.' },
		{ id: '4', name: 'Braided Fishing Line', price: 24.99, stock: 35, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', category: 'Line', description: 'High-strength braided line with zero stretch technology.' },
		{ id: '5', name: 'Live Bait Kit', price: 34.99, stock: 18, image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400', category: 'Bait', description: 'Assorted live bait with preservation container included.' },
		{ id: '6', name: 'Landing Net Pro', price: 49.99, stock: 12, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', category: 'Nets', description: 'Telescoping handle with rubberized mesh for catch and release.' },
		{ id: '7', name: 'Fishing Vest Deluxe', price: 89.99, stock: 14, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', category: 'Apparel', description: 'Multi-pocket fishing vest with built-in rod holder.' },
		{ id: '8', name: 'Portable Fish Finder', price: 299.99, stock: 6, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', category: 'Electronics', description: 'GPS fish finder with color display and depth mapping.' }
	],
	cart: [],
	orders: [],
	user: { id: 'demo-user', name: 'Demo User', isAuthenticated: true }
};

const Modal = ({ isOpen, onClose, children, size = 'md' }) => {
	if (!isOpen) return null;

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-2xl',
		lg: 'max-w-4xl',
		xl: 'max-w-6xl'
	};

	return (
		<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
			<div className={`bg-white/20 backdrop-blur-lg rounded-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto border border-white/30 shadow-2xl`}>
				<button 
					onClick={onClose}
					className="float-right text-white text-3xl p-4 hover:text-red-300 transition-colors"
				>
					×
				</button>
				<div className="p-6 pt-2">
					{children}
				</div>
			</div>
		</div>
	);
};

export const FishingEcommerce = () => {
	const [products, setProducts] = useState(simulatedFirestore.products);
	const [cart, setCart] = useState(simulatedFirestore.cart);
	const [orders, setOrders] = useState(simulatedFirestore.orders);
	const [user] = useState(simulatedFirestore.user);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [showCart, setShowCart] = useState(false);
	const [showOrders, setShowOrders] = useState(false);
	const [showCheckout, setShowCheckout] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [searchTerm, setSearchTerm] = useState('');

	const mountRef = useRef(null);
	const sceneRef = useRef(null);
	const rendererRef = useRef(null);
	const cameraRef = useRef(null);
	const waterRef = useRef(null);

	useEffect(() => {
		if (!mountRef.current) return;
		const mountElement = mountRef.current;

		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x87CEEB);
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(0, 8, 15);
		camera.lookAt(0, 0, 0);
		cameraRef.current = camera;

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		rendererRef.current = renderer;
		mountElement.appendChild(renderer.domElement);

		const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
		directionalLight.position.set(50, 50, 50);
		directionalLight.castShadow = true;
		scene.add(directionalLight);

		const sunLight = new THREE.DirectionalLight(0xffeeaa, 0.4);
		sunLight.position.set(-30, 40, 30);
		scene.add(sunLight);

		const waterGeometry = new THREE.PlaneGeometry(200, 200, 150, 150);
		const waterMaterial = new THREE.ShaderMaterial({
			transparent: true,
			uniforms: {
				time: { value: 0.0 },
				color1: { value: new THREE.Color(0x006994) },
				color2: { value: new THREE.Color(0x4682B4) }
			},
			vertexShader: `
				uniform float time;
				varying vec2 vUv;
				varying float vElevation;
				
				void main() {
					vUv = uv;
					vec3 pos = position;
					
					float wave1 = sin(pos.x * 0.02 + time * 0.5) * 2.0;
					float wave2 = sin(pos.y * 0.03 + time * 0.7) * 1.5;
					float wave3 = sin(pos.x * 0.01 + pos.y * 0.01 + time * 0.3) * 1.0;
					
					vElevation = wave1 + wave2 + wave3;
					pos.z = vElevation;
					
					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 color1;
				uniform vec3 color2;
				varying vec2 vUv;
				varying float vElevation;
				
				void main() {
					float mixStrength = (vElevation + 4.0) / 8.0;
					vec3 color = mix(color1, color2, mixStrength);
					gl_FragColor = vec4(color, 0.85);
				}
			`
		});

		const water = new THREE.Mesh(waterGeometry, waterMaterial);
		water.rotation.x = -Math.PI / 2;
		water.receiveShadow = true;
		scene.add(water);
		waterRef.current = water;

		const createFloatingElement = (x, z) => {
			const geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8);
			const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
			const element = new THREE.Mesh(geometry, material);
			element.position.set(x, 0.5, z);
			element.castShadow = true;
			scene.add(element);
			return element;
		};

		const floatingElements = [
			createFloatingElement(15, -10),
			createFloatingElement(-20, 5),
			createFloatingElement(8, 18),
			createFloatingElement(-12, -15)
		];

		const animate = () => {
			requestAnimationFrame(animate);
			if (waterRef.current) {
				waterRef.current.material.uniforms.time.value += 0.01;
			}
			floatingElements.forEach((element, index) => {
				element.position.y = 0.5 + Math.sin(Date.now() * 0.001 + index) * 0.1;
			});
			renderer.render(scene, camera);
		};
		animate();

		const handleResize = () => {
			if (camera && renderer) {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			}
		};
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			if (mountElement && renderer.domElement && mountElement.contains(renderer.domElement)) {
				mountElement.removeChild(renderer.domElement);
			}
			renderer.dispose();
		};
	}, []);

	const filteredProducts = products.filter(product => {
		const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
		const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.description.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const categories = ['All', ...new Set(products.map(p => p.category))];

	const addToCart = (product) => {
		const existingItem = cart.find(item => item.id === product.id);
		if (existingItem) {
			setCart(cart.map(item =>
				item.id === product.id
					? { ...item, quantity: item.quantity + 1 }
					: item
			));
		} else {
			setCart([...cart, { ...product, quantity: 1 }]);
		}
		setProducts(products.map(p => 
			p.id === product.id 
				? { ...p, stock: Math.max(0, p.stock - 1) }
				: p
		));
	};

	const removeFromCart = (productId) => {
		const item = cart.find(item => item.id === productId);
		if (item) {
			setProducts(products.map(p =>
				p.id === productId
					? { ...p, stock: p.stock + 1 }
					: p
			));
			if (item.quantity > 1) {
				setCart(cart.map(ci => 
					ci.id === productId 
						? { ...ci, quantity: ci.quantity - 1 }
						: ci
				));
			} else {
				setCart(cart.filter(ci => ci.id !== productId));
			}
		}
	};

	const getTotalPrice = () => {
		return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
	};

	const getTotalItems = () => {
		return cart.reduce((total, item) => total + item.quantity, 0);
	};

	const processOrder = () => {
		const order = {
			id: Date.now().toString(),
			items: [...cart],
			total: getTotalPrice(),
			timestamp: new Date().toISOString(),
			userId: user.id,
			status: 'Processing'
		};
		setOrders([order, ...orders]);
		setCart([]);
		setShowCheckout(false);
		setShowCart(false);
		setTimeout(() => {
			setOrders(prev => prev.map(o => 
				o.id === order.id ? { ...o, status: 'Shipped' } : o
			));
		}, 3000);
	};

	const ProductCard = ({ product }) => (
		<div className="bg-white/15 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20 hover:bg-white/25 transition-all duration-300 cursor-pointer transform hover:scale-105" onClick={() => setSelectedProduct(product)}>
			<div className="relative mb-3">
				<img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
				<div className="absolute top-2 right-2 bg-blue-600/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
					{product.category}
				</div>
			</div>
			<h3 className="text-white font-bold text-lg mb-2">{product.name}</h3>
			<p className="text-blue-100 text-sm mb-3 line-clamp-2">{product.description}</p>
			<div className="flex justify-between items-center">
				<span className="text-white font-bold text-xl">${product.price}</span>
				<span className={`text-sm px-2 py-1 rounded-full ${ product.stock > 10 ? 'bg-green-600/80 text-white' :  product.stock > 0 ? 'bg-yellow-600/80 text-white' :  'bg-red-600/80 text-white' }`}>
					{product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
				</span>
			</div>
		</div>
	);

	return (
		<div className="relative w-full min-h-screen overflow-hidden">
			<div ref={mountRef} className="fixed inset-0 z-0" />

			<div className="relative z-10 min-h-screen">
				<header className="flex flex-wrap justify-between items-center p-6 bg-gradient-to-r from-blue-900/40 to-teal-900/40 backdrop-blur-sm">
					<div>
						<h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">🎣 Angler's Paradise</h1>
						<p className="text-blue-100 text-lg">Premium Fishing Gear & Equipment</p>
					</div>
					<div className="flex items-center gap-4">
						<span className="text-white">Welcome, {user.name}!</span>
						<button onClick={() => setShowOrders(true)} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white/30 transition-all">📋 Orders ({orders.length})</button>
						<button onClick={() => setShowCart(true)} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white/30 transition-all relative">
							🛒 Cart ({getTotalItems()})
							{getTotalItems() > 0 && (
								<span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm animate-pulse">{getTotalItems()}</span>
							)}
						</button>
					</div>
				</header>

				<div className="p-6 bg-white/10 backdrop-blur-sm">
					<div className="flex flex-wrap gap-4 items-center justify-between">
						<div className="flex-1 min-w-64">
							<input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:border-blue-400" />
						</div>
						<div className="flex gap-2 flex-wrap">
							{categories.map(category => (
								<button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-lg border transition-all ${selectedCategory === category ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/20 text-white border-white/30 hover:bg-white/30'}`}>
									{category}
								</button>
							))}
						</div>
					</div>
				</div>

				<main className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredProducts.map(product => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
					{filteredProducts.length === 0 && (
						<div className="text-center py-12">
							<p className="text-white text-xl">No products found matching your criteria.</p>
						</div>
					)}
				</main>
			</div>

			<Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} size="lg">
				{selectedProduct && (
					<div className="text-white">
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-lg" />
							</div>
							<div>
								<h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
								<span className="inline-block bg-blue-600/80 text-white px-3 py-1 rounded-full text-sm mb-4">{selectedProduct.category}</span>
								<p className="text-blue-100 mb-4 leading-relaxed">{selectedProduct.description}</p>
								<p className="text-4xl font-bold mb-4 text-green-300">${selectedProduct.price}</p>
								<p className={`mb-6 text-lg ${selectedProduct.stock > 0 ? 'text-green-300' : 'text-red-300'}`}>{selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}</p>
								<button onClick={() => { if (selectedProduct.stock > 0) { addToCart(selectedProduct); setSelectedProduct(null); } }} disabled={selectedProduct.stock === 0} className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100 font-semibold text-lg">
									{selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
								</button>
							</div>
						</div>
					</div>
				)}
			</Modal>

			<Modal isOpen={showCart} onClose={() => setShowCart(false)} size="lg">
				<div className="text-white">
					<h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
					{cart.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-blue-200 text-xl mb-4">Your cart is empty</p>
							<p className="text-blue-300">Browse our products and add some items!</p>
						</div>
					) : (
						<>
							<div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
								{cart.map(item => (
									<div key={item.id} className="flex items-center gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
										<img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
										<div className="flex-1">
											<h3 className="font-bold text-lg">{item.name}</h3>
											<p className="text-blue-200">${item.price} each</p>
											<p className="text-sm text-blue-300">{item.category}</p>
										</div>
										<div className="flex items-center gap-3">
											<button onClick={() => removeFromCart(item.id)} className="bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors">-</button>
											<span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
											<button onClick={() => addToCart(item)} className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors">+</button>
										</div>
										<div className="text-right">
											<p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
										</div>
									</div>
								))}
							</div>
							<div className="border-t border-white/30 pt-6">
								<div className="flex justify-between text-2xl font-bold mb-6">
									<span>Total: ${getTotalPrice()}</span>
									<span>({getTotalItems()} items)</span>
								</div>
								<button onClick={() => { setShowCart(false); setShowCheckout(true); }} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-lg transition-all transform hover:scale-105 font-semibold text-lg">Proceed to Checkout</button>
							</div>
						</>
					)}
				</div>
			</Modal>

			<Modal isOpen={showCheckout} onClose={() => setShowCheckout(false)} size="lg">
				<div className="text-white">
					<h2 className="text-3xl font-bold mb-6">Secure Checkout</h2>
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h3 className="text-xl font-bold mb-4">Order Summary</h3>
							<div className="space-y-3 mb-4 bg-white/10 p-4 rounded-lg max-h-48 overflow-y-auto">
								{cart.map(item => (
									<div key={item.id} className="flex justify-between">
										<span>{item.name} × {item.quantity}</span>
										<span>${(item.price * item.quantity).toFixed(2)}</span>
									</div>
								))}
							</div>
							<div className="border-t border-white/30 pt-4">
								<div className="flex justify-between font-bold text-xl">
									<span>Total:</span>
									<span className="text-green-300">${getTotalPrice()}</span>
								</div>
							</div>
						</div>
						<div>
							<div className="bg-amber-900/50 border border-amber-600/50 p-4 rounded-lg mb-6">
								<h4 className="font-bold text-amber-200 mb-2">🔒 Demo Checkout</h4>
								<p className="text-amber-100 text-sm">This is a demonstration checkout process. No real payments will be processed and no personal information is collected.</p>
							</div>
							<div className="space-y-4">
								<div className="bg-white/10 p-4 rounded-lg">
									<h4 className="font-semibold mb-2">Shipping Information</h4>
									<p className="text-blue-200 text-sm">Demo User Address</p>
									<p className="text-blue-200 text-sm">Free shipping on orders over $50!</p>
								</div>
								<div className="bg-white/10 p-4 rounded-lg">
									<h4 className="font-semibold mb-2">Payment Method</h4>
									<p className="text-blue-200 text-sm">💳 Simulated Secure Payment</p>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-8 flex gap-4">
						<button onClick={() => setShowCheckout(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors">Back to Cart</button>
						<button onClick={processOrder} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-lg transition-all transform hover:scale-105 font-semibold">Complete Order</button>
					</div>
				</div>
			</Modal>

			<Modal isOpen={showOrders} onClose={() => setShowOrders(false)} size="xl">
				<div className="text-white">
					<h2 className="text-3xl font-bold mb-6">Order History</h2>
					{orders.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-blue-200 text-xl mb-4">No orders yet</p>
							<p className="text-blue-300">Your order history will appear here after you make a purchase.</p>
						</div>
					) : (
						<div className="space-y-6 max-h-96 overflow-y-auto">
							{orders.map(order => (
								<div key={order.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
									<div className="flex justify-between items-start mb-4">
										<div>
											<h3 className="font-bold text-xl">Order #{order.id.slice(-6)}</h3>
											<p className="text-blue-200">{new Date(order.timestamp).toLocaleDateString()} at {new Date(order.timestamp).toLocaleTimeString()}</p>
										</div>
										<div className="text-right">
											<p className="text-2xl font-bold text-green-300">${order.total}</p>
											<span className={`inline-block px-3 py-1 rounded-full text-sm ${order.status === 'Processing' ? 'bg-yellow-600' : order.status === 'Shipped' ? 'bg-green-600' : 'bg-blue-600'}`}>{order.status}</span>
										</div>
									</div>
									<div className="space-y-2">
										<h4 className="font-semibold">Items:</h4>
										{order.items.map(item => (
											<div key={item.id} className="flex justify-between text-sm bg-white/5 p-2 rounded">
												<span>{item.name} × {item.quantity}</span>
												<span>${(item.price * item.quantity).toFixed(2)}</span>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default FishingEcommerce;