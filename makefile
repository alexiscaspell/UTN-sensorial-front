VERSION ?= latest
DOCKER_USER ?= utnsensorial

.SILENT:


docker-build b:
	docker build . -t ${DOCKER_USER}/sensorial-front:${VERSION} --build-arg ARG_VERSION=${VERSION} --no-cache


docker-run r:
	docker run -it --rm -p 80:80 --name sensorial-front \
		-e BASE_URL=https://sensorial-base.herokuapp.com \
		-e BACKEND_URL=https://sensorial-back.herokuapp.com \
		${DOCKER_USER}/sensorial-front:${VERSION}
		

server-docker-push p:
	docker push ${DOCKER_USER}/sensorial-front:${VERSION}


server-docker-build bs:
	docker build ./server -t ${DOCKER_USER}/sensorial-base:${VERSION}


server-docker-run rs:
	docker run -it -p 8080:8080 --rm --name sensorial-base ${DOCKER_USER}/sensorial-base:${VERSION}


server-docker-push ps:
	docker push ${DOCKER_USER}/sensorial-base:${VERSION}