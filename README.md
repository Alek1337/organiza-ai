# Objetivo do Projeto
Desenvolver uma plataforma de gerenciamento e controle de eventos que permita aos usuários criar, gerenciar e organizar eventos, além de convidar outros participantes. O OrganizaAi também inclui um chatbot assistente para facilitar o gerenciamento e responder a dúvidas sobre os eventos e auxiliar os usuários na preparação de eventos.

# Escopo:
1. Cadastro de Usuários:
   * Usuários podem criar contas e definir perfis de organizador ou participante.
2. Painel do Organizador:
   * Organizadores podem:
      * Criar, editar e excluir eventos.
      * Convidar participantes e gerenciar listas de convidados.
      * Monitorar confirmações de presença e interação dos participantes.
      * Enviar notificações e atualizações aos convidados.
3. Painel do Participante
   * Participantes podem:
      * Visualizar e confirmar presença nos eventos.
      * Receber atualizações e notificações dos organizadores.
      * Interagir com o chatbot para obter informações sobre os eventos.
4. Chatbot Assistente
   * Suporte automatizado para:
      * Responder dúvidas sobre o uso da plataforma.
      * Auxiliar no gerenciamento de eventos (ex.: lembretes, alterações).
      * Enviar atualizações e lembretes.
5. Segurança e Privacidade
   * Criptografia para proteção de dados pessoais e de eventos.
   * Controle de acesso seguro para proteger informações de eventos e convidados.
6. Testes e Validação
   * Realização de testes unitários e de integração para garantir funcionamento seguro e eficiente.

[Diagrama de Classe.]
<img src="/assets/img/classDiagram.png">
</br>
[Fluxo.]
<img src="/assets/img/fluxogram.png">

# Tecnologias Utilizadas
## Frontend
* React: Biblioteca JavaScript para construção de interfaces.
* Vite: Bundler de código de aplicações React.
* HTML e CSS: Para estrutura e design das páginas.
* Tailwind: Biblioteca para estilização, escrita de CSS.
* Shadcn: Biblioteca de componentes React.
* React-query: Biblioteca para facilitar o gerenciamento de requisições e dados requiridos pelo frontend.

## Backend
* Node.js: Framework para construção de aplicações JavaScript para o servidor.
* Nest.js: Ferramenta para desenvolvimento de aplicações Node.js
* Prisma: Biblioteca para facilitar a comunicação com o banco de dados (ORM)

## Banco de Dados
* Postgres: Banco de dados relacional.

## Teste e Qualidade
* Jest e React Testing Library: Frameworks de teste para frontend.

# Requisitos do Projeto
## Requisitos Funcionais
1. Cadastro e Gerenciamento de Usuários
   * RF1: Usuários podem criar, editar e excluir contas.
2. Painel do Organizador
   * RF2: Criar, editar, excluir e gerenciar eventos.
   * RF3: Enviar convites e gerenciar presença dos convidados.
   * RF4: Enviar atualizações e notificações aos convidados.
3. Painel do Participante
   * RF5: Visualizar e confirmar presença em eventos.
4. Chatbot Assistente
   * RF6: Suporte interativo para dúvidas, lembretes e gerenciamento.
## Requisitos Não Funcionais
1. Segurança e Privacidade
   * RNF1: Criptografia de dados para segurança de usuários e eventos.
2. Desempenho
   * RNF2: Respostas rápidas para múltiplos usuários simultâneos.
3. Usabilidade
   * RNF3: Interface intuitiva e fácil de usar.
4. Manutenibilidade
   * RNF4: Código documentado para futuras melhorias.
5. Testes e Validação
   * RNF5: Testes unitários e de integração para assegurar o funcionamento.

# Organização do Desenvolvimento
## Metodologia
A metodologia ágil SCRUM foi utilizada, com ciclos de entrega contínua e foco nas funcionalidades prioritárias.

## Pacotes de Entrega
### Configuração e Infraestrutura
  * Configuração do ambiente de desenvolvimento e organização do repositório.
  * Integração inicial entre frontend e backend.

### Funcionalidades do Organizador
  * Cadastro de eventos e gerenciamento de convidados.
  * Notificações e controle de presença.

### Funcionalidades do Participante
  * Visualização e confirmação de presença em eventos.

### Chatbot Assistente e Segurança
  * Implementação do chatbot para suporte aos usuários.
  * Segurança com autenticação e criptografia.
