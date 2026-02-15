let todasLasTarjetas = [];
let tarjetasMostradas = 0;
const tarjetasPorCarga = 5;

document.addEventListener("DOMContentLoaded", () => {
    fetch("json/tarjetas-presentacion.json")
        .then(res => res.json())
        .then(data => {
            todasLasTarjetas = data;
            cargarMasTarjetas();
        });

    document.getElementById("btn-cargar-mas").addEventListener("click", cargarMasTarjetas);
});

function cargarMasTarjetas() {

    const contenedor = document.getElementById("contenedor-tarjetas");

    const siguienteGrupo = todasLasTarjetas.slice(
        tarjetasMostradas,
        tarjetasMostradas + tarjetasPorCarga
    );

    siguienteGrupo.forEach((t, indexGlobal) => {

        const index = tarjetasMostradas + indexGlobal;

        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6";

        col.innerHTML = `
        <div class="listing__item">

            <div class="carousel" id="carousel-${index}">
                ${t.imagenes.map((img, i) => `
                    <div class="carousel-slide ${i === 0 ? 'active' : ''}" 
                         style="background-image:url('${img}')"></div>
                `).join("")}
            </div>

            <div class="carousel-bar">
                <button class="pause-btn" onclick="togglePlay(${index})" id="play-${index}">
                    ⏸
                </button>

                <div class="carousel-indicator" id="indicator-${index}">
                    1 de ${t.imagenes.length}
                </div>
            </div>

            <div class="listing__item__text">
                <div class="listing__item__text__inside">
                    <h5>${t.nombre_negocio}</h5>

                    <div class="listing__item__text__rating">
                        <p>${t.representante}</p>
                        <h6>${t.rango_precio}</h6>
                    </div>

                    <ul>
                        ${t.direcciones.map(d => `
                            <li><span class="icon_pin_alt"></span> ${d}</li>
                        `).join("")}

                        ${t.telefonos.map(tel => `
                            <li><span class="icon_phone"></span> ${tel}</li>
                        `).join("")}

                        <li><span class="icon_mail_alt"></span> ${t.correo}</li>
                    </ul>
                </div>

                <div class="listing__item__text__info">
                    <div class="listing__item__text__info__left">
                        <span class="rubro-badge">${t.rubro}</span>
                    </div>

                    <div class="listing__item__text__info__right btn-web">
                        <a href="${t.web}" target="_blank">Visitar Sitio</a>
                    </div>
                </div>
            </div>
        </div>
        `;

        contenedor.appendChild(col);
        iniciarCarousel(index);
    });

    tarjetasMostradas += tarjetasPorCarga;

    // Ocultar botón si ya no hay más
    if (tarjetasMostradas >= todasLasTarjetas.length) {
        document.getElementById("btn-cargar-mas").style.display = "none";
    }
}


/* =======================
   CARRUSEL LOGICA
======================= */

const carouseles = {};

function iniciarCarousel(index) {

    const slides = document.querySelectorAll(`#carousel-${index} .carousel-slide`);
    const indicator = document.getElementById(`indicator-${index}`);
    let current = 0;

    function mostrarSlide(i) {
        slides.forEach(s => s.classList.remove("active"));
        slides[i].classList.add("active");

        indicator.textContent = `${i + 1} de ${slides.length}`;
    }

    function next() {
        current = (current + 1) % slides.length;
        mostrarSlide(current);
    }

    const intervalo = setInterval(next, 5000);

    carouseles[index] = {
        next,
        intervalo,
        playing: true
    };
}


function nextSlide(index) {
    carouseles[index].next();
}

function prevSlide(index) {
    carouseles[index].prev();
}

function togglePlay(index) {

    const btn = document.getElementById(`play-${index}`);

    if (carouseles[index].playing) {
        clearInterval(carouseles[index].intervalo);
        carouseles[index].playing = false;
        btn.textContent = "▶";
    } else {
        carouseles[index].intervalo = setInterval(carouseles[index].next, 5000);
        carouseles[index].playing = true;
        btn.textContent = "⏸";
    }
}
