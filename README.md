# API REST con pipeline CI/CD (Docker + GitHub Actions + AWS EC2)

Repositorio: https://github.com/Armando-10/proyecto-integrador-cicd  <!-- MODIFICAR: tu usuario -->
Imagen: https://hub.docker.com/r/armandojr17/api-cicd  <!-- MODIFICAR -->

Proyecto integrador de Gestión del Proceso de Desarrollo de Software.

## Arquitectura

```
git push (main) -> GitHub Actions
   1. test        : npm ci + Jest/Supertest (cobertura minima 70%)
   2. build-push  : docker build -> Docker Hub (:latest y :<sha>)
   3. deploy      : SSH a EC2 -> docker pull -> valida -> reemplaza contenedor (puerto 80)
```

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /api/health | Estado del servicio |
| GET | /api/users | Lista usuarios |
| POST | /api/users | Crea usuario (`name`, `email`) |
| GET | /api/users/:id | Obtiene un usuario |
| PUT | /api/users/:id | Actualiza un usuario |
| DELETE | /api/users/:id | Elimina un usuario |

## Comandos locales

```bash
npm install
npm test                      # pruebas + reporte de cobertura (falla si < 70%)
npm start                     # http://localhost:3000/api/health
docker build -t api-cicd .
docker run -p 3000:3000 api-cicd
```

## Configuracion

### GitHub Secrets (Settings > Secrets and variables > Actions)

| Secret | Contenido |
|--------|-----------|
| DOCKERHUB_USERNAME | Usuario de Docker Hub |
| DOCKERHUB_TOKEN | Personal Access Token de Docker Hub |
| EC2_HOST | IP publica o DNS de la instancia |
| EC2_USER | `ubuntu` |
| EC2_SSH_KEY | Contenido completo del archivo .pem |

### Servidor EC2

1. Instancia Ubuntu con Docker instalado (`sudo apt install -y docker.io curl`, `sudo usermod -aG docker ubuntu`).
2. Security Group: entrada TCP 22 (SSH) y TCP 80 (HTTP).
3. Verificar: `http://<IP_EC2>/api/health`.

> Ninguna credencial, IP o llave se guarda en el repositorio.
