// Variables globales
let pantallaActual = 1;
const retos = {
    Dani: [
        "Reto: te reto a hacer caras raras hasta que me hagas reír.",
        "Reto: te reto a grabarte un video ahora mismo y enviármelo al WhatsApp (no para ver una vez).",
        "Reto: habla con acento argentino o español hasta dentro de 2 retos."
    ],
    Ambos: [
        "Reto: escribe un cumplido exagerado de la otra persona.",
        "Reto: manda un emoji al WhatsApp que resuma lo que sientes cuando hablas conmigo.",
        "Reto: susurra una fantasía tuya en pocas palabras a la cuenta de 3.",
        "Reto: haz un dibujo rápido de lo primero que veas. Tienes 3 minutos."
    ],
    Alan: [
        "Reto: dibuja con los ojos cerrados algo que el otro elija.",
        "Reto: lee la mano de la otra persona como si fueras gitan@."
    ]
};

let orden = ["Dani", "Ambos", "Alan"];
let indiceOrden = 0;
let retosCompletados = 0;

// Calcular total de retos
const TOTAL_RETOS = Object.values(retos).reduce((total, categoria) => total + categoria.length, 0);

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    crearParticulas();
    actualizarContador();
    crearRuletaVisual();
});

// Crear partículas flotantes
function crearParticulas() {
    const container = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Tamaño aleatorio
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posición inicial aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Color aleatorio (naranja o morado)
        particle.style.backgroundColor = Math.random() > 0.5 ? '#ff7518' : '#6a0dad';
        
        // Animación con duración aleatoria
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        container.appendChild(particle);
    }
}

// Crear ruleta visual con las opciones
function crearRuletaVisual() {
    const ruleta = document.getElementById("ruleta");
    const opciones = ["Dani", "Ambos", "Alan"];
    
    ruleta.innerHTML = '';
    
    // Crear segmentos
    opciones.forEach((opcion, index) => {
        const segmento = document.createElement('div');
        segmento.className = 'segmento-ruleta';
        segmento.style.setProperty('--i', index);
        ruleta.appendChild(segmento);
    });
    
    // Agregar textos de los segmentos (fuera de los segmentos para que no giren)
    const contenedorRuleta = document.querySelector('.contenedor-ruleta');
    
    // Texto para Dani (segmento naranja)
    const textoDani = document.createElement('div');
    textoDani.className = 'texto-segmento';
    textoDani.textContent = 'DANI';
    textoDani.style.color = '#fff';
    contenedorRuleta.appendChild(textoDani);
    
    // Texto para Ambos (segmento morado)
    const textoAmbos = document.createElement('div');
    textoAmbos.className = 'texto-segmento';
    textoAmbos.textContent = 'AMBOS';
    textoAmbos.style.color = '#fff';
    contenedorRuleta.appendChild(textoAmbos);
    
    // Texto para Alan (segmento rojo)
    const textoAlan = document.createElement('div');
    textoAlan.className = 'texto-segmento';
    textoAlan.textContent = 'ALAN';
    textoAlan.style.color = '#fff';
    contenedorRuleta.appendChild(textoAlan);
    
    // Agregar punto central
    const puntoCentral = document.createElement('div');
    puntoCentral.className = 'punto-central';
    contenedorRuleta.appendChild(puntoCentral);
}

// Función para avanzar entre pantallas
function avanzarPantalla(num) {
    efectoRayo(() => {
        document.querySelector(`#pantalla${pantallaActual}`).classList.remove('activa');
        pantallaActual = num;
        document.querySelector(`#pantalla${pantallaActual}`).classList.add('activa');
        
        // Si llegamos a la pantalla de retos, reiniciamos el contador
        if (num === 5) {
            retosCompletados = 0;
            document.getElementById('btnTerminarRetos').disabled = true;
            document.getElementById('contadorRetos').style.display = 'block';
            actualizarContador();
        } else if (num !== 5) {
            document.getElementById('contadorRetos').style.display = 'none';
        }
    });
}

// Efecto de rayo al cambiar de pantalla
function efectoRayo(callback) {
    const flash = document.getElementById("flash");
    flash.style.opacity = "1";
    
    setTimeout(() => {
        flash.style.opacity = "0";
        if (callback) callback();
    }, 400);
}

// Validar formulario antes de avanzar
function validarFormulario() {
    const form = document.getElementById('formPreguntas');
    const textareas = form.querySelectorAll('textarea');
    let todasRespondidas = true;
    
    textareas.forEach(textarea => {
        if (!textarea.value.trim()) {
            todasRespondidas = false;
            textarea.style.border = "2px solid red";
            textarea.style.animation = "pulse 0.5s";
            
            setTimeout(() => {
                textarea.style.animation = "";
            }, 500);
        } else {
            textarea.style.border = "none";
        }
    });
    
    if (todasRespondidas) {
        // Guardar respuestas
        const respuestas = {};
        textareas.forEach(textarea => {
            respuestas[textarea.name] = textarea.value;
        });
        
        // 1. Mostrar en consola
        console.log("Respuestas del formulario:", respuestas);
        
        // 2. Guardar en localStorage como backup
        localStorage.setItem('respuestasDani', JSON.stringify(respuestas));
        
        // 3. Enviar por email automáticamente
        enviarRespuestasPorEmail(respuestas);
        
        avanzarPantalla(5);
    } else {
        alert("Por favor, responde todas las preguntas antes de continuar.");
    }
}

// Función para enviar por email a alansituk.1@gmail.com
function enviarRespuestasPorEmail(respuestas) {
    const preguntas = {
        'p1': '1. ¿Qué fue lo primero que pensaste cuando me viste por primera vez?',
        'p2': '2. ¿Qué parte de mí te hace sentir más feliz?',
        'p3': '3. Si tuvieras que describirme con una sola palabra, ¿cuál sería?',
        'p4': '4. ¿Qué aventura te gustaría que vivamos juntos?',
        'p5': '5. ¿Qué lugar sueñas con visitar conmigo algún día?',
        'p6': '6. ¿Qué detalle mío te hizo sonreír sin darte cuenta?',
        'p7': '7. ¿Qué promesa te gustaría que cumplamos juntos?'
    };
    
    let body = "🎃 RESPUESTAS DE DANI - JUEGO HALLOWEEN 🎃\n\n";
    body += "¡Hola Alan! Aquí están las respuestas de Dani:\n\n";
    body += "========================================\n\n";
    
    Object.keys(respuestas).forEach(key => {
        body += `${preguntas[key]}\n`;
        body += `💬 Respuesta: ${respuestas[key]}\n\n`;
        body += "----------------------------------------\n\n";
    });
    
    body += "✨ ¡Que tengas un día maravilloso! ✨\n";
    body += "Con cariño,\nEl sistema automático de Dani 🦇";
    
    const subject = "🎃 Respuestas de Dani - Juego Halloween";
    const email = "alansituk.1@gmail.com";
    
    // Crear el enlace mailto
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Abrir el cliente de email
    window.location.href = mailtoLink;
    
    // Mostrar mensaje confirmando el envío
    setTimeout(() => {
        alert("¡Respuestas guardadas! Se ha abierto tu cliente de email para enviar las respuestas. Solo tienes que hacer clic en 'Enviar'.");
    }, 1000);
}

// Girar la ruleta de retos
function girarRuleta() {
    const ruleta = document.getElementById("ruleta");
    const resultado = document.getElementById("resultadoReto");
    const btnTerminar = document.getElementById('btnTerminarRetos');
    const btnGirar = document.getElementById('btnGirarRuleta');
    
    // Deshabilitar el botón mientras gira
    btnGirar.disabled = true;
    
    // Ángulo aleatorio para que pare en diferentes segmentos
    const angulosSegmentos = [60, 180, 300]; // Centros de cada segmento
    const anguloExtra = angulosSegmentos[Math.floor(Math.random() * angulosSegmentos.length)];
    const giroTotal = 1800 + anguloExtra; // 5 vueltas completas + ángulo del segmento
    
    // Aplicar la animación de giro
    ruleta.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)';
    ruleta.style.transform = `rotate(${giroTotal}deg)`;
    
    setTimeout(() => {
        const persona = orden[indiceOrden % orden.length];
        let lista = retos[persona];
        let reto = lista[Math.floor(Math.random() * lista.length)];
        
        resultado.innerHTML = `<strong>💥 ${persona.toUpperCase()} 💥</strong><br>${reto}`;
        resultado.style.animation = "pulse 2s";
        
        indiceOrden++;
        retosCompletados++;
        
        // Actualizar contador
        actualizarContador();
        
        // Habilitar botón después de completar TODOS los retos
        if (retosCompletados >= TOTAL_RETOS) {
            btnTerminar.disabled = false;
            btnTerminar.style.animation = "pulse 2s infinite";
            resultado.innerHTML += `<br><br>🎉 <strong>¡Felicidades! Has completado todos los retos</strong> 🎉`;
        }
        
        // Rehabilitar botón de girar (a menos que sean todos los retos)
        if (retosCompletados < TOTAL_RETOS) {
            setTimeout(() => {
                btnGirar.disabled = false;
            }, 1000);
        } else {
            btnGirar.disabled = true;
            btnGirar.textContent = "🎉 Todos los retos completados";
            btnGirar.style.background = "#00ff00";
            btnGirar.style.color = "#000";
        }
        
        setTimeout(() => {
            resultado.style.animation = "";
        }, 2000);
    }, 3000);
}

// Actualizar contador de retos
function actualizarContador() {
    document.getElementById('contadorNumero').textContent = `${retosCompletados}/${TOTAL_RETOS}`;
}

// Reiniciar el juego
function reiniciarJuego() {
    // Reiniciar variables
    pantallaActual = 1;
    indiceOrden = 0;
    retosCompletados = 0;
    
    // Limpiar formulario
    const form = document.getElementById('formPreguntas');
    form.reset();
    
    // Reiniciar ruleta
    const ruleta = document.getElementById("ruleta");
    ruleta.style.transition = 'none';
    ruleta.style.transform = 'rotate(0deg)';
    
    // Reiniciar botones
    const btnGirar = document.getElementById('btnGirarRuleta');
    btnGirar.disabled = false;
    btnGirar.textContent = "🎡 GIRAR RULETA";
    btnGirar.style.background = "";
    btnGirar.style.color = "";
    
    document.getElementById('btnTerminarRetos').disabled = true;
    document.getElementById('btnTerminarRetos').style.animation = "none";
    
    // Reiniciar resultado
    document.getElementById('resultadoReto').textContent = "Gira la ruleta para obtener un reto";
    
    // Ocultar contador
    document.getElementById('contadorRetos').style.display = 'none';
    
    // Volver a la primera pantalla
    document.querySelectorAll('.pantalla').forEach(pantalla => {
        pantalla.classList.remove('activa');
    });
    document.getElementById('pantalla1').classList.add('activa');
    
    alert("¡El juego ha sido reiniciado! ¿Lista para otra ronda?");
}

// Función adicional: Ver respuestas guardadas (para ti)
function verRespuestasGuardadas() {
    const respuestasGuardadas = localStorage.getItem('respuestasDani');
    if (respuestasGuardadas) {
        console.log("Respuestas guardadas en localStorage:", JSON.parse(respuestasGuardadas));
        alert("Respuestas guardadas disponibles en la consola (F12)");
    } else {
        alert("No hay respuestas guardadas aún");
    }
}