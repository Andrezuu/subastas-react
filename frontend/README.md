# 🏛️ Plataforma de Subastas en Línea

Una plataforma moderna de subastas en tiempo real desarrollada con **React**, **TypeScript**, **Socket.IO** y **Material-UI**.

## 📋 Descripción

Sistema completo de subastas que permite a los usuarios participar en pujas por distintos artículos dentro de un tiempo límite. La aplicación incluye funcionalidades de administración, historial de ofertas, resultados estadísticos y actualizaciones en tiempo real.

## ✨ Características Principales

### 🔥 Funcionalidades Core
- **Subastas en Tiempo Real** - WebSocket para actualizaciones instantáneas
- **Sistema de Autenticación** - Login/Register con roles (Admin/Usuario)
- **Gestión de Ofertas** - Validación y procesamiento de pujas
- **Panel de Administración** - CRUD completo de subastas y usuarios
- **Historial Personal** - Seguimiento de ofertas y estadísticas
- **Resultados Globales** - Estadísticas y rankings de subastas

### 🎨 Experiencia de Usuario
- **Interfaz Responsive** - Material-UI con diseño adaptativo
- **Internacionalización** - Español e Inglés (i18n)
- **Estados Visuales** - Indicadores de estado de subastas
- **Cronómetros en Vivo** - Tiempo restante en tiempo real
- **Notificaciones** - Feedback instantáneo de acciones

### 🏗️ Arquitectura Técnica
- **Compound Components** - Patrón para componentes reutilizables
- **Render Props** - Flexibilidad en renderizado condicional
- **Custom Hooks** - Lógica reutilizable y separación de responsabilidades
- **Estado Global** - Zustand para manejo eficiente del estado
- **Validación** - Formik + Yup para formularios robustos

## 🚀 Tecnologías

### Frontend
- **React 19** + **TypeScript**
- **Material-UI** - Componentes y theming
- **Zustand** - Estado global
- **Socket.IO Client** - Comunicación en tiempo real
- **React Router** - Navegación SPA
- **Formik + Yup** - Formularios y validación
- **react-i18next** - Internacionalización
- **Vite** - Build tool y desarrollo

### Backend
- **Socket.IO Server** - WebSocket server
- **JSON Server** - API REST mock
- **Node.js + TypeScript** - Runtime y tipado

### Herramientas
- **ESLint** - Linting de código
- **Axios** - Cliente HTTP
- **Error Boundary** - Manejo de errores

## 📁 Estructura del Proyecto

```
proyecto-final/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── AuctionCard.tsx            # Compound Component
│   │   │   ├── AuctionStateRenderer.tsx   # Render Props
│   │   │   ├── BidForm.tsx                # Formulario de ofertas
│   │   │   ├── Timer.tsx                  # Cronómetro
│   │   │   └── ...
│   │   ├── pages/              # Páginas principales
│   │   │   ├── Home.tsx                   # Listado de subastas
│   │   │   ├── auction/
│   │   │   │   ├── AuctionInfo.tsx        # Detalle de subasta
│   │   │   │   └── AuctionResults.tsx     # Resultados globales
│   │   │   ├── admin/
│   │   │   │   └── AdminPanel.tsx         # Panel administrativo
│   │   │   ├── user/
│   │   │   │   └── BidHistory.tsx         # Historial personal
│   │   │   └── auth/
│   │   │       ├── Login.tsx
│   │   │       └── Register.tsx
│   │   ├── hooks/              # Custom Hooks
│   │   │   ├── useAuth.ts                 # Autenticación
│   │   │   ├── useAuction.ts              # Gestión de subastas
│   │   │   ├── useBidForm.ts              # Formulario de ofertas
│   │   │   ├── useBidHistory.ts           # Historial de usuario
│   │   │   └── useWebSocket.ts            # Socket.IO
│   │   ├── store/              # Estado Global (Zustand)
│   │   │   ├── useAuctionStore.ts         # Subastas
│   │   │   ├── useBidStore.ts             # Ofertas
│   │   │   └── useUserStore.ts            # Usuarios
│   │   ├── contexts/           # React Context
│   │   │   ├── AuthContext.tsx            # Autenticación
│   │   │   └── SnackbarContext.tsx        # Notificaciones
│   │   ├── services/           # API Services
│   │   │   ├── auctionService.ts          # CRUD subastas
│   │   │   ├── bidService.ts              # CRUD ofertas
│   │   │   └── userService.ts             # CRUD usuarios
│   │   ├── interfaces/         # Tipos TypeScript
│   │   ├── i18n/              # Internacionalización
│   │   │   ├── en.ts
│   │   │   └── es.ts
│   │   ├── constants/         # Constantes
│   │   ├── guards/            # Protección de rutas
│   │   ├── layout/            # Layout components
│   │   └── db.json            # Base de datos mock
├── websocket/                  # Servidor WebSocket
│   ├── server.ts              # Socket.IO server principal
│   └── constants/
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- **Node.js** (v18 o superior)
- **npm** o **yarn**

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd proyecto-final
```

### 2. Instalar dependencias

**Frontend:**
```bash
cd frontend
npm install
```

**WebSocket Server:**
```bash
cd websocket
npm install
```

### 3. Ejecutar la aplicación

Necesitas **3 terminales** diferentes:

**Terminal 1 - JSON Server (Puerto 3000):**
```bash
cd frontend
npm run server
```

**Terminal 2 - WebSocket Server (Puerto 3001):**
```bash
cd websocket
npm run dev
```

**Terminal 3 - Frontend React (Puerto 5173):**
```bash
cd frontend
npm run dev
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **API REST**: http://localhost:3000
- **WebSocket**: http://localhost:3001

## 👥 Usuarios de Prueba

```javascript
// Administrador
Username: admin
Role: admin

// Usuario regular  
Username: user
Role: user
```

## 🎯 Funcionalidades Detalladas

### 🏠 Home - Listado de Subastas
- Visualización de todas las subastas disponibles
- Estados visuales: **Próxima**, **Activa**, **Finalizada**
- Cronómetros en tiempo real para subastas activas
- Información de precios base y ofertas actuales

### 🎪 Detalle de Subasta
- Información completa del producto
- Cronómetro dinámico según estado
- Formulario de ofertas (solo en subastas activas)
- Validación de monto mínimo
- Información del ganador (subastas finalizadas)

### 📊 Panel de Administración
- **Gestión de Subastas**: CRUD completo con validaciones
- **Gestión de Usuarios**: Creación, edición y eliminación
- **Estadísticas**: Métricas globales del sistema
- **Interfaz tabular**: DataGrid con paginación y filtros

### 📈 Historial Personal
- **Estadísticas personales**: Total gastado, ofertas promedio, subastas ganadas
- **Lista completa** de ofertas realizadas
- **Información contextual** de cada subasta

### 🏆 Resultados Globales
- **Estadísticas del sistema**: Ingresos totales, participantes, subastas completadas
- **Ranking de usuarios**: Top oferentes por monto total
- **Historial de subastas**: Todas las subastas con ganadores

## 🔧 Patrones de Diseño Implementados

### 1. **Compound Components**
```tsx
<AuctionCard auctionId={auction.id}>
  <AuctionCard.ImageContainer>
    <AuctionCard.Image src={auction.img} />
    <AuctionCard.Timer {...timer} />
  </AuctionCard.ImageContainer>
  <AuctionCard.Title>{auction.name}</AuctionCard.Title>
  <AuctionCard.Footer>...</AuctionCard.Footer>
</AuctionCard>
```

### 2. **Render Props**
```tsx
<AuctionStateRenderer auction={auction} timer={timer}>
  {(auction, state, timeInfo) => (
    <div>
      {timeInfo.isActive && <ActiveView />}
      {timeInfo.isEnded && <EndedView />}
      {timeInfo.isUpcoming && <UpcomingView />}
    </div>
  )}
</AuctionStateRenderer>
```

### 3. **Custom Hooks**
```tsx
const { formik, bidError, minimumBid } = useBidForm();
const { userBids, statistics, loading } = useBidHistory();
const { timers, placeBid } = useAppWebSocket();
```

## 🌐 Arquitectura en Tiempo Real

### WebSocket Server (`websocket/server.ts`)
```typescript
// Eventos principales
io.on("connection", (socket) => {
  // 1. Envío de estado inicial
  socket.emit("INITIAL_DATA", { timers });
  
  // 2. Manejo de ofertas
  socket.on("PLACE_BID", (bidData) => {
    // Validación + Broadcast
  });
  
  // 3. Actualizaciones de cronómetro
  setInterval(() => {
    io.emit("UPDATE_DATA", { timers });
  }, 1000);
});
```

### Estados de Subasta
- **FUTURE** (Próxima): Aún no ha comenzado
- **PRESENT** (Activa): En progreso, acepta ofertas  
- **PAST** (Finalizada): Terminada, muestra ganador

## 📱 Internacionalización

Soporte completo para **Español** e **Inglés**:

```typescript
// Uso en componentes
const { t } = useTranslation();

// Ejemplos
{t("auction.active")}     // "Activa" / "Active"
{t("bid.placeBid")}      // "Realizar Oferta" / "Place Bid"
{t("home.basePrice")}    // "Precio Base" / "Base Price"
```

## 🛡️ Validaciones y Seguridad

### Frontend (Formik + Yup)
```typescript
const bidSchema = Yup.object({
  amount: Yup.number()
    .required(t("bid.amountRequired"))
    .min(minimumBid, `${t("bid.minimumBid")} $${minimumBid}`)
    .positive(t("bid.positiveAmount")),
});
```

### Backend (WebSocket Server)
```typescript
const validateBid = (bid: IBid) => {
  // 1. Verificar que la subasta existe
  // 2. Verificar que está activa (PRESENT)
  // 3. Verificar monto mínimo
  // 4. Retornar validación
};
```

## 📊 Performance y Optimización

- **Zustand**: Estado global eficiente sin re-renders innecesarios
- **useMemo**: Cálculos costosos en validaciones
- **React.memo**: Componentes optimizados
- **Lazy Loading**: Carga condicional de componentes
- **WebSocket**: Solo procesa si hay clientes conectados

## 🚀 Scripts Disponibles

### Frontend
```bash
npm run dev        # Desarrollo con Vite
npm run build      # Build de producción
npm run server     # JSON Server (API mock)
npm run lint       # ESLint
```

### WebSocket
```bash
npm run dev        # Servidor con nodemon
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu.email@ejemplo.com

---

⭐ **¡Dale una estrella al proyecto si te ha sido útil!**
