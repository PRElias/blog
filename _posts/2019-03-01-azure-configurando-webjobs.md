---
layout: post
title: Azure - Configurando Webjobs
use-site-title: true
image: /img/azure-webjob.jpeg
bigimg: /img/azure-webjob.jpeg
share-img: /img/azure-webjob.jpeg
tags: [azure, dicas]
published: true
---

Praticamente todo sistema possui a necessidade de criação de JOBs, ou tarefas repetitivas, como envio de e-mails, geração de cálculos, entre outros. Sejam eles intermitentes ou contínuos. São processos que normalmente são iniciados de forma automática ou mesmo executados o tempo todo.

Se a aplicação estiver hospedada no Azure, a funcionalidade utilizada para configurar esses trabalhos, é chamada WebJobs. Onde você pode estipular scripts como batchs (.bat), executáveis, PHP entre outros. Esses scripts podem, por exemplo, executar um comando de console.

Como abaixo:

```
php %HOME%\site\wwwroot\artisan queue:listen
```

No script acima está sendo executado um comando específico do artisan, para uma aplicação em PHP, mas quaisquer comandos de terminal das tecnologias suportadas pelo Azure podem ser executadas.

Para criar o seu, desenvolva previamente o seu script e então navegue até Serviços de Aplicativos > SeuApp > Trabalhos Web e clique em adicionar.

Feito isso, basta você fazer o upload do arquivo e pronto (atenção, não é possível recuperar o arquivo depois de realizado o upload, na versão atual do Azure). O próprio Azure criará uma URLs personalizada (WebHook) e um usuário e senha para proteger a execução e que você poderá obter acessando as propriedades do WebJob.

Abraços!