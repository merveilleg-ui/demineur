$(document).ready(function() {
    var longueurBoard = 10;
    var board = [];
    var revealed = [];
    var flagged = [];
    var gameOver = false;
    var nombreBombes = 0;
    var outilSelectionne = 'pelle';
    var imageCache = {
        hidden: 'images/Grass.jpg',
        bomb: 'images/bomb.jpg',
        flag: 'images/flag.jpg'
    };

    function appliquerStyle() {
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
            'max-height': '66vh',
            'overflow': 'hidden'
        });

        $('.case').css({
            'cursor': 'pointer',
            'border': '2px solid black',
            'box-sizing': 'border-box',
            'background-color': '#7aa35a',
            'padding': '0',
            'font-size': '18px',
            'font-weight': 'bold'
        });
    }

    function afficherInstructions() {
        var texte = 'Choisissez la longueur du plateau : ' +
            longueurBoard + ' x ' + longueurBoard +
            '. Pour gagner, trouvez toutes les cases ne cachant pas de bombes. ' +
            'Les nombres indiquent les bombes dans les cases voisines. ' +
            'Choisissez la pelle pour retourner une case ou le drapeau pour la marquer.';

        if ($('#instructions').length === 0) {
            $('#status').before('<p id="instructions"></p>');
        }
        $('#instructions').html(texte);
    }

    function creergrille(lon) {
        var grille = [];
        for (var i = 0; i < lon; i++) {
            grille[i] = [];
            for (var j = 0; j < lon; j++) {
                grille[i][j] = '';
            }
        }
        return grille;
    }

    function creerCases() {
        var grille = $('#grille');
        var nombreCases = longueurBoard * longueurBoard;
        grille.empty();
        grille.css('--longueur-board', longueurBoard);

        for (var i = 0; i < nombreCases; i++) {
            grille.append(
                '<button class="case" data-index="' + i +
                '" type="button" aria-label="Case cachée"></button>'
            );
        }

        $('.case')
            .on('mouseenter', function() {
                if (!gameOver) {
                    $(this).css('background-color', '#eeeeee');
                }
            })
            .on('mouseleave', function() {
                $(this).css('background-color', 'white');
            })
            .on('click', function() {
                var index = Number($(this).attr('data-index'));
                if (outilSelectionne === 'drapeau') {
                    drapeau(index);
                } else {
                    creuser(index);
                }
            })
            .on('contextmenu', function(event) {
                event.preventDefault();
                drapeau(Number($(this).attr('data-index')));
            });

        appliquerStyle();
        dimensionnerCases();
    }

    function dimensionnerCases() {
        var largeurDisponible = $(window).width() * 0.94;
        var hauteurDisponible = $(window).height() * 0.62;
        var tailleCase = Math.floor(Math.min(
            largeurDisponible / longueurBoard,
            hauteurDisponible / longueurBoard
        ));

        tailleCase = Math.min(80, tailleCase);
        tailleCase = Math.max(8, tailleCase);
        $('#grille').css({
            'grid-template-columns': 'repeat(' + longueurBoard + ', ' +
                tailleCase + 'px)',
            'grid-auto-rows': tailleCase + 'px'
        });
        $('.case').css({
            'width': tailleCase + 'px',
            'height': tailleCase + 'px'
        });
    }

    function afficherGrille() {
        var cases = $('.case');
        for (var i = 0; i < cases.length; i++) {
            var ligne = Math.floor(i / longueurBoard);
            var colonne = i % longueurBoard;
            var caseElement = $(cases[i]);
            var valeur = board[ligne][colonne];

            caseElement.empty().css({
                'background-image': 'none',
                'background-size': 'cover',
                'background-position': 'center',
                'background-color': '#7aa35a',
                'color': 'black'
            });

            if (flagged[ligne][colonne]) {
                caseElement.css('background-image',
                    'url("' + imageCache.flag + '")');
                caseElement.attr('aria-label', 'Drapeau');
            } else if (revealed[ligne][colonne] && valeur === 'x') {
                caseElement.css('background-image',
                    'url("' + imageCache.bomb + '")');
                caseElement.attr('aria-label', 'Bombe');
            } else if (!revealed[ligne][colonne]) {
                caseElement.css('background-image',
                    'url("' + imageCache.hidden + '")');
                caseElement.attr('aria-label', 'Case cachée');
            } else if (valeur > 0) {
                caseElement.text(valeur);
                caseElement.attr('aria-label', valeur + ' bombe(s) autour');
            } else {
                caseElement.attr('aria-label', 'Case vide');
            }
        }
    }

    function miner() {
        var totalCases = longueurBoard * longueurBoard;
        nombreBombes = Math.max(1, Math.floor(totalCases * 0.15));
        var bombesPlacees = 0;

        while (bombesPlacees < nombreBombes) {
            var index = Math.floor(Math.random() * totalCases);
            var ligne = Math.floor(index / longueurBoard);
            var colonne = index % longueurBoard;
            if (board[ligne][colonne] !== 'x') {
                board[ligne][colonne] = 'x';
                bombesPlacees++;
            }
        }
        nombre();
    }

    function nombre() {
        for (var ligne = 0; ligne < longueurBoard; ligne++) {
            for (var colonne = 0; colonne < longueurBoard; colonne++) {
                if (board[ligne][colonne] === 'x') {
                    continue;
                }

                var bombesAutour = 0;
                for (var deltaLigne = -1; deltaLigne <= 1; deltaLigne++) {
                    for (var deltaColonne = -1; deltaColonne <= 1; deltaColonne++) {
                        if (deltaLigne === 0 && deltaColonne === 0) {
                            continue;
                        }
                        var ligneVoisine = ligne + deltaLigne;
                        var colonneVoisine = colonne + deltaColonne;
                        if (ligneVoisine >= 0 && ligneVoisine < longueurBoard &&
                            colonneVoisine >= 0 &&
                            colonneVoisine < longueurBoard &&
                            board[ligneVoisine][colonneVoisine] === 'x') {
                            bombesAutour++;
                        }
                    }
                }
                board[ligne][colonne] = bombesAutour;
            }
        }
    }

    function creuser(index) {
        if (gameOver || index < 0 || index >= longueurBoard * longueurBoard) {
            return;
        }

        var ligne = Math.floor(index / longueurBoard);
        var colonne = index % longueurBoard;
        if (flagged[ligne][colonne] || revealed[ligne][colonne]) {
            return;
        }

        revealed[ligne][colonne] = true;
        if (board[ligne][colonne] === 'x') {
            boum();
            return;
        }

        if (board[ligne][colonne] === 0) {
            for (var deltaLigne = -1; deltaLigne <= 1; deltaLigne++) {
                for (var deltaColonne = -1; deltaColonne <= 1; deltaColonne++) {
                    var ligneVoisine = ligne + deltaLigne;
                    var colonneVoisine = colonne + deltaColonne;
                    if ((deltaLigne !== 0 || deltaColonne !== 0) &&
                        ligneVoisine >= 0 &&
                        ligneVoisine < longueurBoard &&
                        colonneVoisine >= 0 &&
                        colonneVoisine < longueurBoard) {
                        creuser(
                            ligneVoisine * longueurBoard + colonneVoisine
                        );
                    }
                }
            }
        }

        afficherGrille();
        finish();
    }

    function drapeau(index) {
        if (gameOver || index < 0 || index >= longueurBoard * longueurBoard) {
            return;
        }

        var ligne = Math.floor(index / longueurBoard);
        var colonne = index % longueurBoard;
        if (revealed[ligne][colonne]) {
            return;
        }
        flagged[ligne][colonne] = !flagged[ligne][colonne];
        afficherGrille();
    }

    function choisirOutil(outil) {
        outilSelectionne = outil;
        $('.outil').removeClass('selectionne');
        if (outil === 'pelle') {
            $('#outil-pelle').addClass('selectionne');
        } else {
            $('#outil-drapeau').addClass('selectionne');
        }
    }

    function aide() {
        if (gameOver) {
            return;
        }

        for (var index = 0; index < longueurBoard * longueurBoard; index++) {
            var ligne = Math.floor(index / longueurBoard);
            var colonne = index % longueurBoard;
            if (!revealed[ligne][colonne] && !flagged[ligne][colonne]) {
                if (board[ligne][colonne] === 'x') {
                    flagged[ligne][colonne] = true;
                } else {
                    creuser(index);
                }
                afficherGrille();
                return;
            }
        }
    }

    function boum() {
        gameOver = true;
        for (var ligne = 0; ligne < longueurBoard; ligne++) {
            for (var colonne = 0; colonne < longueurBoard; colonne++) {
                if (board[ligne][colonne] === 'x') {
                    revealed[ligne][colonne] = true;
                }
            }
        }
        afficherGrille();
        $('#status').text('Perdu ! Vous avez touché une bombe.');
    }

    function finish() {
        for (var ligne = 0; ligne < longueurBoard; ligne++) {
            for (var colonne = 0; colonne < longueurBoard; colonne++) {
                if (board[ligne][colonne] !== 'x' &&
                    !revealed[ligne][colonne]) {
                    return;
                }
            }
        }
        gameOver = true;
        $('#status').text('Bravo ! Vous avez gagné.');
    }

    $('#reinitialiser').click(function() {
        board = creergrille(longueurBoard);
        revealed = creergrille(longueurBoard);
        flagged = creergrille(longueurBoard);
        gameOver = false;
        miner();
        afficherGrille();
        $('#status').text('');
    });

    $('#outil-pelle').click(function() {
        choisirOutil('pelle');
    });

    $('#outil-drapeau').click(function() {
        choisirOutil('drapeau');
    });

    $('#aide').click(aide);

    $('#taille-board').on('input', function() {
        var tailleChoisie = Number($(this).val());
        $('#valeur-taille').html(tailleChoisie);
        $('#instructions').html(
            'Vous avez choisi un plateau de ' + tailleChoisie + ' x ' +
            tailleChoisie + '.'
        );
    });

    $(window).on('resize', dimensionnerCases);

    $('#nouvelle-partie').click(function() {
        longueurBoard = Number($('#taille-board').val());
        board = creergrille(longueurBoard);
        revealed = creergrille(longueurBoard);
        flagged = creergrille(longueurBoard);
        gameOver = false;
        miner();
        appliquerStyle();
        afficherInstructions();
        creerCases();
        afficherGrille();
        $('#status').text('');
    });

    board = creergrille(longueurBoard);
    revealed = creergrille(longueurBoard);
    flagged = creergrille(longueurBoard);
    miner();
    appliquerStyle();
    creerCases();
    afficherInstructions();
    afficherGrille();
});
