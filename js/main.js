// Defino los eventos disponibles en la página
let eventos = [
    {
        id: 1,
        nombre: "DUA LIPA",
        img: './images/img_dua_lipa.png',
        precio: 7000,
        disponibles: 2, 
    },
    {
        id: 2,
        nombre: "IMAGINE DRAGONS",
        img: './images/img_imagine_dragons.webp',
        precio: 5500,
        disponibles: 0, 
    },
    {
        id: 3,
        nombre: "LOLLAPALOOZA",
        img: './images/img_lollapalooza.jfif',
        precio: 13500,
        disponibles: 0, 
    },
    {
        id: 4,
        nombre: "PRIMAVERA SOUND",
        img: './images/img_primavera_sound.png',
        precio: 10300,
        disponibles: 10, 
    },
    {
        id: 5,
        nombre: "COTI",
        img: './images/img_coti.jpg',
        precio: 2200,
        disponibles: 6, 
    },
    {
        id: 6,
        nombre: "HARRY STYLES",
        img: './images/img_harry_styles.png',
        precio: 8800,
        disponibles: 0, 
    },
    {
        id: 7,
        nombre: "VALDES",
        img: './images/img_valdes.jpg',
        precio: 1800,
        disponibles: 7, 
    },
    {
        id: 8,
        nombre: "RAYOS LASER",
        img: './images/img_rayos_laser.jpg',
        precio: 1800,
        disponibles: 5, 
    }
]

class Pedido{
    constructor(id, evento, entradas, precio){
        this.id = id;
        this.evento = evento;
        this.entradas = entradas;
        this.precio = precio;
    }
}

// CAROUSEL
var slideIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > x.length) {slideIndex = 1}
  x[slideIndex-1].style.display = "block";
  setTimeout(carousel, 3000);
}

const contenedorEventos = document.querySelector("#contenedor-eventos");
const contenedorCarrito = document.querySelector(".carrito-compras");
const listadoCarrito = [];

// Cargar los eventos disponibles en la página
document.addEventListener("DOMContentLoaded", function() {
    mostrarEventos();
})

function mostrarEventos() {
    eventos.forEach(function(evento) {
        const divEvento = document.createElement("div");
        divEvento.classList.add("card");
        divEvento.setAttribute("id", "card" + evento.id);

        const imagenEvento = document.createElement("img");
        imagenEvento.src = evento.img;
        imagenEvento.className = "imagen-evento";

        const nombreEvento = document.createElement("h2");
        nombreEvento.textContent = evento.nombre;
        nombreEvento.classList.add("titulo-evento");

        const precioEvento = document.createElement("h4");
        precioEvento.textContent = "$" + evento.precio;
        precioEvento.className = "precio-evento";

        const formEntradas = document.createElement("form");
        formEntradas.innerHTML = `<br><label for="entradas">Entradas </label><input type="number" value="0" min="0" max="6" id="entradas${evento.id}">`

        const btnAgregarCarrito = document.createElement("button");
        btnAgregarCarrito.textContent = "Agregar a carrito";
        btnAgregarCarrito.classList.add("btn-carrito");
        btnAgregarCarrito.setAttribute("type", "submit");

        divEvento.appendChild(imagenEvento);
        divEvento.appendChild(nombreEvento);
        divEvento.appendChild(precioEvento);
        divEvento.appendChild(formEntradas);
        divEvento.appendChild(btnAgregarCarrito);

        const avisoSinStock = document.createElement("h4");
        avisoSinStock.innerHTML = "";

        // Agregamos evento al boton
        btnAgregarCarrito.addEventListener("click", (e) => {
            e.preventDefault();
            let entradas = parseInt(document.getElementById("entradas" + evento.id).value);
            console.log(entradas);
            console.log(evento.id);
            agregarACarrito(evento.id, entradas);
            if(evento.disponibles == 0 && avisoSinStock.innerHTML.length == 0){
                avisoSinStock.textContent = "Ya no quedan entradas para este evento.";
                avisoSinStock.classList.add("aviso");
                divEvento.appendChild(avisoSinStock);   
            }
        });

        if(evento.disponibles == 0){
            avisoSinStock.textContent = "Ya no quedan entradas para este evento.";
            avisoSinStock.classList.add("aviso");
            divEvento.appendChild(avisoSinStock);   
        }

        contenedorEventos.appendChild(divEvento);
    })
}

function repetido(carrito, id){
    return carrito.some(item => id == item.id);
}

function agregarACarrito(id, entradas) {
    const eventoEncontrado = eventos.find(function(evento) {
        return evento.id === id;
    });
    if(entradas != 0){
        if(entradas <= eventoEncontrado.disponibles){
                if(repetido(listadoCarrito, id)){
                    for(let pedido of listadoCarrito){
                        if(pedido.id == id){
                            pedido.entradas += entradas;
                            pedido.precio += eventoEncontrado.precio * entradas;
                        }
                    }
                }else{
                    listadoCarrito.push(new Pedido(eventoEncontrado.id, eventoEncontrado.nombre, entradas, eventoEncontrado.precio * entradas));
                }
                for(let evento of eventos){
                    if(evento.id == id){
                        evento.disponibles -= entradas;
                    }
                }
        }           
    }
    console.log(listadoCarrito);
}

const btnMostrarCarrito = document.getElementById("btn-mostrar");
btnMostrarCarrito.addEventListener("click", mostrarMiCarrito);

function mostrarMiCarrito() {
    contenedorCarrito.innerHTML = `<p class="texto-pedido">Tu carrito se compone de:</p>`;

    listadoCarrito.forEach(function(pedido) {
        const divPedido = document.createElement("div");   
        const textoPedido = document.createElement("p");
        textoPedido.textContent = pedido.entradas + "x entradas para " + pedido.evento + " por $" + pedido.precio + ".";
        textoPedido.className = "texto-pedido";
        
        divPedido.appendChild(textoPedido);           
        contenedorCarrito.appendChild(divPedido);
    });

    const divTotal = document.createElement("div");
    const textoTotal = document.createElement("p");
    let precioTotal = listadoCarrito.reduce((acumulador, pedido) => acumulador + pedido.precio, 0);
    textoTotal.textContent = "TOTAL = $" + precioTotal;
    divTotal.appendChild(textoTotal);
    contenedorCarrito.appendChild(divTotal);

    const formularioDePago = document.createElement("form");
    formularioDePago.classList.add("formulario-de-pago");
    formularioDePago.innerHTML = `<div><label>Modo de pago:</label><br><br>
                                  <input type="radio" name="modo-de-pago" id="contado" value="contado" checked="checked" required> Contado   
                                  <input type="radio" name="modo-de-pago" id="3-cuotas" value="3-cuotas"> 3 cuotas   
                                  <input type="radio" name="modo-de-pago" id="6-cuotas" value="6-cuotas"> 6 cuotas   
                                  <input type="radio" name="modo-de-pago" id="12-cuotas" value="12-cuotas"> 12 cuotas   
                                  </div>
                                  <div>
                                  <label for="tarjeta_prov">Proveedor de la tarjeta: </label><br><br>
                                  <input type="radio" name="tarjeta_prov" id="amex" checked="checked" required> AMEX
                                  <input type="radio" name="tarjeta_prov" id="vis"> VISA
                                  <input type="radio" name="tarjeta_prov" id="mastercard"> MasterCard
                                  </div>
                                  <div>
                                  <label for="tarjeta_num">Número de tarjeta: </label>
                                  <input type="text" name="tarjeta_num" id="tarjeta_num" minlength="16" maxlength="16" required>
                                  </div>
                                  <div>
                                  <label for="tarjeta_nomb">Nombre en la tarjeta: </label>
                                  <input type="text" name="tarjeta_nomb" id="tarjeta_nomb" minlength="8" required>
                                  </div>
                                  <div>
                                  <label for="tarjeta_cvv">Código de seguridad de la tarjeta: </label>
                                  <input type="password" name="tarjeta_cvv" id="tarjeta_cvv" minlegth="3" maxlength="4" required>
                                  </div>
                                  <div>
                                  <button type="submit" class="btn-carrito" id="btn-confirmar">Confirmar compra</button>
                                  </div>`
    contenedorCarrito.appendChild(formularioDePago);

    const btnConfirmarCompra = document.getElementById("btn-confirmar");
    btnConfirmarCompra.addEventListener("click", (e) => {
        e.preventDefault();
        const modoDePago = document.querySelector('input[name="modo-de-pago"]:checked').value;
        const proveedorDeTarjeta = document.querySelector('input[name="tarjeta_prov"]:checked').value;
        const numeroTarjeta = document.getElementById("tarjeta_num").value;
        const nombreTarjeta = document.getElementById("tarjeta_nomb").value;
        const cvvTarjeta = document.getElementById("tarjeta_cvv").value;
        const divMensaje = document.createElement("div");
        const mensaje = document.createElement("h2");
        if(modoDePago.length != 0 && proveedorDeTarjeta.length != 0 && numeroTarjeta.length != 0 && nombreTarjeta.length != 0 &&
            cvvTarjeta.length != 0){
                divMensaje.innerHTML = "";
                mensaje.innerText = "La compra se ha realizado correctamente.";
                contenedorCarrito.appendChild(divMensaje);
                divMensaje.appendChild(mensaje);
        }else if(mensaje.innerText.length == 0){
            divMensaje.innerHTML = ""; 
            mensaje.innerText = "No completaste todos los campos.";
            contenedorCarrito.appendChild(divMensaje);
            divMensaje.appendChild(mensaje);
        }
        
    });
}
