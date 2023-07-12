async function getProducts() {
    try {
        const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/")

        const res = await data.json()

        window.localStorage.setItem('products', JSON.stringify(res))

        return res

    } catch (error) {
        console.log(error);
    }
}

function printProducts(db) {
    const productsHTML = document.querySelector('.products')

    let html = ``

    for (const product of db.Products) {

        html += `
        <div class='product ${product.category}'>

            <div class="product__img">
                <img src="${product.image}" alt="image" />
            </div>

            <div class="product__info">
                <p>${product.name} | <span><b>Stock</b>: ${product.quantity} </span> </p>
            <h4>
                $${product.price}
                ${
                    product.quantity
                    ? `<i class='bx bx-plus' id='${product.id}'></i>`
                    : "<span class='soldOut' >Sold out</span>"
                }
            </h4>

            </div>

            
        </div>
        `
    }

    productsHTML.innerHTML = html
}

function handleShowCart () {
    const iconcartHTML = document.querySelector('.bx-cart')
    const cartHTML = document.querySelector('.cart')

    
    iconcartHTML.addEventListener('click', function () {
        cartHTML.classList.toggle("cart__show")
    })
}

function addToCartFromProducts(db) {
    const productsHTML = document.querySelector('.products')

    productsHTML.addEventListener('click', function (e) {
        if (e.target.classList.contains(`bx-plus`)) {
            const id = Number(e.target.id);

            const productFind = db.Products.find(
                product => product.id ===id
                )

                if (db.cart[productFind.id]) {
                    if(productFind.quantity === db.cart[productFind.id].amount) 
                    return alert('No tenemos más')
                    db.cart[productFind.id].amount++
                } else {
                    db.cart[productFind.id] = {...productFind, amount: 1 }
                }

                window.localStorage.setItem("cart", JSON.stringify(db.cart))

                printProductsInCart(db)
                printTotal(db)
                handlePrintAmountProducts(db)
        }
    })
}

function printProductsInCart(db) {
    const cardProducts = document.querySelector(".cart__products")

let html = ''

for (const product in db.cart) {
   const { quantity,price,name,image,id,amount} = db.cart[product]
    html += `
        <div class="cart__product">
            <div class="cart__product--img">
                <img src="${image}" alt="imagen"/>
            </div>

            
            <div class="cart__product--body">
                <h4>${name} | $${price} </h4>
                <p>Stock: ${quantity}</p>
            
                <div class="cart__product--body--op" id='${id}'>
                <i class='bx bx-minus'></i>
                <span> ${amount} unit </span>
                <i class='bx bx-plus' ></i>
                <i class='bx bx-trash' ></i>
                </div>

            </div>
        </div>
    `;
    
}
cardProducts.innerHTML = html
}

function handleProductsInCart(db) {
    const cartProdcts = document.querySelector(".cart__products")

    cartProdcts.addEventListener("click", function (e) {
        
        

        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.parentElement.id)
           const productFind = db.Products.find(
                product => product.id === id)

        if(productFind.quantity === db.cart[productFind.id].amount) 
                    return alert('No tenemos más')
            db.cart[id].amount++
        }
        if (e.target.classList.contains("bx-minus")) {
            const id = Number(e.target.parentElement.id)
            if (db.cart[id].amount === 1) {
                const response = confirm(
                    "¿Estás seguro de que quieres eliminar este producto?"
                )
                if (!response) return
                delete db.cart[id]
            } else {
                db.cart[id].amount--
            }
            
        }
        if (e.target.classList.contains("bx-trash")) {
            const id = Number(e.target.parentElement.id)
            const response = confirm(
                "¿Estás seguro de que quieres eliminar este producto?"
            )
            if (!response) return
            delete db.cart[id]
        }
        window.localStorage.setItem('cart', JSON.stringify(db.cart))
        printProductsInCart(db)
        printTotal(db)
        handlePrintAmountProducts(db)
    })
}

function printTotal (db) {
    const infoTotal = document.querySelector(".info__total")
    const infoAmount = document.querySelector(".info__amount")

    let totalPrice = 0
    let amountProducts = 0

    for (const product in db.cart) {
        const {amount, price} = db.cart[product]
        totalPrice += amount*price
        amountProducts += amount
        }

        infoTotal.textContent = '$' + totalPrice + '.00'
        infoAmount.textContent = amountProducts +' units'

}

function handleTotal (db) {
    const btnBuy = document.querySelector(".btn__buy")

    btnBuy.addEventListener('click', function () {
       
        if (!Object.values(db.cart).length) return alert('Pero tienes que tener algo en el carrito');
        const response = confirm("Seguro que quieres comprar?")
        if (!response) return
        
        const currentProducts = []

        for (const product of db.Products) {
            const productCart = db.cart[product.id]
            if (product.id === productCart?.id){
                currentProducts.push({
                ...product,
                quantity: product.quantity - productCart.amount
            })
            } else {
                currentProducts.push(product)
            }
        } 

        db.Products = currentProducts
        db.cart = {}

        window.localStorage.setItem('products', JSON.stringify(db.Products))
        window.localStorage.setItem('cart', JSON.stringify(db.cart))

        printTotal(db)
        printProductsInCart(db)
        printProducts(db)
        handlePrintAmountProducts(db)

    })
}

function handlePrintAmountProducts(db) {
    const amountProducts = document.querySelector(".amountProducts")

    let amount = 0
    
    for (const product in db.cart) {
        
        amount += db.cart[product].amount
    }

    amountProducts.textContent = amount
}

function toDarkMode() {
    
    const addDarkmode = document.querySelector('.addDarkMode')
    const removeDarkMode = document.querySelector('.removeDarkMode')
    if(JSON.parse(localStorage.getItem("isdark"))) document.body.classList.add('darkmode')

    addDarkmode.addEventListener("click", () => {
        localStorage.setItem('isdark', JSON.stringify(true))
        document.body.classList.add('darkmode')
       
    })
    removeDarkMode.addEventListener("click", () => {
        localStorage.setItem('isdark', JSON.stringify(false))
        document.body.classList.remove('darkmode')
    })
}

async function main() {

    const db = {
        Products: (JSON.parse(window.localStorage.getItem('products'))) || await getProducts(),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {}
    }

    printProducts(db)
    handleShowCart ()
    addToCartFromProducts(db)
    printProductsInCart(db)
    handleProductsInCart(db)
    printTotal(db)
    handleTotal(db)
    handlePrintAmountProducts(db)
    toDarkMode()

    mixitup(".products", {
        selectors: {
            target: '.product'
        },
        animation: {
            duration: 300
        }
    });

}



main()