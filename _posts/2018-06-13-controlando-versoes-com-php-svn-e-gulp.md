---
layout: post
title: Controlando versões com PHP, SVN e Gulp
use-site-title: true
image: /img/gulp_php.png
bigimg: /img/gulp_php.png
share-img: /img/gulp_php.png
redirect_from: http://blog.paulorobertoelias.com.br/index.php/2018/06/13/controlando-versoes-com-php-svn-e-gulp/
tags: [dicas, php, svn, gulp]
---

Com o crescente uso do Git para controle de repositórios, talvez essa dica não seja mais tão útil, contudo, como aqui na empresa que trabalho ainda usamos Tortoise SVN, pode haver outras empresas e pessoas mundo afora, interessadas no post de hoje.

Ela também funciona muito melhor em projetos .Net, devido ao fato dele ser compilado, mas as informações aqui providas podem ser facilmente adaptadas pra ele (vou fazer uma nota também demonstrando uma diferença básica) quando for o momento).

Pois bem, o foco do post está em demonstrar o uso de um executável do SVN, de nome **SubWCRev.exe**, que serve para ler informações do repositório, como número da última revisão ou data e realizar a troca de variáveis em um arquivo template, pelos valores retornados.

Contudo, devido ao PHP não ser uma linguagem compilada, você precisará estar utilizando gerenciadores de pacotes, no caso o [Gulp](https://gulpjs.com/), se quiser implantar esse “controle de versão” aos seus projetos. Embora também seja possível executar o comando diretamente no console do sistema operacional, porém, grande parte da automatização se perderia.

Comece pela criação de um arquivo template, onde você incluirá as variáveis que deseja trabalhar (é possível encontrar a lista completa delas na [documentação do SVN](https://tortoisesvn.net/docs/release/TortoiseSVN_pt/tsvn-subwcrev.html)). No meu exemplo, eu chamei o arquivo de version-template.php e ele possui o seguinte conteúdo:

```
<?php return array( 'version' => '1.0.0.$WCREV$ data: $WCDATE$'>);
```

Feito isso, poderemos criar a nossa task que realizará a chamada do executável:

```
gulp.task('version-number', function (cb) {
exec('"C:/Program Files/TortoiseSVN/bin/SubWCRev.exe" "." "C:/Source/Projeto/branches/branch1/version-
template.php" "C:/Source/Projeto/branches/branch1/version.php"', function (err, stdout, stderr) {
console.log(stdout);
console.log(stderr);
cb(err);
});
})
```

Vamos a uma breve explicação do script acima. A task recebeu o nome de version-number para ser referenciada mais abaixo no arquivo gulp (junto à sequência de build). Ela utiliza o exec para chamar o comando, que é composto da seguinte forma:

```
[diretório do exe][diretório da solution][arquivo template][arquivo final]
```

Apresenta também instruções para logar as informações na janela do console e os erros, caso ocorram.

Você precisará adaptar o comando para os seus diretórios e tomar um cuidado especial caso sua build seja remota, em um servidor Jenkins por exemplo, mas basicamente, ao incluir essa task em seu build e executá-la, você terá gerado um arquivo com o conteúdo parecido com o exemplo abaixo:

```
'version' => '1.0.0.93528 data: 2018/06/07 09:36:50'
```

Esse arquivo, que no meu exemplo levou o nome de version.php, é recomendável que esteja na lista de ignore do SVN, evitando que o mesmo seja comitado toda hora.

Caso você esteja em um projeto .Net, você poderá executar um comando semelhante como um evento de pré-build, usando em conjunto as variáveis do Visual Studio, e deverá utilizar o arquivo AssemblyInfo.cs para salvar as informações. Ficando mais ou menos assim.

```
"C:\Program Files\TortoiseSVN\bin\SubWCRev.exe" $(ProjectDir). $(ProjectDir)Properties\AssemblyInfo_template.cs $(ProjectDir)Properties\AssemblyInfo.cs
```

Com tudo pronto, você poderá colocar na sua aplicação, algo que leia esse arquivo e exiba, ou não, a versão do mesmo para o usuário. Claro que, devido a questão de não ser de fato uma compilação, o processo acaba sendo menos interessante, pois é mais fácil manipular algum arquivo e não executar o gulpfile. Porém, se você for fiel ao seu workflow, e utilizar sempre o Gulp para geração dos builds, pode conseguir um grande aliado na organização do seu projeto e na avaliação de versões utilizadas.

Abraço a todos e até o próximo post