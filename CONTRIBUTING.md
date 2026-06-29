# Convenções do projeto Math Hub

## Commits

Seguimos o padrão **Conventional Commits**: `tipo: descrição curta no imperativo`.

| Tipo       | Quando usar                                              |
|------------|-----------------------------------------------------------|
| `feat`     | Nova funcionalidade pro usuário                           |
| `fix`      | Correção de bug                                            |
| `docs`     | Mudança só em documentação (README, comentários, etc.)    |
| `style`    | Formatação, espaçamento — sem mudar comportamento          |
| `refactor` | Reorganiza código sem mudar comportamento externo          |
| `test`     | Adiciona ou ajusta testes                                  |
| `chore`    | Tarefas de manutenção (deps, config, build)                |

**Exemplos baseados no que já fizemos:**
```
feat: adiciona calculadora LISP com suporte a números complexos
fix: corrige detecção de variável quando 'j' aparece sozinho
fix: corrige capitalização de Modal.jsx
feat: adiciona modal de ajuda na calculadora
chore: adiciona favicon e web manifest
```

**Regras rápidas:**
- Tipo em minúsculo, dois pontos, espaço, descrição.
- Descrição no imperativo ("adiciona", "corrige" — não "adicionado" ou "adicionando").
- Um commit = uma mudança lógica. Se a mensagem precisa de "e" pra descrever, considere dois commits.

## Branches

```
main                          → produção (o que está no ar)
development                   → integração, testada antes de ir pra main
feature/<nome-da-feature>     → uma ferramenta ou funcionalidade nova
fix/<nome-do-bug>             → correção pontual
chore/<nome>                  → manutenção (config, deps, docs)
```

Exemplo prático pra próxima ferramenta do Hub:
```
feature/conversor-bases
```
*(em vez do padrão `development-lisp-calculator` que usamos dessa vez — mais curto e já indica o tipo no prefixo)*

**Fluxo:**
```
feature/x → development → main
```
1. Cria a branch a partir de `development`.
2. Trabalha, comita em pedaços pequenos.
3. Push, abre PR (ou merge direto) pra `development`.
4. Testa lá (preview deploy da Vercel é seu amigo aqui).
5. Só depois, `development → main`.
6. Apaga a branch de feature depois do merge (`git branch -d feature/x`).

## Antes de cada push

- [ ] `npm run build` local passou sem erro?
- [ ] Testou no navegador (não só "parece certo no código")?
- [ ] Arquivos novos foram de fato adicionados (`git status` limpo)?
- [ ] Nomes de arquivo em PascalCase para componentes (`Modal.jsx`, não `modal.jsx`) — evita o bug de capitalização que já pegamos uma vez.
