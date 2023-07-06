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

    console.log(productsHTML);

    let html = ``

    for (const product of db.Products) {

        html += `
        <div class='product'>
            <p> Id: ${product.id}</p>
            <p>${product.name}</p>
        </div>
        `
    }
    console.log(html);

    productsHTML.innerHTML = html
}

async function main() {

    const db = {
        Products: (JSON.parse(window.localStorage.getItem('products'))) || await getProducts(),
        cart: {}
    }

    printProducts(db)
}

main()