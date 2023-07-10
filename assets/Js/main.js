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
        <div class='product'>

            <div class="product__img">
                <img src="${product.image}" alt="image" />
            </div>

            <div class="product__info">
                <p>${product.name} | <span><b>Stock</b>: ${product.quantity} </span> </p>
            <h4>
                $${product.price}
                <i class='bx bx-plus' id='${product.id}'></i>
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
        }
    })
}

function printProductsInCart(db) {
    const cardProducts = document.querySelector(".card__products")

let html = ''

for (const product in db.cart) {
   const { quantity,price,name,image,id,amount} = db.cart[product]
    html += `
        <div class="card__product">
            <div class="card__product--img">
                <img src="${image}" alt="imagen"/>
            </div>

            
            <div class="card__product--body">
                <h4>${name} | $${price} </h4>
                <p>Stock: ${quantity}</p>
            
                <div class="card__product--body--op" id='${id}'>
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
    const cartProdcts = document.querySelector(".card__products")

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
    }



main()