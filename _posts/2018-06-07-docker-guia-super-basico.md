---
layout: post
title: Docker - guia super básico
use-site-title: true
image: /img/Docker.png
bigimg: /img/Docker.png
share-img: /img/Docker.png
redirect_from: http://blog.paulorobertoelias.com.br/index.php/2019/01/28/business-analysis-content-repository/
tags: [dicas, docker]
---

Docker é uma ferramenta que possibilita que você utilize máquinas virtuais não completas para executar, por exemplo, o código de seu projeto, ou seu servidor de banco de dados.

Materiais não faltam para você estudar ou aprender como ele funciona e validar se ele te ajuda a solucionar os seus problemas. Como sempre, meu intuito é encontrar uma forma realmente simples de explicar o conceito e indicar os primeiros passos, servindo até mesmo como um backup para mim mesmo, já que também não sou nenhum especialista na tecnologia.

Sendo assim, minha ideia é realmente escrever um ponto de partida. Mas é legal citar que seu uso está aumentando muito e ele resolve o problema de diferenças entre o ambiente de desenvolvimento e de produção por exemplo. Torna também a implantação em novas máquinas extremante simples, já que é possível compartilhar o script e até mesmo as imagens customizadas.

Mas vamos lá. O importante agora é você se familiarizar com os termos básicos:

**image**: é a “ISO” do sistema operacional que será utilizada pela VM. Ela pode ser usada em diversos containers ao mesmo tempo. Há muitas delas prontas na internet pra baixar.

**container**: é a image instanciada, em execução. Como dito, você pode instanciar diversas delas baseadas na mesma imagem (há inclusive orquestradores de containers, que reiniciam automaticamente em falhas, entre outras coisas, como por exemplo o Kubernetes ou o Swarm (que vem integrado), mas não é o escopo deste post).

> Ao fazer alterações em um container, elas se perdem assim que ele é destruído, a não ser que você o salve como uma nova imagem. Vide abaixo.

Pois bem, para instalar, basta ir até o site e procurar pela versão Community Edition

[Download Docker CE](https://www.docker.com/community-edition)

Baixe e instale na sua máquina. É a única instalação real necessária. Recomendo também que já crie uma conta pelo site, já que ela é necessária para a utilização.

Depois de instalar, talvez sua máquina exija umas configurações para que ele funcione, mas ele mesmo vai te sugerir isso e reiniciar sozinho (eu uso Windows 10). Tudo pronto, basta você abrir um console (cmd, powershell, etc) e digitar o comando abaixo:

```
docker login
```

Insira o nome de usuário do docker (não serve o email) e a senha que você criou.

Para criar seu primeiro container e automaticamente já baixar a imagem, basta executar o comando abaixo:

```
docker run -it ubuntu /bin/bash
```

O bash é o comando para acessar o console do Ubuntu. Você deve estar agora em uma janela do console com um usuário root conectado e pode começar testar comandos no console pra ir se familiarizando, como ls para ver as pastas ou mesmo fazer umas instalações no container, com o comando apt-get. Mas lembre-se do que eu disse sobre salvar…

Sugiro você abrir outro console na mesma pasta e executar esse comando para verificar os containers que estão em execução:

```
docker container ls
```

Pode também, conferir que foi baixada a imagem:

```
docker image ls
```

Mas a real forma interessante de se criar os containers é usando scripts, e você pode fazer isso criando um arquivo Dockerfile, sem extensão e mandando executar:

```
# Setando a imagem a ser usada do Docker hub
FROM ubuntu:latest
LABEL Paulo Roberto Elias "ppuspfc@gmail.com"
```

Use o texto acima como o exemplo mais simples possível do que colocar no arquivo. Ele usa a última versão do Ubuntu disponível no DockerHub e coloca o meu nome no label (mude para o seu claro). Você pode até mesmo colocar a instrução abaixo nele para já ver um pouco da mágica acontecendo e ir tirando suas conclusões…

```
RUN apt-get update
```

Na internet você vai encontrar diversos desses scripts prontos com várias dependências já configuradas para alguns ambientes de desenvolvimento.

Navegue no console até a pasta onde você salvou o seu Dockerfile e execute o comando abaixo:

```
docker build -t minhaimagem .
```

Será criada uma nova imagem baseada no seu script, no caso utilizando a imagem original do Ubuntu. Veja que eu dei um nome a ela e o ponto após o nome é pra indicar que é para executar do diretório em que estamos. Confira novamente usando o comando para listar as imagens.

Depois executaremos a imagem, ou seja, criaremos um container com o comando abaixo:

```
docker run -it minhaimagem /bin/bash
```

As alterações que você fizer só ficarão salvas se você salvar o container, criando assim, uma nova imagem (pode-se sobrepor usando o mesmo nome, cuidado com a TAG, ela diferenciará também o arquivo).

```
$ docker commit <container_id> new_image_name:tag_name(optional)
```

Não se esqueça de executar o comando para listar os containers enquanto ele ainda estiver em execução, pegar o ID e usar no comando acima.

Eu ainda não aprendi desconectar do bash para executar comandos docker no mesmo console 🙂 mesmo tendo lido que dá pra usar uns atalhos de teclado. Não sei o que houve…acho que eu estava no console do VSCode, preciso pesquisar melhor. É, talvez tenha sido isso, mas é uma boa deixa para eu voltar aqui e tentar transformar isso em uma série, com meus próximos passos no Docker.

Um abraço e até a próxima