# Fase 2 editorial: pendências conhecidas

O fechamento funcional foi validado manualmente no ambiente local: login administrativo, criação e edição, publicação, arquivamento e republicação, páginas públicas, Gerenciar Posts e formatação editorial. Imagens por URL funcionaram.

- **Cloudinary local:** upload retornou `Must supply api_key`. A configuração local dessa integração permanece pendente; o funcionamento em produção não foi confirmado nesta revisão. Imagens por URL continuam disponíveis.
- **TypeScript preexistente:** duas ocorrências de TS2345 em `src/components/NewPostModal.tsx`, nas chamadas de criação e atualização. O formulário envia `tags` como string, enquanto `EditorialInput` espera `Tag[]`. Não corrigido no fechamento da Fase 2.
- **Lint preexistente:** quatro erros em `src/components/ui/command.tsx`, `src/components/ui/textarea.tsx`, `src/pages/patients/PatientLayout.tsx` e `src/pages/patients/sections/PatientAnthropometry.tsx`; seis avisos de `react-refresh/only-export-components` em componentes UI. O lint dos arquivos editoriais alterados passou.

Na revisão de fechamento, os 36 testes do frontend e o build de produção passaram. O build avisou sobre um bundle acima de 500 kB. Pipelines que exijam TypeScript ou lint completos permanecem bloqueados pelas pendências acima. Revalidar antes de publicar.

Esta documentação não autoriza migrations, alterações em bancos ou publicação. Nenhuma credencial ou arquivo de ambiente real deve entrar no commit.
