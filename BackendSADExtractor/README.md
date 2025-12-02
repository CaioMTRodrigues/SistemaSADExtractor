comando p gerar banco no docker
```bash
docker run --name postgres -e POSTGRES_USER=backend -e POSTGRES_PASSWORD=backend123 -e POSTGRES_DB=backend -p 5432:5432 -d postgres
```

rodar comando abaixo na pasta do back p gerar primeiro usuario admin:
```bash
npx tsx src/lib/seed.ts
```
login e senha do admin estão no arquivo
