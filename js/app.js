document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    let counter
    const $this       = event.target
    const cartWrapper = document.querySelector('.cart-wrapper')
    // const cartItems   = document.querySelectorAll('.cart-item')
    const cartIsEmpty = document.querySelector('[data-cart-empty]')
    const orderForm   = document.getElementById('order-form')
    
    const calculatorCartPrice = () => {
      let totalPrice = 0
      const cartItems = document.querySelectorAll('.cart-item')
      
      cartItems.forEach((item) => {
        const amountElement = item.querySelector('[data-counter]')
        const priceElement = item.querySelector('.price__currency')

        const currentPrice = parseInt(amountElement.innerText) * parseInt(priceElement.innerText)

        totalPrice += currentPrice
        console.log(totalPrice);
      })
      document.querySelector('.total-price').innerHTML = totalPrice
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
      }
    }
    if ($this.dataset.action === 'plus') {
      counter.innerHTML = parseInt(counter.innerText) + 1
    }
    if ($this.hasAttribute('data-action') && $this.closest('.cart-wrapper')) {
      calculatorCartPrice()
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
      calculatorCartPrice()
    }

    function toggleCartStatus() {
      if (cartWrapper.children.length > 0) {
        cartIsEmpty.classList.add('hide')
        orderForm.classList.remove('none')
      } else {
        cartIsEmpty.classList.remove('hide')
        orderForm.classList.add('none')
        document.querySelector('.total-price').innerHTML = 0
      }
    }
  })
})