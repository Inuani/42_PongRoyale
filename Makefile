all:
	docker-compose up --build
re:
	docker-compose up --build --force-recreate

down:
	docker-compose down

.PHONY: front back new upbuild down
