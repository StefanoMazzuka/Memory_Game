"use strict";

$(function () {

    let allCards = [
        "animation.png",
        "anonymous_mask.png",
        "binoculars.png",
        "darth_vader.png",
        "fantasy.png",
        "film_soundtracks.png",
        "finn.png",
        "full_moon.png",
        "iron_man.png",
        "jake.png",
        "mermaid.png",
        "musical.png",
        "new_moon.png",
        "r2_d2.png",
        "star_trek_symbol.png",
        "superman.png",
        "the_flash_sign.png",
        "unicorn.png"
    ]

    let pointsManagement = [];
    let points;
    let clicks;
    let firstCard = {
        id: '',
        alt: ''
    };
    let secondCard = {
        id: '',
        alt: ''
    };
    let waiting;
    let bestClicks;
    let endGame;

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function createCurrentCards(size) {

        let currentCards = [];
        let cardListGenerator = function (arr) {
            if (arr.length >= size) return;
            let newCard = Math.floor(Math.random() * allCards.length);
            if (arr.indexOf(newCard) < 0) {
                arr.push(newCard);
                arr.push(newCard);
            }
            cardListGenerator(arr);
        };
        cardListGenerator(currentCards);
        shuffle(currentCards);

        return currentCards;
    }

    $('#start').on({
        'click': function () {
            // Inicializamos valores
            $('#board').empty();
            $('#guessedCards').empty();
            points = 0;
            clicks = 0;
            bestClicks = 0;
            endGame = 0;
            waiting = false;

            $('#clicks').text(`${clicks} clicks`);
            $('#points').text(`${points} points`);
            $('#bestClicks').text('');

            // Creamos el tablero
            let difficulty = $("#buttons input[type='radio']:checked").val();
            let size;
            let numColumns;
            if (difficulty === 'easy') {
                size = 12;
                numColumns = 6;
            } else if (difficulty === 'medium') {
                size = 24;
                numColumns = 8;
            } else if (difficulty === 'hard') {
                size = 36;
                numColumns = 9;
            }

            let row = 0;
            let currentCards = createCurrentCards(size);
            for (let i = 0; i < currentCards.length; i++) {
                $('#board').append(`<div class="row" id="row${row}">`);
                for (let j = 0; j < numColumns; j++) {
                    $(`#row${row}`).append($(`<div class="cardContainer"><img id="${i}" alt="${currentCards[i]}" class="card" src="./img/question_mark.png"/></div>`));
                    let card = {
                        id: i,
                        alt: currentCards[i],
                        flipped: false
                    };
                    pointsManagement.push(card);
                    if (j != numColumns - 1) i++;
                }
                row++;
            }

            for (let i = 0; i < pointsManagement.length; i++) {
                console.log("id " + pointsManagement[i].id + " alt " + pointsManagement[i].alt + " flipped " + pointsManagement[i].flipped);
            }
        }
    });

    $('body').on('click', 'img', function () {
        if (!waiting && $(this).prop('src').endsWith("question_mark.png")) {
            clicks++;
            bestClicks++;
            $('#clicks').text(`${clicks} clicks`);
            $(this).prop('src', `./img/` + allCards[$(this).prop('alt')]);

            if (!pointsManagement[$(this).prop('id')].flipped)
                pointsManagement[$(this).prop('id')].flipped = true;
            // BORRAR
            console.clear();
            for (let i = 0; i < pointsManagement.length; i++) {
                console.log("id " + pointsManagement[i].id + " alt " + pointsManagement[i].alt + " flipped " + pointsManagement[i].flipped);
            }
            // BORRAR
            if (clicks % 2 != 0) {
                firstCard.id = $(this).prop('id');
                firstCard.alt = $(this).prop('alt');
            } else {
                waiting = true;
                secondCard.id = $(this).prop('id');
                secondCard.alt = $(this).prop('alt');

                setTimeout(function () {
                    if (firstCard.alt === secondCard.alt) {                        
                        endGame++;
                        if (endGame == pointsManagement.length / 2)
                        $('#bestClicks').text(`best range ${bestClicks} clicks`);
                        
                        points += 20;
                        $('#points').text(`${points} points`);
                        $(`#${firstCard.id}`).attr('class', 'cardHidden');
                        $(`#${secondCard.id}`).attr('class', 'cardHidden');
                        $('#guessedCards').append($(`<img src="./img/${allCards[firstCard.alt]}" height="42" width="42"/>`));
                    } else {
                        if (points > 0) {
                            for (let i = 0; i < pointsManagement.length; i++) {
                                if (pointsManagement[i].id != firstCard.id) {
                                    if (pointsManagement[i].alt == firstCard.alt) {
                                        if (pointsManagement[i].flipped == true) {
                                            points--;
                                            bestClicks--;
                                        }
                                    }
                                }
                            }

                            $('#points').text(`${points} points`);
                        }
                        $(`#${firstCard.id}`).prop('src', './img/question_mark.png');
                        $(`#${secondCard.id}`).prop('src', './img/question_mark.png');
                    }
                    waiting = false;
                }, 500);

            }
        }
    });
});