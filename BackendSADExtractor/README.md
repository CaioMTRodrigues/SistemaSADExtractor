comando p gerar banco no docker
```bash
docker run --name postgres -e POSTGRES_USER=backend -e POSTGRES_PASSWORD=backend123 -e POSTGRES_DB=backend -p 5432:5432 -d postgres
```