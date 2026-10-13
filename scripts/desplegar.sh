#!/usr/bin/env bash
# Despliega fmargar.es desde el commit actual de este clon.
#
# Construye la imagen con límites de CPU, la prueba en un contenedor aparte (127.0.0.1:3099),
# guarda la que estaba en producción como `vuelta-atras`, pone la nueva como `latest`, levanta
# el proyecto compose `dev-hub-fernando` y comprueba fmargar.es desde fuera. Al final borra
# todas las imágenes del portfolio salvo la de producción y la de vuelta atrás: el SSD es pequeño.
#
# Uso:   scripts/desplegar.sh
# Volver atrás:   docker tag dev-hub-fernando-portfolio:vuelta-atras dev-hub-fernando-portfolio:latest
#                 docker compose -p dev-hub-fernando up -d --no-build
set -uo pipefail
cd "$(dirname "$0")/.."
IMG=dev-hub-fernando-portfolio
falla() { echo "ERROR: $*" >&2; docker rm -f portfolio-prueba >/dev/null 2>&1; exit 1; }

[ -z "$(git status --porcelain --untracked-files=no)" ] || falla "hay cambios sin commit"
C=$(git rev-parse --short HEAD)
echo "Construyendo $IMG:$C"
nice -n 10 taskset -c 0-3 docker build -q -t "$IMG:$C" . >/dev/null || falla "la construcción ha fallado"

echo "Probando en 127.0.0.1:3099"
docker rm -f portfolio-prueba >/dev/null 2>&1
docker run -d --name portfolio-prueba -p 127.0.0.1:3099:3000 "$IMG:$C" >/dev/null || falla "no arranca"
for _ in $(seq 60); do curl -s -o /dev/null http://127.0.0.1:3099/ && break; sleep 1; done
for u in / /en /work/adivinadle /cv/fernando-martinez-cv.pdf; do
  codigo=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:3099$u")
  [ "$codigo" = 200 ] || falla "$u responde $codigo en la prueba"
done
docker rm -f portfolio-prueba >/dev/null

anterior=$(docker image inspect -f '{{.Id}}' "$IMG:latest" 2>/dev/null)
nueva=$(docker image inspect -f '{{.Id}}' "$IMG:$C")
if [ -n "$anterior" ] && [ "$anterior" != "$nueva" ]; then docker tag "$IMG:latest" "$IMG:vuelta-atras"; fi
docker tag "$IMG:$C" "$IMG:latest"
docker compose -p dev-hub-fernando up -d --no-build || falla "compose no ha levantado (vuelta atrás: ver cabecera)"
for _ in $(seq 60); do curl -s -o /dev/null http://127.0.0.1:80/ && break; sleep 1; done
codigo=$(curl -s -o /dev/null -w '%{http_code}' https://fmargar.es/)
[ "$codigo" = 200 ] || falla "fmargar.es responde $codigo tras desplegar (vuelta atrás: ver cabecera)"

# Poda: fuera todo lo que no sea producción ni vuelta atrás
guardar="$nueva $(docker image inspect -f '{{.Id}}' "$IMG:vuelta-atras" 2>/dev/null)"
docker images "$IMG" --format '{{.Tag}} {{.ID}}' | while read -r tag id; do
  completo=$(docker image inspect -f '{{.Id}}' "$IMG:$tag")
  case " $guardar " in *" $completo "*) ;; *) docker rmi "$IMG:$tag" >/dev/null && echo "Borrada $IMG:$tag";; esac
done
echo "fmargar.es sirve $C"
