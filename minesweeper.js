$(document).ready(function() {
    var longueurBoard=10;



    //fonction pour le style
    function appliquerStyle(){
        $('body').css({
            'font-family': 'Arial, sans-serif',
            'text-align': 'center'
        });

        $('#grille').css({
            'display': 'grid',
            'gap': '12px',
            'justify-content': 'center',
            'margin': '20px auto',
            'max-width': '90vw',
            'max-height': '65vh',
            'overflow': 'auto'
        });

        $('.case').css({
            'cursor': 'pointer',
            'border': '2px solid black',
            'box-sizing': 'border-box',
            'background-color': 'white'
        });
    }

    function afficherInstructions(){
        var texte = 'Choisissez la longueur du plateau : ' +
            longueurBoard + ' x ' + longueurBoard +
            '. Pour gagner, trouvez toutes les cases ne cachant pas de bombes. Si une case contient un nombre, ce nombre représente le nombre de bombes totales dans les 6 cases entourant la case numérée. Vous pouvez vous aider des drapeaux pour marquer les cases que vous pensez contenir une bombe!';


        if($('#instructions').length === 0){
            $('#status').before('<p id="instructions"></p>');
        }

        $('#instructions').html(texte);
    }

    //creer la grille
    function creergrille(lon){
        var grille = [];

        for (var i = 0; i < lon; i++) {
            grille[i] = [];
            for (var j = 0; j < lon; j++) {
                grille[i][j] = '';
            }
        }
        return grille;
    }


    function creerCases(){
        var grille = $('#grille');
        var nombreCases = longueurBoard * longueurBoard;

        grille.empty();
        grille.css('--longueur-board', longueurBoard);

        for(var i=0; i<nombreCases; i++){
            grille.append(
                '<img class="case" data-index="' + i +
                '" src="img/img/vide.png" alt="Case vide" ' +
                '>'
            );
        }

        $('.case')
            .css({
                'cursor': 'pointer',
                'border': '2px solid black',
                'box-sizing': 'border-box',
                'background-color': 'white'
            })
            .on('mouseenter', function(){
                $(this).css('background-color', '#eeeeee');
            })
            .on('mouseleave', function(){
                $(this).css('background-color', 'white');
            });

        dimensionnerCases();
    }

    function dimensionnerCases(){
        var largeurDisponible = $(window).width() * 0.9;
        var hauteurDisponible = $(window).height() * 0.55;
        var espaceDisponible = Math.min(
            largeurDisponible,
            hauteurDisponible
        );
        var tailleCase = Math.floor(espaceDisponible / longueurBoard);

        tailleCase = Math.min(80, tailleCase);
        tailleCase = Math.max(16, tailleCase);

        $('#grille').css({
            'grid-template-columns': 'repeat(' + longueurBoard + ', ' + tailleCase + 'px)',
            'grid-auto-rows': tailleCase + 'px'
        });

        $('.case').css({
            'width': tailleCase + 'px',
            'height': tailleCase + 'px'
        });
    }


    function afficherGrille(){
        var cases = $('.case');
        var image;

        for(var i=0; i<cases.length; i++){
            var ligne = Math.floor(i / longueurBoard);
            var colonne = i % longueurBoard;

            if(board[ligne][colonne] === 'x'){
                image = 'img/img/croix.png';
            }
            else if(board[ligne][colonne] === 'o'){
                image = 'img/img/cercle.png';
            }
            else{
                image = 'img/img/vide.png';
            }

            $(cases[i]).attr('src', image);
        }


    }


    //calcule le nbr de bombes à placer et leur accorde des places al
    //place les bombes, possiblement coder pour pas avoir >4 bombes entourant une case  AJOUTER A CREERGRILLE
    function miner(){}


    //place les nombres dans les cases autour des bombes  AJOUTER DANS MINER OU CREERGRILLE
    function nombre(){}


    //retourne une case(nombre ou bombe)
    function creuser()

    // poser un drapeau
    function drapeau(){}

    //explose?
    function boum(){}





    //verifie si le joueur a decouvert toutes les bombes ou touche une bombe
    //garder
    function finish(){}

    $('#reinitialiser').click(function(){
        for(var ligne=0; ligne<longueurBoard; ligne++){
            for(var colonne=0; colonne<longueurBoard; colonne++){
                board[ligne][colonne] = '';
            }
        }

        gameOver = false;
        afficherGrille();

    })


    $('#taille-board').on('input', function(){
        var tailleChoisie = Number($(this).val());

        $('#valeur-taille').html(tailleChoisie);
        $('#instructions').html(
            'Vous avez choisi un plateau de ' + tailleChoisie + ' x ' +
            tailleChoisie + '.'
        );
    });

    $(window).on('resize', dimensionnerCases);

    $('#nouvelle-partie').click(function(){
        longueurBoard = Number($('#taille-board').val());

        board = creergrille(longueurBoard);
        appliquerStyle();
        afficherInstructions();
        creerCases();
        gameOver = false;
        afficherGrille();

    });

    creerCases();
    afficherInstructions();
    afficherGrille();



})
