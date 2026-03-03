# Prompts de configuração do banco de dados

> Pedi para o agente resumir os prompts, visto que estavam muito longos e repetitivos na resolução de erros que ocorreram durante a configuração do banco de dados.

## 1. Setup do MongoDB e Driver
**Prompt:** Dúvida sobre a necessidade de instalar o pacote nativo `mongodb` conforme sugerido pelo Atlas.
**Resumo:** * Concluímos que a instalação do pacote `mongodb` via Bun era desnecessária, pois o Prisma ORM já possui seu próprio motor otimizado de conexão, evitando pacotes redundantes.

## 2. Resolução de Erros: Prisma v7 (Nova Arquitetura)
Durante a configuração, enfrentamos erros de validação e tipagem devido às recentes atualizações arquiteturais do Prisma (v7+). A IA foi utilizada para debugar a sequência de erros iterativamente:

* **Erro 1: Prisma schema validation (P1012)**
  * *Problema:* O Prisma acusou que a propriedade `url` não era mais suportada dentro do `schema.prisma`.
  * *Solução:* Removemos a URL do `schema.prisma` e deixamos o arquivo `prisma.config.ts` (gerado automaticamente via `defineConfig`) gerenciar a string de conexão pelo `.env`.

* **Erro 2: Has no exported member (Importação falha)**
  * *Problema:* Ao definir um `output` customizado (`./generated/prisma`) no schema, a importação padrão `@prisma/client` parou de funcionar.
  * *Solução:* Ajustamos o provider para `prisma-client-js` e corrigimos o caminho de importação no arquivo de configuração do Next.js para buscar o client diretamente da pasta gerada (`../prisma/generated/prisma`).

* **Erro 3: Erros de Tipagem ts(2353) no PrismaClient**
  * *Problema:* O TypeScript rejeitou as propriedades `datasourceUrl` e `datasources` ao tentar instanciar o `new PrismaClient()` no arquivo `utils/prisma.ts`.
  * *Solução:* Entendemos que a nova arquitetura centralizada do Prisma v7 (`prisma.config.ts`) já embute a string de conexão diretamente no cliente gerado. A solução final e mais limpa foi inicializar o cliente com um construtor totalmente vazio: `new PrismaClient()`.
