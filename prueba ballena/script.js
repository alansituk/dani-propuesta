// Variables globales
let pantallaActual = 1;
const retos = {
    ghina: [
        "Reto: te reto a hacer caras raras hasta que me hagas reír.",
        "Reto: te reto a grabarte un video ahora mismo y enviármelo al WhatsApp (no para ver una vez).",
        "Reto: habla con acento argentino o español hasta dentro de 2 retos."
    ],
    ambos: [
        "Reto: escribe un cumplido exagerado de la otra persona.",
        "Reto: manda un emoji al WhatsApp que resuma lo que sientes cuando hablas conmigo.",
        "Reto: susurra una fantasía tuya en pocas palabras a la cuenta de 3.",
        "Reto: haz un dibujo rápido de lo primero que veas. Tienes 3 minutos."
    ],
    alan: [
        "Reto: dibuja con los ojos cerrados algo que el otro elija.",
        "Reto: lee la mano de la otra persona como si fueras gitan@."
    ]
};

let orden = ["ghina", "ambos", "alan"];
let indiceOrden = 0;
let retosCompletados = 0;
const MIN_RETOS = 3; // Mínimo de retos a completar antes de poder continuar

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    crearParticulas();
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
    
    // Deshabilitar el botón mientras gira
    document.querySelector('button[onclick="girarRuleta()"]').disabled = true;
    
    // Animación de giro
    ruleta.style.transform = "rotate(1800deg)";
    
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
        
        // Habilitar botón después de completar mínimo de retos
        if (retosCompletados >= MIN_RETOS) {
            btnTerminar.disabled = false;
            btnTerminar.style.animation = "pulse 2s infinite";
        }
        
        // Rehabilitar botón de girar
        document.querySelector('button[onclick="girarRuleta()"]').disabled = false;
        
        setTimeout(() => {
            resultado.style.animation = "";
        }, 2000);
    }, 2000);
}

// Actualizar contador de retos
function actualizarContador() {
    document.getElementById('contadorNumero').textContent = retosCompletados;
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
    ruleta.style.transform = "rotate(0deg)";
    
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