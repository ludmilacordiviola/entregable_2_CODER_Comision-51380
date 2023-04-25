const fs = require("fs");

class ProductManager {
  id = 1
  constructor() {
    this.path = "./products.json"
    this.products = []
  }


  addProduct = async (product) => {
    const checkCode = this.products.find((p) => p.code === product.code)
    if (checkCode) {
      return 'This code already exists'
    }
    function validateFields(product) {
      const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock']
      const missingFields = requiredFields.filter(field => !product[field])
    
      if (missingFields.length > 0) {
        throw new Error(`Fields missing: ${missingFields.join(', ')}`)
      }
    }
    try {
      validateFields(product)
    } catch (error) {
      console.error(error)
    }
    const newProduct = { ...product, id: this.id }
    this.id++
    this.products.push(newProduct)

    await fs.promises.writeFile(this.path, JSON.stringify(this.products))

    return 'Product added'
  }

  readProducts = async () => {
    const productsRead = await fs.promises.readFile(this.path, "utf-8")
    return JSON.parse(productsRead)
  }

  getProducts = async () => {
    const productsGet = await this.readProducts()
    return console.log(productsGet)
  }

  getProductById = async (id) => {
    const found = await this.readProducts()
    if (!found.find((p) => p.id === id)) {
      return 'Not found'
    }
    return found
  }

  updateProducts = async({id, ...products}) =>{
    await this.deleteProductById(id)
    const currentProduct = await this.readProducts()
    const modifiedProduct = [
     {...products, id},
     ...currentProduct]
     await fs.promises.writeFile(this.path, JSON.stringify(modifiedProduct))
  }

  deleteProductById = async (id) => {
    const productDeleteById = await this.readProducts()
    const productFilter = productDeleteById.filter((products) => products.id != id)
    await fs.promises.writeFile(this.path, JSON.stringify(productFilter))
    console.log("Delete product")
  }

}

const productManager = new ProductManager();

productManager.addProduct({"title":"Dawn FM","description":"The Weeknds 8th Album","price":"8000","thumbnail":"https://i.discogs.com/KL5CE197nZ4hnfBAAivjMc92VZXXnwmkOk5BarIyUsM/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIxNTg4/OTM0LTE2NjQzOTYy/ODEtNjg1NS5qcGVn.jpeg","code":"abel2022","stock":"1500"})
//productManager.addProduct({"title":"Beauty Behind The Madness","description":"The Weeknds 5th Album","price":"8000","thumbnail":"https://i.discogs.com/chdaqKfIQd_pa0Q9CR9OEQa7vNaP5aVrNZc4w7zqxDA/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc1ODkx/NDItMTQ0NDY1NDc4/Ni0zODc0LmpwZWc.jpeg","code":"abel2020","stock":"3000"})

productManager.getProducts();
//productManager.getProductsById(5)
//productManager.deleteProductById(2)
/*productManager.updateProducts("title":"Dawn FM","description":"The Weeknds 8th Album","price":"8000","thumbnail":"https://i.discogs.com/KL5CE197nZ4hnfBAAivjMc92VZXXnwmkOk5BarIyUsM/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIxNTg4/OTM0LTE2NjQzOTYy/ODEtNjg1NS5qcGVn.jpeg","code":"abel2022","stock":"1000")*/