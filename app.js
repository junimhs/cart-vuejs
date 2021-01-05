const vm = new Vue({
  el: "#app",
  data: {
    products: [],
    product: false,
    cart: [],
    alertMessage: "Item adicionado com sucesso",
    alertView: false,
    cartActive: false
  },
  filters: {
    priceFormat(value) {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
  },
  methods: {
    fetchProducts() {
      fetch("./api/produtos.json")
        .then(r => r.json())
        .then(r => {
          this.products = r;
        })
    },
    fetchProduct(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then(r => r.json())
        .then(r => {
          this.product = r;
        })
    },
    modalClose({ target, currentTarget }) {
      if (target === currentTarget) {
        this.product = false
      }
    },
    cartClose({ target, currentTarget }) {
      if (target === currentTarget) {
        this.cartActive = false
      }
    },
    modalOpen(id) {
      this.fetchProduct(id);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    addItemCart(e) {
      this.product.estoque--;
      const { id, nome, preco } = this.product;
      this.cart.push({ id, nome, preco })
      this.alertDispatch(`${nome} foi adicionado ao carrinho.`)
    },
    checkStorage() {
      if (window.localStorage.cart) {
        this.cart = JSON.parse(window.localStorage.cart)
      }
    },
    alertDispatch(message) {
      this.alertMessage = message;
      this.alertView = true;
      setTimeout(() => {
        this.alertView = false;
      }, 1000)
    },
    route() {
      const hash = document.location.hash.replace("#", "")
      if (hash) {
        this.fetchProduct(hash)
      }
    },
    removeProduct(index) {
      this.cart.splice(index, 1);
    },
    compareStock() {
      const items = this.cart.filter(item => {
        if (item.id === this.product.id) {
          return true
        }
      })
      this.product.estoque = this.product.estoque - items.length
    }
  },
  created() {
    this.fetchProducts();
    this.checkStorage();
    this.route();
  },
  computed: {
    totalCart() {
      let total = 0;
      if (this.cart.length > 0) {
        this.cart.forEach(item => {
          total += item.preco;
        })
      }
      return total;
    }
  },
  watch: {
    product() {
      document.title = this.product.nome || 'Techno';
      const hash = this.product.id || "";
      history.pushState(null, null, `#${hash}`)
      if (this.product) {
        this.compareStock()
      }
    },
    cart() {
      window.localStorage.cart = JSON.stringify(this.cart)
    }
  }
})