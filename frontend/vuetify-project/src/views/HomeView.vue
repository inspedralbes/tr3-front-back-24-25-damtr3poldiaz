<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-700 to-amber-900 text-center">
    <div class="bg-white/20 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-md w-full border border-white/30 flex flex-col items-center">
      
      <h1 class="text-4xl font-bold text-white mb-2">Bienvenido al Juego</h1>
      <p class="text-white/80 mb-8">Sumérgete en una experiencia tranquila y relajante.</p>
      
      <div class="bg-white/10 p-6 rounded-lg shadow-md w-full space-y-4">
        <!-- Botón de Iniciar Sesión -->
        <router-link to="/login" class="block w-full">
          <button class="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-lg shadow-md hover:from-amber-600 hover:to-amber-800 transition duration-300 transform hover:scale-105 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Iniciar Sesión
          </button>
        </router-link>
        
        <!-- Botón de Registrarse -->
        <router-link to="/register" class="block w-full">
          <button class="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md hover:from-amber-700 hover:to-amber-900 transition duration-300 transform hover:scale-105 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Registrarse
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #8d6e63, #4e342e);
  color: white;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
}

p {
  font-weight: 300;
  line-height: 1.6;
}

button {
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.router-link-active button {
  transform: scale(1.05);
}
</style>