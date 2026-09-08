---
layout: post
title: EmulationStation fácil para Windows - novidades
use-site-title: true
image: /img/es-win.png
bigimg: /img/es-win.png
redirect_from: http://blog.paulorobertoelias.com.br/index.php/2018/09/09/emulationstation-facil-para-windows-novidades/
tags: [projetos, emuladores]
---

Já falei sobre meu projeto opensource no Github para configuração fácil do Emulation Station no Windows [aqui](https://prelias.github.io/paulorobertoelias.com.br/2018-07-04-emulationstation-configuracao-simples-para-windows/). E hoje venho apresentar algumas pequenas novidades que inseri no mesmo visando torná-lo ainda mais fácil.

Como sempre, você pode verificar detalhes no próprio arquivo README do projeto, navegando até o repositório e lá terá também acesso ao tutorial de como proceder para instalar.

Meu intuito neste post é comentar rapidamente sobre as adições que fiz.

1) Executar com o botão direito: Agora você pode utilizar um ‘hack’ para o registro do Windows para facilitar ainda mais a execução e claro, a execução de scripts de uma maneira geral. Como era necessário executar como administrador, a única maneira era abrindo o Powershell como tal e navegando até a pasta para executar. Com essa modificação do registro, isso não é mais necessário.
2) Sincronizar ROMs com o OneDrive: Muitas pessoas guardam suas coleções de ROMs em serviços em nuvem, como o OneDrive da Microsoft, nesse caso, se você executar este script opcional do projeto, as pastas serão redirecionadas para as pastas comuns do serviço.
3) Script de scraper: O projeto já continha um executável de um ótimo scraper (programa que busca metadados dos jogos), mas como ele necessita de parâmetros para recuperar dados como vídeos, eu criei um script onde estes parâmetros são inseridos de forma automatizada. Como a maioria deles exige um usuário válido no serviço de busca, será necessário você criar um para utilizá-lo bem.

Lembrando que se trata de um projeto público, que iniciei baseado em um repositório igualmente público disponível e toda a comunidade é bem vinda ao ajudar no projeto, seja dando ideias ou mesmo desenvolvendo suas próprias soluções.

Abraço a todos e até a próxima