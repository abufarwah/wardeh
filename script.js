const products = [
  {
    id: 1,
    name: "Lounge Chocolate Box | Red Whisper Flower Bouquet",
    description: "A beautiful combination of chocolate and flowers for a special moment",
    price: 24,
    image: "images/w1.avif",
    category: "chocolates",
    targetModal: "#exampleModal"
  },
  {
    id: 2,
    name: "Red Whisper Flower Bouquet",
    description: "A beautiful combination of flowers for a special moment",
    price: 39,
    image: "images/w3.avif",
    category: "flowers",
    targetModal: "#exampleModal2"
  },
  {
    id: 3,
    name: "Lounge Wardeh Box",
    description: "A delightful box of combination premium chocolates for any occasion",
    price: 35,
    image: "images/w2.avif",
    category: "chocolates",
    targetModal: "#exampleModal3"
  },
  {
    id: 4,
    name: "Color Embrace Flower Bouquet",
    description: "A beautiful combination of flowers for a special moment",
    price: 35,
    image: "images/w4.avif",
    category: "flowers",
    targetModal: "#exampleModal4"
  },
  {
    id: 5,
    name: "Breathtaking Red Roses Vase | 50 Flowers",
    description: "A stunning vase filled with 50 red roses for a romantic and elegant gift",
    price: 45,
    image: "images/w5.avif",
    category: "flowers",
    targetModal: "#exampleModal5"
  },
  {
    id: 6,
    name: "Heartfelt Baby Roses Bouquet",
    description: "A delicate and charming bouquet of baby roses for a heartfelt gift",
    price: 45,
    image: "images/w6.avif",
    category: "flowers",
    targetModal: "#exampleModal6"
  },
  {
    id: 7,
    name: "Dazzling Red Rose Bouquet | 25 Flowers",
    description: "elegant Dazzling Red Rose Bouquet wrapped in sleek black wrap",
    price: 39,
    image: "images/best1.avif",
    category: "best-seller",
    targetModal: "#bestModal1"
  },
  {
    id: 8,
    name: "Elegant White Roses Bouquet | 50 Roses",
    description: "Elevate any occasion with our Luxury Roses Bouquet",
    price: 39,
    image: "images/best11.avif",
    category: "best-seller",
    targetModal: "#bestModal2"
  },
  {
    id: 9,
    name: "Charming Fuchsia Roses Bouquet | 50 Roses",
    description: "featuring vibrant fuchsia roses wrapped in a chic cream wrap",
    price: 39,
    image: "images/besto1.avif",
    category: "best-seller",
    targetModal: "#bestModal3"
  }
];

let cart = JSON.parse(localStorage.getItem("wardehCart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  // Setup modal add-to-cart buttons
  products.forEach(product => {
    const modal = document.querySelector(product.targetModal);
    if (modal) {
      const modalAddBtn = modal.querySelector('.modal-footer .btn-secondary');
      if (modalAddBtn) {
        modalAddBtn.classList.add('add-to-cart-btn');
        modalAddBtn.setAttribute('data-id', product.id);
      }
    }
  });

  // Setup Best Sellers static card buttons
  products.filter(p => p.category === 'best-seller').forEach(product => {
    const cardImg = document.querySelector(`img[src="${product.image}"]`);
    if(cardImg) {
      const card = cardImg.closest('.card');
      if (card) {
        const cardBtn = card.querySelector('.btn-secondary');
        if (cardBtn) {
          cardBtn.classList.add('add-to-cart-btn');
          cardBtn.setAttribute('data-id', product.id);
        }
      }
    }
  });

  // Global click listener for all Add to Cart buttons (Delegation)
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (btn) {
      e.preventDefault();
      const productId = parseInt(btn.getAttribute("data-id"));
      if(productId) addToCart(productId);
    }
  });
  renderProducts("all");
  updateCartUI();

  // Filter Buttons
  const filterButtons = document.querySelectorAll("#filter-buttons button");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // Update active state classes
      filterButtons.forEach(b => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-secondary");
      });
      e.target.classList.remove("btn-secondary");
      e.target.classList.add("btn-primary");

      const category = e.target.getAttribute("data-category");
      renderProducts(category);
    });
  });

  // Clear Cart Button
  document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    saveCart();
    updateCartUI();
  });

  // Newsletter Form Validation
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput.value.trim() === "") {
        alert("Please enter a valid email address.");
      } else {
        showToast("Thank you for subscribing to our newsletter!");
        emailInput.value = "";
      }
    });
  }
});

function renderProducts(category) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  const filteredProducts = category === "all" ? products : products.filter(p => p.category === category);

  if (filteredProducts.length === 0) {
    productList.innerHTML = `<p class="text-center text-muted w-100 mt-5">No products found in this category.</p>`;
    return;
  }

  filteredProducts.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-md-4 col-sm-6";
    
    col.innerHTML = `
      <div class="card h-100">
        <div data-bs-toggle="modal" data-bs-target="${product.targetModal}" style="cursor: pointer;">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title" data-bs-toggle="modal" data-bs-target="${product.targetModal}" style="cursor: pointer;">${product.name}</h5>
          <p class="card-text mb-4">${product.description}</p>
          <div class="mt-auto">
            <p class="mb-2">Price: <span class="ofc-prc">${product.price} JOD</span></p>
            <button class="btn btn-secondary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    productList.appendChild(col);
  });

}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`Added ${product.name} to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function changeQuantity(productId, amount) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

function saveCart() {
  localStorage.setItem("wardehCart", JSON.stringify(cart));
}

function updateCartUI() {
  const cartBadge = document.querySelector(".cart-badge");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");

  // Calculate total items and price
  let totalItems = 0;
  let totalPrice = 0;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="text-center text-muted mt-4">Your cart is empty.</p>`;
  } else {
    cart.forEach(item => {
      totalItems += item.quantity;
      totalPrice += (item.price * item.quantity);

      const itemEl = document.createElement("div");
      itemEl.className = "d-flex align-items-center mb-3 pb-3 border-bottom";
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" class="me-3">
        <div class="flex-grow-1">
          <h6 class="mb-1" style="font-size: 14px;">${item.name}</h6>
          <div class="text-muted small">${item.price} JOD</div>
          <div class="d-flex align-items-center mt-2">
            <button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="changeQuantity(${item.id}, -1)">-</button>
            <span class="mx-2">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="btn btn-link text-danger p-0 ms-2" onclick="removeFromCart(${item.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  cartBadge.textContent = totalItems;
  cartTotalEl.textContent = totalPrice;
}

function showToast(message) {
  const toastBody = document.getElementById("cartToastBody");
  toastBody.textContent = message;
  
  const toastEl = document.getElementById("cartToast");
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}
