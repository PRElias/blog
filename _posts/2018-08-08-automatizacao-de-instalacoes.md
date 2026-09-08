---
layout: post
title: Automatização de Instalações
use-site-title: true
image: /img/chocolatey.png
bigimg: /img/chocolatey.png
redirect_from: http://blog.paulorobertoelias.com.br/index.php/2018/08/08/automatizacao-de-intalacoes/
tags: [dicas]
---

Com o Windows migrando para um formato loja para seus apps, talvez não seja interessante mais para todo tipo de usuário e softwares, a dica que darei hoje. Contudo, muitos aplicativos ainda não são distribuídos por ela, ou talvez jamais cheguem a ser.

E um software que ajuda muito nessa tarefa é o [Chocolatey](https://chocolatey.org/). Trata-se de uma aplicação, conectada a um repositório, onde os usuários criam scripts relacionados aos diretórios de download de diversas ferramentas. Os próprios usuários mantém esses scripts, mas eles passam por uma moderação para tentar evitar arquivos e códigos maliciosos, sendo assim, é possível dizer que instalar aplicações por ele é tão seguro quanto pelo download comum.

Isto posto, desenvolvi um script [Powershell](https://docs.microsoft.com/pt-br/powershell/scripting/getting-started/getting-started-with-windows-powershell?view=powershell-6), que baixa o próprio Chocolatey e o utiliza para instalar silenciosamente, todas as aplicações que uso regularmente:

{% gist 499c0a30bd42acb10269f403d78188ab %}

O script acima utiliza o comando upgrade do choco, pois ele instala quando não encontra, ou faz a atualização caso o mesmo já se encontre instalado, ou seja, você pode usar o mesmo script para atualizações futuras.

Se você desejar, pode verificar os softwares disponíveis como pacotes choco, em seu diretório, clicando aqui e customizar meu script como lhe convenha. Neste link você pode também, verificar os detalhes de cada script de instalação, caso queira saber exatamente de onde são baixados os arquivos e todos os comandos.

Basta fazer o download do arquivo (clicando no nome do arquivo na parte de baixo da janela dele no post), ou copiar o seu conteúdo e salvar com a extensão ps1, usada pelo Powershell (você pode clicar no botão “view raw” para ver somente seu conteúdo na tela).

Outra dica relacionada à essa, é o uso de um arquivo para modificação do registro. Com ele, fica disponível no menu de contexto do Windows (botão direito do mouse), a opção para executar um script Powershell diretamente como administrador.

{% gist 06fabacc05be80a73e799b21581617cc %}

Basta executar o arquivo (da mesma forma que sugerido para o primeiro arquivo do post) e aceitar a modificação do registro.

Abs.