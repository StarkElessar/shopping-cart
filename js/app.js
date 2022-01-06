document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-container')
  getProducts()

  async function getProducts() {
    const response = await fetch('js/products.json')    
    const productsArray = await response.json() 
    
    renderProducts(productsArray)
  }
  
  const renderProducts = (productsArray) => {
    productsArray.forEach((item) => {
      const { id, imgSrc, title, itemsInBox, weight, price } = item
      const productHTML = `
        <div class="col-md-6">
          <div class="card mb-4" data-id="${id}">
            <img class="product-img" src="img/roll/${imgSrc}" alt="">
            <div class="card-body text-center">
              <h4 class="item-title">${title}</h4>
              <p><small data-items-in-box class="text-muted">${itemsInBox} шт.</small></p>

              <div class="details-wrapper">
                <div class="items counter-wrapper">
                  <div class="items__control" data-action="minus">-</div>
                  <div class="items__current" data-counter>1</div>
                  <div class="items__control" data-action="plus">+</div>
                </div>

                <div class="price">
                  <div class="price__weight">${weight}г.</div>
                  <div class="price__currency">${price} ₽</div>
                </div>
              </div>

              <button data-cart type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>

            </div>
          </div>
        </div>
      `

      productsContainer.insertAdjacentHTML('beforeend', productHTML)
    })
  }

  
  document.addEventListener('click', (event) => {
    let counter
    const $this           = event.target
    const cartWrapper     = document.querySelector('.cart-wrapper')
    const cartIsEmpty     = document.querySelector('[data-cart-empty]')
    const orderForm       = document.getElementById('order-form')
    const deliveryCost    = document.querySelector('.delivery-cost')
    const deliveryLabel = document.querySelector('[data-cart-delivery]')
    
    const calculatorCartPriceAndDelivery = () => {
      let totalPrice = 0
      const cartItems = document.querySelectorAll('.cart-item')
      
      cartItems.forEach((item) => {
        const amountElement = item.querySelector('[data-counter]')
        const priceElement  = item.querySelector('.price__currency')
        const currentPrice  = parseInt(amountElement.innerText) * parseInt(priceElement.innerText)

        totalPrice += currentPrice
      })
      document.querySelector('.total-price').innerHTML = totalPrice
      deliveryCost.classList.toggle('free', totalPrice >= 600)
      totalPrice >= 600 ? deliveryCost.innerHTML = 'бесплатно' : deliveryCost.innerHTML = '250 ₽'
    }

    if ($this.dataset.action === 'minus' || $this.dataset.action === 'plus') {
      const counterWrapper = $this.closest('.counter-wrapper')
      counter = counterWrapper.querySelector('[data-counter]')
    }
    // Условие, чтобы счетчик не опускался меньше 1
    if ($this.dataset.action === 'minus') {
      if (parseInt(counter.innerText) > 1) {
        counter.innerHTML = parseInt(counter.innerText) - 1
      } else if ($this.closest('.cart-wrapper') && parseInt(counter.innerText) === 1) {
        $this.closest('.cart-item').remove()
        toggleCartStatus()
        calculatorCartPriceAndDelivery()
      }
    }
    if ($this.dataset.action === 'plus') {
      counter.innerHTML = parseInt(counter.innerText) + 1
    }
    if ($this.hasAttribute('data-action') && $this.closest('.cart-wrapper')) {
      calculatorCartPriceAndDelivery()
    }

    // Клик по кнопке "в корзину"
    if ($this.hasAttribute('data-cart')) {
      const card = $this.closest('.card')
      const productInfo = {
        id: card.dataset.id,
        img: card.querySelector('.product-img').getAttribute('src'),
        title: card.querySelector('.item-title').innerHTML,
        itemInBox: card.querySelector('[data-items-in-box]').innerHTML,
        weight: card.querySelector('.price__weight').innerHTML,
        price: card.querySelector('.price__currency').innerHTML,
        counter: card.querySelector('[data-counter]').innerHTML
      }
      const { id, img, title, itemInBox, weight, price, counter } = productInfo
      const itemInCart = cartWrapper.querySelector(`[data-id="${id}"]`)

      // Есть ли данный товар в корзине
      if (itemInCart) {
        const counterElement = itemInCart.querySelector('[data-counter]')
        counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.counter)
      } else {
        const cardItemHTML = `
          <div class="cart-item" data-id="${id}">
            <div class="cart-item__top">
              <div class="cart-item__img">
                <img src="${img}" alt="${title}">
              </div>
              <div class="cart-item__desc">
                <div class="cart-item__title">${title}</div>
                <div class="cart-item__weight">${itemInBox} / ${weight}</div>
                <div class="cart-item__details">
                  <div class="items items--small counter-wrapper">
                    <div class="items__control" data-action="minus">-</div>
                    <div class="items__current" data-counter="">${counter}</div>
                    <div class="items__control" data-action="plus">+</div>
                  </div>
                  <div class="price">
                    <div class="price__currency">${price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
  
        cartWrapper.insertAdjacentHTML('beforeend', cardItemHTML)
      }
      // Сбрасываю счетчик после нажатия добавления товара в корзину
      card.querySelector('[data-counter]').innerText = '1'
      toggleCartStatus()
      calculatorCartPriceAndDelivery()
    }

    function toggleCartStatus() {
      cartIsEmpty.classList.toggle('hide', cartWrapper.children.length > 0)
      orderForm.classList.toggle('none', cartWrapper.children.length === 0)
      deliveryLabel.classList.toggle('none', cartWrapper.children.length === 0)

      // if (cartWrapper.children.length > 0) {
      //   cartIsEmpty.classList.add('hide')
      //   orderForm.classList.remove('none')
      // } else {
      //   cartIsEmpty.classList.remove('hide')
      //   orderForm.classList.add('none')
      // }
    }
  })
})